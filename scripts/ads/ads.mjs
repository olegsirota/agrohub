#!/usr/bin/env node
/**
 * ads.mjs — управление рекламными кампаниями АгроХаба из терминала / Claude Code.
 *
 * Поддерживаются два кабинета:
 *   direct — Яндекс Директ (API v5 / v501, https://api.direct.yandex.com)
 *   vk     — VK Реклама (ads.vk.com, API v2/v3)
 *
 * Зависимостей нет: только Node 18+ (fetch). Токены берутся из переменных
 * окружения (или из файла .env в корне репозитория, он в .gitignore).
 * Полное описание переменных и настройки — в scripts/ads/README.md.
 *
 * Примеры:
 *   npm run ads -- check
 *   npm run ads -- direct campaigns
 *   npm run ads -- direct stats --period LAST_7_DAYS
 *   npm run ads -- direct suspend 12345678
 *   npm run ads -- direct budget 12345678 1500
 *   npm run ads -- vk campaigns
 *   npm run ads -- vk stats --from 2026-10-01 --to 2026-10-12
 *   npm run ads -- vk stop 987654
 *   npm run ads -- vk budget 987654 --day 1000
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Общие утилиты
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

/** Подгружаем .env из корня репозитория, не перекрывая уже заданные переменные. */
function loadDotEnv() {
  const file = path.join(REPO_ROOT, '.env');
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

/** Разбор argv: позиционные аргументы + флаги вида --key value / --flag. */
function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function fail(msg, code = 1) {
  console.error(`Ошибка: ${msg}`);
  process.exit(code);
}

function requireEnv(name, hint) {
  const v = process.env[name];
  if (!v) fail(`не задана переменная окружения ${name}. ${hint ?? ''}`.trim());
  return v;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseIds(s) {
  if (!s) return [];
  return String(s)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => (/^\d+$/.test(x) ? Number(x) : x));
}

function fmtMoney(n) {
  if (n === undefined || n === null || n === '' || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtInt(n) {
  if (n === undefined || n === null || n === '' || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString('ru-RU');
}

/** Простая таблица с выравниванием по ширине колонок. */
function printTable(rows, columns) {
  if (!rows.length) {
    console.log('(пусто)');
    return;
  }
  const cells = rows.map((r) => columns.map((c) => String(c.get(r) ?? '')));
  const widths = columns.map((c, i) => Math.max(c.title.length, ...cells.map((row) => row[i].length)));
  const line = (vals) =>
    vals.map((v, i) => (columns[i].align === 'right' ? v.padStart(widths[i]) : v.padEnd(widths[i]))).join('  ');
  console.log(line(columns.map((c) => c.title)));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const row of cells) console.log(line(row));
}

/** ISO-дата в часовом поясе кабинета (Москва). */
function isoDate(d, tz = 'Europe/Moscow') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

function daysAgo(n) {
  return isoDate(new Date(Date.now() - n * 86400000));
}

// ---------------------------------------------------------------------------
// Яндекс Директ
// ---------------------------------------------------------------------------

const DIRECT_MICRO = 1_000_000;

/** Сервисы, которые поддерживают ЕПК (единые перфоманс-кампании), живут на v501. */
const DIRECT_V501_SERVICES = new Set(['campaigns', 'adgroups', 'ads']);

function directBase() {
  if (process.env.YANDEX_DIRECT_API_BASE) return process.env.YANDEX_DIRECT_API_BASE.replace(/\/$/, '');
  return process.env.YANDEX_DIRECT_SANDBOX ? 'https://api-sandbox.direct.yandex.com' : 'https://api.direct.yandex.com';
}

function directHeaders(extra = {}) {
  const token = requireEnv('YANDEX_DIRECT_TOKEN', 'Как получить — см. scripts/ads/README.md');
  const h = {
    Authorization: `Bearer ${token}`,
    'Accept-Language': 'ru',
    'Content-Type': 'application/json; charset=utf-8',
    ...extra,
  };
  if (process.env.YANDEX_DIRECT_CLIENT_LOGIN) h['Client-Login'] = process.env.YANDEX_DIRECT_CLIENT_LOGIN;
  return h;
}

/** Вызов JSON-метода Директа: directCall('campaigns', 'get', {...}). */
async function directCall(service, method, params) {
  const version = DIRECT_V501_SERVICES.has(service) ? 'v501' : 'v5';
  const url = `${directBase()}/json/${version}/${service}`;
  const res = await fetch(url, { method: 'POST', headers: directHeaders(), body: JSON.stringify({ method, params }) });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    fail(`Директ вернул не-JSON (HTTP ${res.status}): ${text.slice(0, 300)}`);
  }
  if (data.error) {
    const e = data.error;
    fail(`Директ ${service}.${method}: [${e.error_code}] ${e.error_string}. ${e.error_detail ?? ''}`.trim());
  }
  const units = res.headers.get('Units');
  if (units && process.env.ADS_VERBOSE) console.error(`[Директ] баллы: ${units}`);
  return data.result;
}

/** Печатает ошибки/предупреждения из *Results и возвращает число успешных операций. */
function directReportResults(results, label, ids = []) {
  let ok = 0;
  (results ?? []).forEach((r, i) => {
    const id = r.Id ?? ids[i] ?? '';
    if (r.Errors?.length) {
      for (const e of r.Errors) console.log(`  ✗ ${label} ${id}: [${e.Code}] ${e.Message} ${e.Details ?? ''}`.trim());
    } else {
      ok++;
      const warn = (r.Warnings ?? []).map((w) => `[${w.Code}] ${w.Message}`).join('; ');
      console.log(`  ✓ ${label} ${id}${warn ? `  (предупреждение: ${warn})` : ''}`);
    }
  });
  return ok;
}

async function directCampaigns(flags) {
  const criteria = {};
  if (flags.ids) criteria.Ids = parseIds(flags.ids);
  if (!flags.all && !flags.ids) {
    // По умолчанию прячем архивные.
    criteria.States = ['ON', 'OFF', 'SUSPENDED', 'ENDED', 'CONVERTED'];
  }
  const result = await directCall('campaigns', 'get', {
    SelectionCriteria: criteria,
    FieldNames: ['Id', 'Name', 'Type', 'State', 'Status', 'StatusPayment', 'DailyBudget', 'Funds', 'StartDate', 'EndDate', 'Statistics'],
  });
  const campaigns = result?.Campaigns ?? [];
  if (flags.json) return console.log(JSON.stringify(campaigns, null, 2));

  printTable(campaigns, [
    { title: 'ID', get: (c) => c.Id },
    { title: 'Название', get: (c) => c.Name },
    { title: 'Тип', get: (c) => c.Type },
    { title: 'Состояние', get: (c) => c.State },
    { title: 'Статус', get: (c) => c.Status },
    { title: 'Оплата', get: (c) => c.StatusPayment },
    { title: 'Бюджет/день', align: 'right', get: (c) => (c.DailyBudget ? fmtMoney(c.DailyBudget.Amount / DIRECT_MICRO) : '—') },
    { title: 'Баланс', align: 'right', get: (c) => (c.Funds?.CampaignFunds ? fmtMoney(c.Funds.CampaignFunds.Balance / DIRECT_MICRO) : c.Funds?.Mode === 'SHARED' ? 'общий счёт' : '—') },
    { title: 'Показы', align: 'right', get: (c) => fmtInt(c.Statistics?.Impressions) },
    { title: 'Клики', align: 'right', get: (c) => fmtInt(c.Statistics?.Clicks) },
    { title: 'Период', get: (c) => `${c.StartDate ?? ''}${c.EndDate ? ` — ${c.EndDate}` : ''}` },
  ]);
  console.log(`\nВсего кампаний: ${campaigns.length}${result?.LimitedBy ? ' (список обрезан, есть ещё)' : ''}`);
}

async function directToggle(method, flags, positional) {
  const ids = parseIds(positional[0] ?? flags.ids);
  if (!ids.length) fail(`укажите ID кампаний: direct ${method} 123,456`);
  const result = await directCall('campaigns', method, { SelectionCriteria: { Ids: ids } });
  const key = method === 'suspend' ? 'SuspendResults' : method === 'resume' ? 'ResumeResults' : 'ArchiveResults';
  const ok = directReportResults(result?.[key], 'кампания', ids);
  console.log(`${method === 'suspend' ? 'Остановлено' : 'Запущено'}: ${ok} из ${ids.length}`);
}

async function directBudget(flags, positional) {
  const id = Number(positional[0]);
  const rub = Number(String(positional[1] ?? '').replace(',', '.'));
  if (!id || !rub) fail('использование: direct budget <id кампании> <рублей в день> [--mode STANDARD|DISTRIBUTED]');
  const mode = String(flags.mode ?? 'STANDARD').toUpperCase();
  const result = await directCall('campaigns', 'update', {
    Campaigns: [{ Id: id, DailyBudget: { Amount: Math.round(rub * DIRECT_MICRO), Mode: mode } }],
  });
  directReportResults(result?.UpdateResults, 'кампания', [id]);
  console.log('Напоминание: дневной бюджет работает только с ручной стратегией; менять его можно не более 3 раз в сутки.');
}

async function directKeywords(flags, positional) {
  const campaignIds = parseIds(positional[0] ?? flags.campaign);
  if (!campaignIds.length) fail('использование: direct keywords <id кампании>');
  const result = await directCall('keywords', 'get', {
    SelectionCriteria: { CampaignIds: campaignIds },
    FieldNames: ['Id', 'Keyword', 'AdGroupId', 'State', 'Status', 'Bid', 'ContextBid', 'StatisticsSearch'],
  });
  const kws = result?.Keywords ?? [];
  if (flags.json) return console.log(JSON.stringify(kws, null, 2));
  printTable(kws, [
    { title: 'ID', get: (k) => k.Id },
    { title: 'Группа', get: (k) => k.AdGroupId },
    { title: 'Фраза', get: (k) => k.Keyword },
    { title: 'Сост.', get: (k) => k.State },
    { title: 'Статус', get: (k) => k.Status },
    { title: 'Ставка', align: 'right', get: (k) => (k.Bid ? fmtMoney(k.Bid / DIRECT_MICRO) : '—') },
    { title: 'Показы', align: 'right', get: (k) => fmtInt(k.StatisticsSearch?.Impressions) },
    { title: 'Клики', align: 'right', get: (k) => fmtInt(k.StatisticsSearch?.Clicks) },
  ]);
  console.log(`\nФраз: ${kws.length}`);
}

const DIRECT_DATE_RANGES = new Set([
  'TODAY', 'YESTERDAY', 'LAST_3_DAYS', 'LAST_5_DAYS', 'LAST_7_DAYS', 'LAST_14_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', 'LAST_365_DAYS',
  'THIS_WEEK_MON_TODAY', 'THIS_WEEK_SUN_TODAY', 'LAST_WEEK', 'LAST_BUSINESS_WEEK', 'LAST_WEEK_SUN_SAT', 'THIS_MONTH', 'LAST_MONTH', 'ALL_TIME', 'CUSTOM_DATE', 'AUTO',
]);

async function directStats(flags) {
  const byDay = Boolean(flags['by-day']);
  const fields = flags.fields
    ? String(flags.fields).split(',').map((s) => s.trim())
    : [...(byDay ? ['Date'] : []), 'CampaignId', 'CampaignName', 'Impressions', 'Clicks', 'Ctr', 'Cost', 'AvgCpc', 'Conversions'];

  const params = {
    SelectionCriteria: {},
    FieldNames: fields,
    ReportName: `agrohub-${Date.now()}`,
    ReportType: 'CAMPAIGN_PERFORMANCE_REPORT',
    DateRangeType: 'CUSTOM_DATE',
    Format: 'TSV',
    IncludeVAT: flags['no-vat'] ? 'NO' : 'YES',
  };
  if (flags.period) {
    const p = String(flags.period).toUpperCase();
    if (!DIRECT_DATE_RANGES.has(p)) fail(`неизвестный период ${p}. Примеры: TODAY, YESTERDAY, LAST_7_DAYS, LAST_30_DAYS, THIS_MONTH, LAST_MONTH`);
    params.DateRangeType = p;
  } else {
    params.SelectionCriteria.DateFrom = flags.from ?? daysAgo(7);
    params.SelectionCriteria.DateTo = flags.to ?? daysAgo(1);
  }
  if (flags.ids) params.SelectionCriteria.Filter = [{ Field: 'CampaignId', Operator: 'IN', Values: parseIds(flags.ids).map(String) }];
  if (flags.goals) params.Goals = parseIds(flags.goals).map(String);

  const headers = directHeaders({
    processingMode: 'auto',
    returnMoneyInMicros: 'false',
    skipReportHeader: 'true',
    skipReportSummary: 'true',
  });
  const url = `${directBase()}/json/v5/reports`;

  let tsv;
  for (let attempt = 0; attempt < 30; attempt++) {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ params }) });
    const text = await res.text();
    if (res.status === 200) {
      tsv = text;
      break;
    }
    if (res.status === 201 || res.status === 202) {
      const retryIn = Number(res.headers.get('retryIn') ?? 5);
      if (attempt === 0) console.error(`Отчёт ставится в очередь, жду ${retryIn} с…`);
      await sleep(retryIn * 1000);
      continue;
    }
    let msg = text;
    try {
      const e = JSON.parse(text).error;
      msg = `[${e.error_code}] ${e.error_string}. ${e.error_detail ?? ''}`;
    } catch { /* оставляем сырой текст */ }
    fail(`Директ reports (HTTP ${res.status}): ${msg}`);
  }
  if (tsv === undefined) fail('отчёт не был готов за отведённое время, попробуйте ещё раз');

  const lines = tsv.split('\n').filter((l) => l.trim());
  if (flags.raw) return console.log(tsv);
  const header = lines[0].split('\t');
  const rows = lines.slice(1).map((l) => Object.fromEntries(l.split('\t').map((v, i) => [header[i], v])));
  if (flags.json) return console.log(JSON.stringify(rows, null, 2));

  const money = new Set(['Cost', 'AvgCpc', 'AvgCpm', 'CostPerConversion', 'Revenue', 'Profit']);
  const ints = new Set(['Impressions', 'Clicks', 'Conversions', 'Sessions', 'Bounces']);
  printTable(
    rows,
    header.map((h) => ({
      title: h,
      align: money.has(h) || ints.has(h) || h === 'Ctr' ? 'right' : 'left',
      get: (r) => (money.has(h) ? fmtMoney(r[h]) : ints.has(h) ? fmtInt(r[h]) : r[h] === '--' ? '—' : r[h]),
    })),
  );
  const totals = rows.reduce(
    (acc, r) => {
      acc.Impressions += Number(r.Impressions ?? 0);
      acc.Clicks += Number(r.Clicks ?? 0);
      acc.Cost += Number(r.Cost ?? 0);
      acc.Conversions += Number(r.Conversions === '--' ? 0 : r.Conversions ?? 0);
      return acc;
    },
    { Impressions: 0, Clicks: 0, Cost: 0, Conversions: 0 },
  );
  const ctr = totals.Impressions ? ((totals.Clicks / totals.Impressions) * 100).toFixed(2) : '—';
  console.log(`\nИтого: показы ${fmtInt(totals.Impressions)}, клики ${fmtInt(totals.Clicks)}, CTR ${ctr}%, расход ${fmtMoney(totals.Cost)} ₽${
    totals.Conversions ? `, конверсии ${fmtInt(totals.Conversions)}` : ''
  }`);
}

