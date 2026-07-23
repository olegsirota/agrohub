import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import PartnersCarousel from "../components/PartnersCarousel";
import { BENEFITS, PRINCIPLES, TASKS, SHIFTS, CONDITIONS } from "../data";

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

export default function HomePage() {
  const base = import.meta.env.BASE_URL;

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-center pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15,17,8,0) 0%, rgba(15,17,8,0.1) 40%, rgba(27,48,34,0.6) 80%, #1B3022 100%), url('${base}assets/farm_bg.jpeg')`,
        }}
      >
        <div className="relative z-20 max-w-5xl">
          <h1 className="font-sans font-black uppercase text-5xl sm:text-7xl md:text-[80px] tracking-tighter leading-[0.85] mb-8 text-[#E8E6D9]">
            АГРОХАБ 2026 <br />
            <span className="text-4xl sm:text-6xl md:text-[72px] block mt-4 tracking-tighter leading-[0.85]">
              на сыроварне Олега Сироты
            </span>
          </h1>

          <div className="max-w-2xl mb-8">
            <p className="font-serif italic text-xl sm:text-2xl text-[#D4DE72] mb-3 leading-relaxed">
              Отдохни за делом.
            </p>
            <p className="text-sm sm:text-base text-[#E8E6D9] leading-relaxed font-sans font-medium drop-shadow-sm">
              Программируй роботов, дрессируй робособак, обучай нейросети прямо на действующей сыроварне
              в Истре. В Агрохабе ты сделаешь проект с нуля до MVP под руководством заинтересованных
              наставников.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link to="/apply" className={primaryBtn}>Подать заявку</Link>
            <Link to="/program" className={ghostBtn}>Программа смены</Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20">
          <PartnersCarousel />
        </div>
      </section>

      {/* ── Польза участия ── */}
      <section className="relative pt-24 md:pt-32 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#1B3022] to-[#0F1108]">
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

      {/* ── Принципы смены ── */}
      <section className="relative pt-4 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-[#0F1108]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 {...reveal} transition={{ duration: 0.6 }} className="font-sans font-bold uppercase text-3xl md:text-5xl text-[#DAD7CD] mb-10 md:mb-12">
            Принципы смены
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl p-6 hover:border-[#A3B18A]/35 transition-colors"
              >
                <h3 className="font-sans font-bold uppercase text-base md:text-lg text-[#E8E6D9] mb-2 leading-tight">{p.title}</h3>
                <p className="text-xs sm:text-sm text-[#E8E6D9]/70 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Задачи лагеря ── */}
      <section className="relative pt-4 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0F1108] to-[#0a0b05]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10 md:mb-14">
            <motion.h2 {...reveal} transition={{ duration: 0.6 }} className={sectionH2}>
              Задачи лагеря
            </motion.h2>
            <p className="mt-4 text-xs md:text-sm text-[#E8E6D9]/80 leading-relaxed font-medium">
              Реальные проекты от предприятий — команды доводят их от идеи до рабочего прототипа.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TASKS.map((t, i) => (
              <motion.div
                key={t.title}
                {...reveal}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                className="bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl p-6 md:p-7 flex flex-col hover:border-[#A3B18A]/35 transition-colors"
              >
                <span className="font-sans font-bold text-[11px] uppercase tracking-widest text-[#A3B18A] mb-3">
                  Проект {i + 1}
                </span>
                <h3 className="font-sans font-bold uppercase text-lg md:text-xl text-[#E8E6D9] mb-3 leading-tight">{t.title}</h3>
                <p className="text-sm text-[#E8E6D9]/70 leading-relaxed mb-6 grow">{t.desc}</p>
                <div className="flex flex-wrap gap-2.5">
                  <Link to="/results" className="py-2 px-4 border border-[#E8E6D9]/25 hover:border-[#E8E6D9]/60 text-[#E8E6D9] font-semibold uppercase text-[10px] tracking-widest rounded-full transition-colors">
                    Результаты смен
                  </Link>
                  <Link to="/apply" className="py-2 px-4 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-white transition-colors">
                    Подать заявку
                  </Link>
                  <Link to="/program" className="py-2 px-4 border border-[#E8E6D9]/25 hover:border-[#E8E6D9]/60 text-[#E8E6D9] font-semibold uppercase text-[10px] tracking-widest rounded-full transition-colors">
                    Программа смены
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Проведённые смены ── */}
      <section className="relative pt-4 pb-20 md:pb-28 px-6 md:px-12 lg:px-24 bg-[#0a0b05]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 {...reveal} transition={{ duration: 0.6 }} className="font-sans font-bold uppercase text-3xl md:text-5xl text-[#DAD7CD] mb-10 md:mb-12">
            Проведённые смены
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SHIFTS.map((s, i) => (
              <motion.div
                key={s.n}
                {...reveal}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`rounded-2xl p-6 border ${
                  s.highlight
                    ? "bg-[#344E41]/30 border-[#D4DE72]/50"
                    : "bg-[#E8E6D9]/[0.04] border-[#E8E6D9]/10"
                }`}
              >
                <div className={`font-sans font-black uppercase text-xl md:text-2xl leading-none mb-2 ${s.highlight ? "text-[#D4DE72]" : "text-[#E8E6D9]/60"}`}>
                  {s.n}
                </div>
                <div className={`text-sm font-semibold ${s.highlight ? "text-[#E8E6D9]" : "text-[#E8E6D9]/50"}`}>{s.dates}</div>
                {s.highlight && (
                  <div className="mt-3 text-[10px] uppercase tracking-widest font-bold text-[#A3B18A]">Набор открыт</div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link to="/apply" className={primaryBtn}>Подать заявку</Link>
          </div>
        </div>
      </section>

      {/* ── Условия участия ── */}
      <section className="relative pt-4 pb-24 md:pb-32 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0b05] to-[#0F1108]">
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
    </>
  );
}
