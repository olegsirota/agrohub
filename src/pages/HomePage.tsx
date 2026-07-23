import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import PartnersCarousel from "../components/PartnersCarousel";
import { BENEFITS, SHIFTS, CONDITIONS, MISSION_TEXT, MISSION_TECH, FUTURE, WHO_WE_NEED } from "../data";
import type { ShiftMedia } from "../data";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const primaryBtn =
  "py-4 px-8 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white hover:scale-[1.02] transition-all text-center inline-block";
const ghostBtn =
  "py-4 px-8 bg-transparent border border-[#E8E6D9]/30 hover:border-[#E8E6D9]/60 hover:bg-[#E8E6D9]/5 text-[#E8E6D9] font-semibold uppercase text-xs tracking-widest rounded-full transition-all text-center inline-block";
const sectionH2 =
  "font-sans font-black uppercase text-3xl sm:text-5xl md:text-[60px] tracking-tighter leading-[0.85] text-[#E8E6D9]";

const STATUS_LABEL: Record<string, string> = {
  done: "Проведена",
  now: "Идёт сейчас",
  open: "Набор открыт",
};

/** Атмосферное видео: играет без звука, когда карточка в зоне видимости */
function AmbientVideo({ src }: { src: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className="w-full h-full object-cover"
    />
  );
}