async function directRaw(positional) {
  const [service, method, json] = positional;
  if (!service || !method) fail("использование: direct raw <service> <method> '<params JSON>'  (например: direct raw campaigns get '{\"SelectionCriteria\":{},\"FieldNames\":[\"Id\",\"Name\"]}')");
  const params = json ? JSON.parse(json) : {};
  const result = await directCall(service, method, params);
  console.log(JSON.stringify(result, null, 2));
}

async function directCheck() {
  const result = await directCall('clients', 'get', {
    FieldNames: ['Login', 'ClientId', 'Currency', 'Type', 'AccountQuality', 'Representatives'],
  });
  const c = result?.Clients?.[0];
  if (!c) return console.log('Директ: токен принят, но список клиентов пуст (для агентств задайте YANDEX_DIRECT_CLIENT_LOGIN).');
  console.log(`Директ: OK — логин ${c.Login}, ClientId ${c.ClientId}, валюта ${c.Currency}${process.env.YANDEX_DIRECT_SANDBOX ? ' (ПЕСОЧНИЦА)' : ''}`);
}

async function runDirect(cmd, flags, positional) {
  switch (cmd) {
    case 'campaigns':
    case 'list':
      return directCampaigns(flags);
    case 'stats':
    case 'report':
      return directStats(flags);
    case 'suspend':
    case 'stop':
    case 'pause':
      return directToggle('suspend', flags, positional);
    case 'resume':
    case 'start':
      return directToggle('resume', flags, positional);
    case 'budget':
      return directBudget(flags, positional);
    case 'keywords':
      return directKeywords(flags, positional);
    case 'raw':
      return directRaw(positional);
    case 'check':
      return directCheck();
    default:
      fail(`неизвестная команда direct ${cmd}. См. --help`);
  }
}

