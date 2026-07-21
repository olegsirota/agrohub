# АгроХаб — лендинг агроинженерного лагеря и хакатона

Одностраничный сайт летнего лагеря **АгроХаб** на Истринской сыроварне Олега и Татьяны Сироты (Истра, лето 2026): робототехника, робособаки Unitree, нейросети и компьютерное зрение.

Живая версия: **https://dorab1.github.io/agrohub/**

## Стек

- **React 19** + **TypeScript**
- **Vite 6** — сборка и dev-сервер
- **Tailwind CSS 4** (через `@tailwindcss/vite`)
- **Motion** (framer-motion) — анимации
- **lucide-react** — иконки
- Хостинг: **GitHub Pages** (статика)

## Структура

```
agrohub/
├─ index.html                  # входная точка
├─ vite.config.ts              # base: './'  — работает и на github.io, и на своём домене
├─ public/
│  ├─ assets/                  # медиа (фон, логотипы, фото) → доступны по пути assets/…
│  └─ .nojekyll                # чтобы GitHub Pages не трогал сборку
├─ scripts/
│  └─ process-logos.mjs        # обработка логотипов: белый фон → прозрачный (jimp)
└─ src/
   ├─ main.tsx                 # монтирование React
   ├─ App.tsx                  # вся страница + данные треков (TRACK_GALLERIES, TRACK_COVERS)
   ├─ data.ts                  # FAQ_DATA (вопросы-ответы)
   ├─ types.ts                 # типы
   ├─ index.css                # шрифты, tailwind, анимация ленты
   └─ components/
      ├─ Header.tsx            # шапка с навигацией
      ├─ PartnersCarousel.tsx  # бегущая лента партнёров поверх hero
      └─ ReelModal.tsx         # лента «тиктоков» (открывается по «Подробнее»)
```

## Запуск локально

Нужен **Node.js 18+**.

```bash
npm install       # установка зависимостей
npm run dev       # dev-сервер (обычно http://localhost:5173)
npm run build     # прод-сборка в dist/
npm run preview   # локальный просмотр собранного сайта
npm run lint      # проверка типов (tsc)
```

## Как менять контент

| Что | Где |
|-----|-----|
| Тексты, заголовки, слайды | `src/App.tsx` |
| Обложки карточек направлений | массив `TRACK_COVERS` в `src/App.tsx` |
| Ленты «тиктоков» (ролики, подписи) | массив `TRACK_GALLERIES` в `src/App.tsx` |
| Вопросы FAQ | `src/data.ts` (`FAQ_DATA`) |
| Даты смен, расписание дня, лекции | секция «Польза от участия» в `src/App.tsx` |
| Логотипы партнёров, фон, фото | файлы в `public/assets/` |

**Медиа.** Любой файл в `public/assets/` доступен на сайте по пути `assets/имя-файла`.
В коде путь строится как `` `${import.meta.env.BASE_URL}assets/имя` `` — так он работает при любом base.

**Логотипы (белый фон → прозрачный).** Положить исходники и запустить:

```bash
npm run process-logos
```

Скрипт `scripts/process-logos.mjs` убирает белый фон, ужимает и кладёт результат в `public/assets/`.

## Деплой на GitHub Pages

Собранная статика (`dist/`) публикуется в ветку **`gh-pages`**:

```bash
npm run build
cd dist
git init -b gh-pages
git add -A && git commit -m "deploy"
git remote add origin https://github.com/dorab1/agrohub.git
git push -f origin gh-pages
```

В настройках репозитория **Settings → Pages** источник — ветка `gh-pages`, папка `/`.

## Свой домен (reg.ru)

`base: './'` в `vite.config.ts` уже позволяет сайту работать в корне домена — пересобирать под домен не нужно.

**Шаги:**

1. Добавить файл `public/CNAME` с доменом (одна строка, например `agrohab.ru`) — он попадёт в сборку.
2. В **reg.ru → DNS** прописать записи (значения ниже — официальные IP GitHub Pages):

   **Для домена без www (apex, `agrohab.ru`):**
   ```
   A   @   185.199.108.153
   A   @   185.199.109.153
   A   @   185.199.110.153
   A   @   185.199.111.153
   ```
   **Для www (`www.agrohab.ru`):**
   ```
   CNAME   www   dorab1.github.io.
   ```
3. В **Settings → Pages → Custom domain** ввести домен и включить **Enforce HTTPS** (после проверки DNS, обычно 15 мин – 24 ч).

После этого сайт открывается на своём домене, а `dorab1.github.io/agrohub` редиректит на него.