function ShiftMediaStrip({ media, base }: { media: ShiftMedia[]; base: string }) {
  return (
    <div className={`mt-5 grid gap-3 grid-cols-1 ${media.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {media.map((m) => (
        <div
          key={m.src}
          className="relative aspect-video overflow-hidden rounded-xl border border-[#E8E6D9]/12 bg-[#0F1108]/40"
        >
          {m.type === "video" ? (
            <AmbientVideo src={`${base}${m.src}`} />
          ) : (
            <img
              src={`${base}${m.src}`}
              alt={m.label ?? ""}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
          {m.label && (
            <span className="absolute bottom-2 left-2 py-1 px-2.5 rounded-full bg-[#0F1108]/70 backdrop-blur-sm text-[10px] uppercase tracking-widest font-bold text-[#E8E6D9]/90">
              {m.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const base = import.meta.env.BASE_URL;
  const scrollToSchedule = () =>
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-center pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15,17,8,0) 0%, rgba(15,17,8,0.1) 40%, rgba(27,48,34,0.6) 80%, #1B3022 100%), url('${base}assets/hero_android.jpg')`,
        }}
      >
        <div className="relative z-20 max-w-5xl">
          <p className="font-sans font-bold uppercase text-xs sm:text-sm tracking-[0.25em] text-[#D4DE72] mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            АгроХаб 2026 · Истринская сыроварня
          </p>
          <h1 className="font-sans font-black uppercase text-4xl sm:text-6xl md:text-[72px] tracking-tighter leading-[0.9] mb-8 text-[#E8E6D9] drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
            Строим сельское хозяйство будущего
          </h1>

          <div className="max-w-2xl mb-8">
            <p className="text-sm sm:text-base text-[#E8E6D9] leading-relaxed font-sans font-medium drop-shadow-sm">
              Программируй роботов-андроидов, дрессируй робособак, собирай автономные тележки и
              обучай нейросети на действующей ферме в Истре. От идеи до рабочего прототипа — за
              одну смену.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            <Link to="/apply" className={primaryBtn}>Подать заявку</Link>
            <button type="button" onClick={scrollToSchedule} className={`${ghostBtn} cursor-pointer`}>График смен</button>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full bg-[#0F1108]/55 backdrop-blur-sm border border-[#D4DE72]/40 py-2.5 px-5">
            <span className="w-2 h-2 rounded-full bg-[#D4DE72] animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#E8E6D9]">
              Ближайшие смены: 9–19 и 19–29 августа · набор открыт
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20">
          <PartnersCarousel />
        </div>
      </section>

      {/* ── Миссия ── */}
      <section className="relative pt-24 md:pt-32 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#1B3022]/58 to-[#0F1108]/58">
        <div className="max-w-7xl mx-auto">
          <motion.p {...reveal} transition={{ duration: 0.6 }} className="font-sans font-bold text-[11px] uppercase tracking-[0.25em] text-[#A3B18A] mb-6">
            Зачем мы это делаем
          </motion.p>
          <motion.h2 {...reveal} transition={{ duration: 0.6, delay: 0.05 }} className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#E8E6D9] leading-snug max-w-4xl mb-6">
            {MISSION_TEXT.lead}
          </motion.h2>
          <motion.p {...reveal} transition={{ duration: 0.6, delay: 0.1 }} className="text-sm md:text-base text-[#E8E6D9]/80 leading-relaxed max-w-3xl mb-10">
            {MISSION_TEXT.body}
          </motion.p>
          <motion.div {...reveal} transition={{ duration: 0.6, delay: 0.15 }} className="flex flex-wrap gap-2.5">
            {MISSION_TECH.map((t) => (
              <span
                key={t}
                className="py-2 px-4 rounded-full border border-[#A3B18A]/35 bg-[#344E41]/20 text-xs sm:text-sm font-semibold text-[#E8E6D9]/90"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── График смен ── */}
      <section id="schedule" className="relative pt-4 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-[#0F1108]/45 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10 md:mb-14">
            <motion.h2 {...reveal} transition={{ duration: 0.6 }} className={sectionH2}>
              График смен
            </motion.h2>
            <p className="mt-4 text-xs md:text-sm text-[#E8E6D9]/80 leading-relaxed font-medium">
              Лето 2026: пять смен, каждая со своей миссией — от первых шагов андроида до полного
              автономного цикла «теплица → магазин» без участия человека.
            </p>
          </div>

          <div className="relative border-l border-[#E8E6D9]/15 ml-2 md:ml-3 space-y-4">
            {SHIFTS.map((s, i) => {
              const isOpen = s.status === "open";
              const isNow = s.status === "now";
              return (
                <motion.div
                  key={s.n}
                  {...reveal}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative pl-6 md:pl-8"
                >
                  <span
                    className={`absolute -left-[6px] top-7 w-3 h-3 rounded-full border-2 ${
                      isOpen
                        ? "bg-[#D4DE72] border-[#D4DE72]"
                        : isNow
                        ? "bg-[#A3B18A] border-[#A3B18A] animate-pulse"
                        : "bg-[#0F1108] border-[#E8E6D9]/40"
                    }`}
                  />
                  <div
                    className={`rounded-2xl p-6 md:p-7 border ${
                      isOpen
                        ? "bg-[#344E41]/30 border-[#D4DE72]/50"
                        : isNow
                        ? "bg-[#344E41]/20 border-[#A3B18A]/45"
                        : "bg-[#E8E6D9]/[0.04] border-[#E8E6D9]/10"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                      <span className={`font-sans font-black uppercase text-lg md:text-xl leading-none ${isOpen ? "text-[#D4DE72]" : "text-[#E8E6D9]"}`}>
                        {s.n}
                      </span>
                      <span className="text-sm font-semibold text-[#E8E6D9]/70">{s.dates}</span>
                      <span
                        className={`py-1 px-3 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                          isOpen
                            ? "bg-[#D4DE72] text-[#0F1108]"
                            : isNow
                            ? "bg-[#A3B18A]/25 text-[#A3B18A] border border-[#A3B18A]/40"
                            : "bg-[#E8E6D9]/10 text-[#E8E6D9]/55"
                        }`}
                      >
                        {STATUS_LABEL[s.status]}
                      </span>
                    </div>
                    <h3 className="font-sans font-bold uppercase text-base md:text-lg text-[#E8E6D9] mb-2 leading-tight">
                      {s.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isOpen || isNow ? "text-[#E8E6D9]/85" : "text-[#E8E6D9]/60"}`}>
                      {s.story}
                    </p>
                    {s.media && <ShiftMediaStrip media={s.media} base={base} />}
                    {isOpen && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link to="/apply" className="py-3 px-6 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-[11px] tracking-widest rounded-full hover:bg-white transition-all">
                          Подать заявку на смену
                        </Link>
                        <Link to="/program" className="py-3 px-6 border border-[#E8E6D9]/30 hover:border-[#E8E6D9]/60 text-[#E8E6D9] font-semibold uppercase text-[11px] tracking-widest rounded-full transition-all">
                          Программа
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Польза участия ── */}
      <section className="relative pt-4 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0F1108]/58 to-[#0a0b05]/58">
        <div className="max-w-7xl mx-auto">
          <motion.h2 {...reveal} transition={{ duration: 0.6 }} className="font-sans font-bold uppercase text-3xl md:text-5xl text-[#DAD7CD] mb-10 md:mb-12">
            Польза участия
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl p-6 hover:border-[#A3B18A]/35 transition-colors"
              >
                <div className="font-sans font-black text-[#D4DE72] text-lg mb-3">0{i + 1}</div>
                <h3 className="font-sans font-bold uppercase text-base md:text-lg text-[#E8E6D9] mb-2 leading-tight">{b.title}</h3>
                <p className="text-xs sm:text-sm text-[#E8E6D9]/70 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Кто нам нужен ── */}
      <section className="relative pt-4 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-[#0a0b05]/45">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8 md:mb-10">
            <motion.h2 {...reveal} transition={{ duration: 0.6 }} className={sectionH2}>
              Кто нам нужен
            </motion.h2>
            <p className="mt-4 text-xs md:text-sm text-[#E8E6D9]/80 leading-relaxed font-medium">
              Ждём студентов, аспирантов и готовые команды со всей страны — не только из аграрных
              вузов.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="py-2 px-4 rounded-full bg-[#D4DE72] text-[#0F1108] text-xs sm:text-sm font-bold uppercase tracking-wide">
                Участие бесплатное
              </span>
              <span className="py-2 px-4 rounded-full border border-[#A3B18A]/45 bg-[#344E41]/25 text-xs sm:text-sm font-semibold text-[#E8E6D9]/90">
                Проживание в палаточном лагере на ферме
              </span>
              <span className="py-2 px-4 rounded-full border border-[#A3B18A]/45 bg-[#344E41]/25 text-xs sm:text-sm font-semibold text-[#E8E6D9]/90">
                Питание и снаряжение — от организатора
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHO_WE_NEED.map((w, i) => (
              <motion.div
                key={w.title}
                {...reveal}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl p-6 hover:border-[#A3B18A]/35 transition-colors"
              >
                <h3 className="font-sans font-bold uppercase text-base md:text-lg text-[#E8E6D9] mb-2 leading-tight">{w.title}</h3>
                <p className="text-xs sm:text-sm text-[#E8E6D9]/70 leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link to="/results" className={ghostBtn}>Результаты смен</Link>
            <Link to="/apply" className={primaryBtn}>Подать заявку</Link>
            <Link to="/program" className={ghostBtn}>Программа смены</Link>
          </div>
        </div>
      </section>

      {/* ── Условия участия ── */}
      <section className="relative pt-4 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0b05]/58 to-[#0F1108]/58">
        <div className="max-w-7xl mx-auto">
          <motion.h2 {...reveal} transition={{ duration: 0.6 }} className="font-sans font-bold uppercase text-3xl md:text-5xl text-[#DAD7CD] mb-10 md:mb-12">
            Условия участия
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CONDITIONS.map((c, i) => (
              <motion.div
                key={c.title}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl h-[420px] border border-[#E8E6D9]/10"
              >
                <img
                  src={`${base}${c.img}`}
                  alt={c.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                  <h3 className="font-sans font-bold uppercase text-xl md:text-2xl text-[#E8E6D9] mb-2">{c.title}</h3>
                  <p className="text-sm text-[#E8E6D9]/85 leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── АгроХаб — это надолго ── */}
      <section className="relative pt-4 pb-24 md:pb-32 px-6 md:px-12 lg:px-24 bg-[#0F1108]/45">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10 md:mb-14">
            <motion.h2 {...reveal} transition={{ duration: 0.6 }} className="font-sans font-bold uppercase text-3xl md:text-5xl text-[#DAD7CD]">
              АгроХаб — это надолго
            </motion.h2>
            <p className="mt-4 text-xs md:text-sm text-[#E8E6D9]/80 leading-relaxed font-medium">
              Летние смены — только начало. Мы делаем постоянную площадку, где технологии
              приземляются в реальное сельское хозяйство.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {FUTURE.map((f, i) => (
              <motion.div
                key={f.title}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl p-6 md:p-7 hover:border-[#A3B18A]/35 transition-colors"
              >
                <div className="font-sans font-black text-[#D4DE72] text-lg mb-3">0{i + 1}</div>
                <h3 className="font-sans font-bold uppercase text-base md:text-lg text-[#E8E6D9] mb-2 leading-tight">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[#E8E6D9]/70 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/apply" className={primaryBtn}>Подать заявку</Link>
            <button type="button" onClick={scrollToSchedule} className={`${ghostBtn} cursor-pointer`}>График смен</button>
          </div>
        </div>
      </section>
    </>
  );
}