// ---------------------------------------------------------------------------
// VK Реклама (ads.vk.com)
// ---------------------------------------------------------------------------

function vkBase() {
  return (process.env.VK_ADS_API_BASE ?? 'https://ads.vk.com').replace(/\/$/, '');
}

const VK_TOKEN_CACHE = path.join(process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), '.cache'), 'agrohub-ads', 'vk-token.json');

function vkReadCachedToken() {
  try {
    const cached = JSON.parse(fs.readFileSync(VK_TOKEN_CACHE, 'utf8'));
    if (cached.client_id === process.env.VK_ADS_CLIENT_ID && cached.expires_at > Date.now() + 60_000) return cached.access_token;
  } catch { /* кэша нет */ }
  return null;
}

function vkWriteCachedToken(token, expiresIn) {
  try {
    fs.mkdirSync(path.dirname(VK_TOKEN_CACHE), { recursive: true });
    fs.writeFileSync(
      VK_TOKEN_CACHE,
      JSON.stringify({ client_id: process.env.VK_ADS_CLIENT_ID, access_token: token, expires_at: Date.now() + expiresIn * 1000 }),
      { mode: 0o600 },
    );
  } catch (e) {
    console.error(`[VK] не удалось сохранить кэш токена: ${e.message}`);
  }
}

async function vkOAuth(form) {
  const res = await fetch(`${vkBase()}/api/v2/oauth2/token.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(form).toString(),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    fail(`VK OAuth вернул не-JSON (HTTP ${res.status}): ${text.slice(0, 300)}`);
  }
  return { status: res.status, data };
}

/**
 * Токен VK: либо готовый VK_ADS_TOKEN, либо получаем по client_credentials
 * (VK_ADS_CLIENT_ID + VK_ADS_CLIENT_SECRET, опционально VK_ADS_AGENCY_CLIENT_ID)
 * и кэшируем на сутки, чтобы не упираться в лимит 5 токенов.
 */
async function vkToken() {
  if (process.env.VK_ADS_TOKEN) return process.env.VK_ADS_TOKEN;
  const clientId = requireEnv('VK_ADS_CLIENT_ID', 'Либо задайте готовый VK_ADS_TOKEN. См. scripts/ads/README.md');
  const clientSecret = requireEnv('VK_ADS_CLIENT_SECRET');

  const cached = vkReadCachedToken();
  if (cached) return cached;

  const form = { grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret };
  if (process.env.VK_ADS_AGENCY_CLIENT_ID) {
    form.grant_type = 'agency_client_credentials';
    form.agency_client_id = process.env.VK_ADS_AGENCY_CLIENT_ID;
  }

  let { status, data } = await vkOAuth(form);
  if (data.error === 'token_limit_exceeded' || data.code === 'token_limit_exceeded') {
    console.error('[VK] достигнут лимит токенов, удаляю старые и запрашиваю новый…');
    await vkOAuth({ client_id: clientId, client_secret: clientSecret, ...(process.env.VK_ADS_AGENCY_CLIENT_ID ? { user_id: process.env.VK_ADS_AGENCY_CLIENT_ID } : {}) })
      .catch(() => null);
    await fetch(`${vkBase()}/api/v2/oauth2/token/delete.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }).toString(),
    });
    ({ status, data } = await vkOAuth(form));
  }
  if (!data.access_token) fail(`VK OAuth (HTTP ${status}): ${JSON.stringify(data)}`);
  vkWriteCachedToken(data.access_token, Number(data.expires_in ?? 86400));
  if (data.tokens_left !== undefined && process.env.ADS_VERBOSE) console.error(`[VK] токенов осталось: ${data.tokens_left}`);
  return data.access_token;
}

async function vkRequest(method, endpoint, { query, body } = {}) {
  const token = await vkToken();
  const url = new URL(`${vkBase()}${endpoint}`);
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      fail(`VK вернул не-JSON (HTTP ${res.status}) на ${method} ${endpoint}: ${text.slice(0, 300)}`);
    }
  }
  if (!res.ok) {
    if (res.status === 401 && !process.env.VK_ADS_TOKEN) {
      try { fs.unlinkSync(VK_TOKEN_CACHE); } catch { /* ничего */ }
    }
    fail(`VK ${method} ${endpoint} (HTTP ${res.status}): ${JSON.stringify(data ?? text).slice(0, 600)}`);
  }
  if (process.env.ADS_VERBOSE) {
    const rem = res.headers.get('X-RateLimit-Hourly-Remaining');
    if (rem) console.error(`[VK] лимит в час, осталось: ${rem}`);
  }
  return data;
}

/** Выгружает все страницы коллекции VK ({count, items}). */
async function vkGetAll(endpoint, query = {}, pageSize = 50) {
  const items = [];
  for (let offset = 0; ; offset += pageSize) {
    const page = await vkRequest('GET', endpoint, { query: { ...query, limit: pageSize, offset } });
    items.push(...(page?.items ?? []));
    if (!page?.items?.length || items.length >= (page.count ?? 0)) break;
  }
  return items;
}

const VK_STATUS_RU = { active: 'активна', blocked: 'остановлена', deleted: 'удалена' };

async function vkCampaigns(flags) {
  const query = { fields: 'id,name,status,budget_limit_day,budget_limit,date_start,date_end,objective,created,updated' };
  if (flags.status) query._status = flags.status;
  else if (!flags.all) query._status__ne = 'deleted';
  if (flags.ids) query._id__in = parseIds(flags.ids).join(',');
  const plans = await vkGetAll('/api/v2/ad_plans.json', query);
  if (flags.json) return console.log(JSON.stringify(plans, null, 2));
  printTable(plans, [
    { title: 'ID', get: (p) => p.id },
    { title: 'Название', get: (p) => p.name },
    { title: 'Статус', get: (p) => VK_STATUS_RU[p.status] ?? p.status },
    { title: 'Цель', get: (p) => p.objective ?? '' },
    { title: 'Бюджет/день', align: 'right', get: (p) => fmtMoney(p.budget_limit_day) },
    { title: 'Бюджет общий', align: 'right', get: (p) => fmtMoney(p.budget_limit) },
    { title: 'Период', get: (p) => `${p.date_start ?? ''}${p.date_end ? ` — ${p.date_end}` : ''}` },
  ]);
  console.log(`\nВсего кампаний: ${plans.length}`);
}

async function vkGroups(flags, positional) {
  const planIds = parseIds(positional[0] ?? flags.campaign);
  const query = {};
  if (planIds.length) query._ad_plan_id__in = planIds.join(',');
  if (flags.status) query._status = flags.status;
  else if (!flags.all) query._status__ne = 'deleted';
  const groups = await vkGetAll('/api/v2/ad_groups.json', query);
  if (flags.json) return console.log(JSON.stringify(groups, null, 2));
  printTable(groups, [
    { title: 'ID', get: (g) => g.id },
    { title: 'Кампания', get: (g) => g.ad_plan_id ?? '' },
    { title: 'Название', get: (g) => g.name },
    { title: 'Статус', get: (g) => VK_STATUS_RU[g.status] ?? g.status },
    { title: 'Бюджет/день', align: 'right', get: (g) => fmtMoney(g.budget_limit_day) },
    { title: 'Ставка', align: 'right', get: (g) => (g.price !== undefined ? fmtMoney(g.price) : '—') },
    { title: 'Период', get: (g) => `${g.date_start ?? ''}${g.date_end ? ` — ${g.date_end}` : ''}` },
  ]);
  console.log(`\nВсего групп: ${groups.length}`);
}

async function vkMassStatus(type, status, flags, positional) {
  const ids = parseIds(positional[0] ?? flags.ids);
  if (!ids.length) fail(`укажите ID: vk ${status === 'active' ? 'start' : 'stop'} 123,456 [--groups]`);
  const endpoint = type === 'groups' ? '/api/v2/ad_groups/mass_action.json' : '/api/v2/ad_plans/mass_action.json';
  const res = await vkRequest('POST', endpoint, { body: ids.map((id) => ({ id, status })) });
  console.log(`${status === 'active' ? 'Запущено' : 'Остановлено'} (${type === 'groups' ? 'группы' : 'кампании'}): ${ids.join(', ')}`);
  if (res) console.log(JSON.stringify(res, null, 2));
}

async function vkBudget(flags, positional) {
  const id = Number(positional[0]);
  if (!id || (!flags.day && !flags.total)) fail('использование: vk budget <id кампании> --day <руб/день> [--total <руб всего>] [--groups]');
  const body = {};
  if (flags.day) body.budget_limit_day = String(Number(String(flags.day).replace(',', '.')).toFixed(2));
  if (flags.total) body.budget_limit = String(Number(String(flags.total).replace(',', '.')).toFixed(2));
  const endpoint = flags.groups ? `/api/v2/ad_groups/${id}.json` : `/api/v2/ad_plans/${id}.json`;
  const res = await vkRequest('POST', endpoint, { body });
  console.log(`Бюджет обновлён для ${id}: ${JSON.stringify(body)}`);
  if (res) console.log(JSON.stringify(res, null, 2));
}

async function vkStats(flags) {
  const type = flags.type ?? 'ad_plans';
  const period = flags['by-day'] ? 'day' : 'summary';
  const dateFrom = flags.from ?? daysAgo(7);
  const dateTo = flags.to ?? daysAgo(0);

  let ids = parseIds(flags.ids);
  const names = new Map();
  if (type === 'ad_plans') {
    const plans = await vkGetAll('/api/v2/ad_plans.json', { fields: 'id,name,status', ...(flags.all ? {} : { _status__ne: 'deleted' }) });
    for (const p of plans) names.set(p.id, p.name);
    if (!ids.length) ids = plans.map((p) => p.id);
  } else if (type === 'ad_groups') {
    const groups = await vkGetAll('/api/v2/ad_groups.json', { fields: 'id,name,status', ...(flags.all ? {} : { _status__ne: 'deleted' }) });
    for (const g of groups) names.set(g.id, g.name);
    if (!ids.length) ids = groups.map((g) => g.id);
  }
  if (!ids.length) fail('нет объектов для статистики (укажите --ids)');
  if (ids.length > 200) {
    console.error(`[VK] объектов ${ids.length}, беру первые 200`);
    ids = ids.slice(0, 200);
  }

  const data = await vkRequest('GET', `/api/v2/statistics/${type}/${period}.json`, {
    query: { id: ids.join(','), date_from: dateFrom, date_to: dateTo, metrics: flags.metrics ?? 'base' },
  });
  if (flags.json) return console.log(JSON.stringify(data, null, 2));

  const rows = [];
  for (const item of data?.items ?? []) {
    const rowList = item.rows?.length ? item.rows : item.total ? [item.total] : [];
    for (const r of rowList) {
      const b = r.base ?? {};
      rows.push({ id: item.id, name: names.get(item.id) ?? '', date: r.date ?? '', shows: b.shows, clicks: b.clicks, ctr: b.ctr, spent: b.spent, cpc: b.cpc, goals: b.goals, cpa: b.cpa });
    }
  }
  printTable(rows, [
    { title: 'ID', get: (r) => r.id },
    { title: 'Название', get: (r) => r.name },
    ...(period === 'day' ? [{ title: 'Дата', get: (r) => r.date }] : []),
    { title: 'Показы', align: 'right', get: (r) => fmtInt(r.shows) },
    { title: 'Клики', align: 'right', get: (r) => fmtInt(r.clicks) },
    { title: 'CTR %', align: 'right', get: (r) => (r.ctr !== undefined ? Number(r.ctr).toFixed(2) : '—') },
    { title: 'Расход ₽', align: 'right', get: (r) => fmtMoney(r.spent) },
    { title: 'CPC ₽', align: 'right', get: (r) => fmtMoney(r.cpc) },
    { title: 'Цели', align: 'right', get: (r) => fmtInt(r.goals) },
    { title: 'CPA ₽', align: 'right', get: (r) => fmtMoney(r.cpa) },
  ]);
  const t = data?.total?.base;
  if (t) {
    console.log(`\nИтого за ${dateFrom} — ${dateTo}: показы ${fmtInt(t.shows)}, клики ${fmtInt(t.clicks)}, CTR ${Number(t.ctr ?? 0).toFixed(2)}%, расход ${fmtMoney(t.spent)} ₽${
      t.goals ? `, цели ${fmtInt(t.goals)}` : ''
    }`);
  }
}

/** Базовые метрики из элемента статистики VK (day → rows[], summary → total). */
function vkStatBase(item) {
  const r = item?.total ?? item?.rows?.[0] ?? {};
  const b = r.base ?? {};
  return { spent: Number(b.spent ?? 0), shows: Number(b.shows ?? 0), clicks: Number(b.clicks ?? 0) };
}

function vkDerive(m) {
  return {
    ...m,
    ctr: m.shows ? (m.clicks / m.shows) * 100 : 0,
    cpc: m.clicks ? m.spent / m.clicks : 0,
    ecpm: m.shows ? (m.spent / m.shows) * 1000 : 0,
  };
}

/**
 * Ежедневная сводка в формате, который присылал Perplexity: по каждой группе вчера и накопленно,
 * % выбранного дневного лимита, статусы модерации, вердикт по CPC/CTR (поле goals не учитывается).
 */
async function vkDaily(flags) {
  const date = flags.date ?? daysAgo(1);
  const planQuery = { fields: 'id,name,status,date_start,date_end,budget_limit_day' };
  if (flags.campaign) planQuery._id__in = parseIds(flags.campaign).join(',');
  else planQuery._status = 'active';
  const plans = await vkGetAll('/api/v2/ad_plans.json', planQuery);
  if (!plans.length) return console.log('Активных кампаний нет.');

  const groups = await vkGetAll('/api/v2/ad_groups.json', {
    fields: 'id,name,status,ad_plan_id,budget_limit_day,date_start',
    _ad_plan_id__in: plans.map((p) => p.id).join(','),
    _status__ne: 'deleted',
  });
  if (!groups.length) return console.log('В выбранных кампаниях нет групп.');
  const groupIds = groups.map((g) => g.id);

  let banners = [];
  try {
    banners = await vkGetAll('/api/v2/banners.json', { fields: 'id,ad_group_id,status,moderation_status,moderation_reasons', _ad_group_id__in: groupIds.join(','), _status__ne: 'deleted' });
  } catch {
    banners = [];
  }

  const earliest = [...plans, ...groups].map((x) => x.date_start).filter(Boolean).sort()[0] ?? daysAgo(90);
  const [day, total] = await Promise.all([
    vkRequest('GET', '/api/v2/statistics/ad_groups/day.json', { query: { id: groupIds.join(','), date_from: date, date_to: date, metrics: 'base' } }),
    vkRequest('GET', '/api/v2/statistics/ad_groups/summary.json', { query: { id: groupIds.join(','), date_from: earliest.slice(0, 10), date_to: date, metrics: 'base' } }),
  ]);
  const dayBy = new Map((day?.items ?? []).map((i) => [i.id, vkDerive(vkStatBase(i))]));
  const totBy = new Map((total?.items ?? []).map((i) => [i.id, vkDerive(vkStatBase(i))]));

  const rows = groups.map((g) => {
    const d = dayBy.get(g.id) ?? vkDerive({ spent: 0, shows: 0, clicks: 0 });
    const t = totBy.get(g.id) ?? vkDerive({ spent: 0, shows: 0, clicks: 0 });
    const limit = Number(g.budget_limit_day ?? 0);
    const bn = banners.filter((b) => b.ad_group_id === g.id);
    return { g, d, t, limit, used: limit ? (d.spent / limit) * 100 : null, banners: bn };
  });

  // Вердикт: по CPC и CTR, goals не смотрим (для клипов оно техническое).
  const activeCpcs = rows.filter((r) => r.d.clicks >= 5).map((r) => r.d.cpc).sort((a, b) => a - b);
  const medianCpc = activeCpcs.length ? activeCpcs[Math.floor(activeCpcs.length / 2)] : 0;
  for (const r of rows) {
    if (r.g.status !== 'active') r.verdict = r.g.status === 'blocked' ? 'остановлена' : r.g.status;
    else if (r.d.spent < 1) r.verdict = 'не крутится';
    else if (r.d.clicks < 5) r.verdict = 'мало данных';
    else if (r.d.ctr < 0.4 || (medianCpc && r.d.cpc > medianCpc * 1.8)) r.verdict = 'снизить / остановить на проверку';
    else if (r.t.cpc && r.d.cpc > r.t.cpc * 1.3) r.verdict = 'под наблюдением (CPC растёт)';
    else r.verdict = 'продолжать';
  }

  if (flags.json) return console.log(JSON.stringify(rows.map(({ g, d, t, limit, used, verdict, banners: bn }) => ({ group: g, yesterday: d, total: t, limit, usedPct: used, verdict, banners: bn })), null, 2));

  const planName = new Map(plans.map((p) => [p.id, p.name]));
  console.log(`Сводка VK Рекламы за ${date}. Кампании: ${plans.map((p) => `«${p.name}» (${p.id})`).join(', ')}\n`);
  const pct = (v) => (v === null ? '—' : `${v.toFixed(0)}%`);
  printTable(rows, [
    { title: 'Группа', get: (r) => `${r.g.name} [${r.g.id}]` },
    { title: 'Кампания', get: (r) => planName.get(r.g.ad_plan_id) ?? r.g.ad_plan_id },
    { title: 'Лимит/д', align: 'right', get: (r) => (r.limit ? fmtMoney(r.limit) : '—') },
    { title: 'Вчера ₽', align: 'right', get: (r) => fmtMoney(r.d.spent) },
    { title: '% лим.', align: 'right', get: (r) => pct(r.used) },
    { title: 'Показы', align: 'right', get: (r) => fmtInt(r.d.shows) },
    { title: 'Клики', align: 'right', get: (r) => fmtInt(r.d.clicks) },
    { title: 'CTR', align: 'right', get: (r) => `${r.d.ctr.toFixed(2)}%` },
    { title: 'CPC', align: 'right', get: (r) => fmtMoney(r.d.cpc) },
    { title: 'eCPM', align: 'right', get: (r) => fmtMoney(r.d.ecpm) },
    { title: 'Накопл. ₽', align: 'right', get: (r) => fmtMoney(r.t.spent) },
    { title: 'Накопл. клики', align: 'right', get: (r) => fmtInt(r.t.clicks) },
    { title: 'Накопл. CTR', align: 'right', get: (r) => `${r.t.ctr.toFixed(2)}%` },
    { title: 'Накопл. CPC', align: 'right', get: (r) => fmtMoney(r.t.cpc) },
    { title: 'Вердикт', get: (r) => r.verdict },
  ]);

  const sum = (key, src) => rows.reduce((a, r) => a + r[src][key], 0);
  const dTot = vkDerive({ spent: sum('spent', 'd'), shows: sum('shows', 'd'), clicks: sum('clicks', 'd') });
  const tTot = vkDerive({ spent: sum('spent', 't'), shows: sum('shows', 't'), clicks: sum('clicks', 't') });
  console.log(`\nИтого за ${date}: ${fmtMoney(dTot.spent)} ₽, ${fmtInt(dTot.shows)} показов, ${fmtInt(dTot.clicks)} кликов, CTR ${dTot.ctr.toFixed(2)}%, CPC ${fmtMoney(dTot.cpc)} ₽, eCPM ${fmtMoney(dTot.ecpm)} ₽`);
  console.log(`Накопленно с ${earliest.slice(0, 10)}: ${fmtMoney(tTot.spent)} ₽, ${fmtInt(tTot.shows)} показов, ${fmtInt(tTot.clicks)} кликов, CTR ${tTot.ctr.toFixed(2)}%, CPC ${fmtMoney(tTot.cpc)} ₽`);

  const active = rows.filter((r) => r.g.status === 'active').length;
  if (banners.length) {
    const byStatus = {};
    for (const b of banners) {
      const k = `${b.status ?? '?'}/${b.moderation_status ?? '?'}`;
      byStatus[k] = (byStatus[k] ?? 0) + 1;
    }
    const rejected = banners.filter((b) => /reject|banned|not_allowed/i.test(String(b.moderation_status ?? b.status ?? '')));
    console.log(`Группы: активных ${active} из ${rows.length}. Объявления: ${banners.length} (${Object.entries(byStatus).map(([k, v]) => `${k}: ${v}`).join(', ')})${rejected.length ? `; ОТКЛОНЕНО: ${rejected.map((b) => b.id).join(', ')}` : '; отклонённых нет'}.`);
  } else {
    console.log(`Группы: активных ${active} из ${rows.length}. Статусы объявлений недоступны.`);
  }
  const attention = rows.filter((r) => /снизить|наблюдением/.test(r.verdict));
  console.log(attention.length ? `Требуют внимания: ${attention.map((r) => `«${r.g.name}» — ${r.verdict}`).join('; ')}.` : 'Все группы в норме.');
  console.log('Бюджеты не менялись. Поле goals не учитывалось (для клипов оно техническое).');
}

async function vkRaw(positional) {
  const [method, endpoint, json] = positional;
  if (!method || !endpoint) fail("использование: vk raw <GET|POST|DELETE> </api/v2/...> ['<JSON body>']");
  const res = await vkRequest(method.toUpperCase(), endpoint, { body: json ? JSON.parse(json) : undefined });
  console.log(JSON.stringify(res, null, 2));
}

async function vkCheck() {
  let user;
  try {
    user = await vkRequest('GET', '/api/v3/user.json');
  } catch {
    user = await vkRequest('GET', '/api/v2/user.json');
  }
  const plans = await vkRequest('GET', '/api/v2/ad_plans.json', { query: { limit: 1, fields: 'id' } });
  console.log(`VK Реклама: OK — пользователь ${user?.username ?? user?.id ?? '?'}, валюта ${user?.currency ?? '?'}, кампаний в кабинете: ${plans?.count ?? '?'}`);
}

async function runVk(cmd, flags, positional) {
  switch (cmd) {
    case 'campaigns':
    case 'list':
      return vkCampaigns(flags);
    case 'groups':
      return vkGroups(flags, positional);
    case 'stats':
    case 'report':
      return vkStats(flags);
    case 'stop':
    case 'pause':
    case 'suspend':
      return vkMassStatus(flags.groups ? 'groups' : 'plans', 'blocked', flags, positional);
    case 'start':
    case 'resume':
      return vkMassStatus(flags.groups ? 'groups' : 'plans', 'active', flags, positional);
    case 'budget':
      return vkBudget(flags, positional);
    case 'daily':
    case 'summary':
      return vkDaily(flags);
    case 'raw':
      return vkRaw(positional);
    case 'check':
      return vkCheck();
    default:
      fail(`неизвестная команда vk ${cmd}. См. --help`);
  }
}

// ---------------------------------------------------------------------------
// Точка входа
// ---------------------------------------------------------------------------

const HELP = `
ads.mjs — Яндекс Директ и VK Реклама из терминала

  npm run ads -- check                    проверить токены и доступ к обоим кабинетам
  npm run ads -- direct <команда>         Яндекс Директ
  npm run ads -- vk <команда>             VK Реклама

Яндекс Директ:
  campaigns [--all] [--ids 1,2] [--json]        список кампаний (по умолчанию без архивных)
  stats [--from Д --to Д | --period LAST_7_DAYS] [--by-day] [--ids 1,2] [--goals 1,2] [--fields ...] [--json|--raw]
                                                статистика по кампаниям (по умолчанию 7 дней до вчера)
  suspend <ids>                                 остановить кампании
  resume <ids>                                  запустить кампании
  budget <id> <руб/день> [--mode STANDARD|DISTRIBUTED]   дневной бюджет (только ручные стратегии)
  keywords <id кампании> [--json]               фразы кампании со ставками
  raw <service> <method> '<params JSON>'        любой метод API v5/v501
  check                                         проверка доступа

VK Реклама:
  campaigns [--all | --status active|blocked] [--ids 1,2] [--json]   список кампаний
  groups [id кампании] [--all] [--json]         группы объявлений
  stats [--from Д --to Д] [--by-day] [--type ad_plans|ad_groups|banners] [--ids 1,2] [--metrics base,events] [--json]
                                                статистика (по умолчанию 7 дней по сегодня)
  daily [--campaign 28397756] [--date Д] [--json]   ежедневная сводка: вчера и накопленно по группам, % лимита, модерация, вердикт
  stop <ids> [--groups]                         остановить кампании (или группы)
  start <ids> [--groups]                        запустить кампании (или группы)
  budget <id> --day <руб> [--total <руб>] [--groups]   бюджет
  raw <GET|POST|DELETE> </api/v2/...> ['<JSON>']  любой запрос к API
  check                                         проверка доступа

Переменные окружения (можно в .env в корне репозитория):
  YANDEX_DIRECT_TOKEN           OAuth-токен Директа (обязательно)
  YANDEX_DIRECT_CLIENT_LOGIN    логин клиента, если токен агентский (необязательно)
  YANDEX_DIRECT_SANDBOX=1       работать с песочницей Директа
  VK_ADS_CLIENT_ID + VK_ADS_CLIENT_SECRET   доступ по API из кабинета VK Рекламы (токен берётся автоматически)
  VK_ADS_TOKEN                  либо готовый токен VK (приоритетнее client_id/secret)
  VK_ADS_AGENCY_CLIENT_ID       id клиента, если доступ агентский (необязательно)
  ADS_VERBOSE=1                 печатать остаток лимитов/баллов

Подробная инструкция по получению доступов: scripts/ads/README.md
`;

async function main() {
  loadDotEnv();
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [platform, cmd, ...rest] = positional;

  if (!platform || flags.help || platform === '--help' || platform === 'help') {
    console.log(HELP.trim());
    return;
  }

  if (platform === 'check') {
    const results = [];
    for (const [name, fn] of [['Яндекс Директ', directCheck], ['VK Реклама', vkCheck]]) {
      const child = await runIsolated(fn);
      results.push(`${child.ok ? '✓' : '✗'} ${name}: ${child.message}`);
    }
    console.log(results.join('\n'));
    return;
  }

  if (platform === 'direct' || platform === 'yandex') return runDirect(cmd ?? 'campaigns', flags, rest);
  if (platform === 'vk') return runVk(cmd ?? 'campaigns', flags, rest);
  fail(`неизвестная платформа "${platform}". Используйте direct, vk или check. См. --help`);
}

/** Запускает проверку так, чтобы fail() одного кабинета не ронял весь check. */
async function runIsolated(fn) {
  const origExit = process.exit;
  const origError = console.error;
  const origLog = console.log;
  let captured = '';
  process.exit = (code) => {
    throw Object.assign(new Error(captured.trim() || `exit ${code}`), { isExit: true });
  };
  console.error = (m) => { captured += `${m}\n`; };
  console.log = (m) => { captured += `${m}\n`; };
  try {
    await fn();
    return { ok: true, message: captured.trim() };
  } catch (e) {
    return { ok: false, message: (e.isExit ? e.message : `${captured.trim()} ${e.message}`).replace(/^Ошибка: /, '').trim() };
  } finally {
    process.exit = origExit;
    console.error = origError;
    console.log = origLog;
  }
}

main().catch((e) => {
  console.error(`Ошибка: ${e.message}`);
  process.exit(1);
});
