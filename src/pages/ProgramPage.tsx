import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Download } from "lucide-react";
import PageHero from "../components/PageHero";
import {
  EDUCATION_BLOCKS,
  ROBOTS,
  PROGRAM_DAYS,
  DAY_SCHEDULE,
  HACKATHON_CRITERIA,
  PROGRAM_DOCX,
} from "../data";

const h2 = "font-sans font-bold uppercase text-2xl md:text-4xl text-[#DAD7CD] mb-8";
const card = "bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl";

export default function ProgramPage() {
  const base = import.meta.env.BASE_URL;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        eyebrow="4 смена · 9 по 19 августа 2026"
        title="Программа смены"
        subtitle="9 дней технологий и реальных инженерных вызовов на Истринской сыроварне: за смену команды разрабатывают и защищают прототипы роботизированных решений для теплиц, ферм и полей."
      />

      <div className="px-6 md:px-12 lg:px-24 pb-24 bg-[#0F1108]/60">
        <div className="max-w-5xl mx-auto space-y-20 md:space-y-24">

          {/* Скачать документ */}
          <div className="-mt-4">
            <a
              href={`${base}${PROGRAM_DOCX}`}
              download
              className="inline-flex items-center gap-2 py-3 px-6 border border-[#E8E6D9]/25 hover:border-[#E8E6D9]/60 text-[#E8E6D9] font-semibold uppercase text-[11px] tracking-widest rounded-full transition-colors"
            >
              <Download className="w-4 h-4" /> Скачать программу (.docx)
            </a>
          </div>

          {/* Образовательные направления */}
          <section>
            <h2 className={h2}>Образовательные направления</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {EDUCATION_BLOCKS.map((e, i) => (
                <div key={e} className={`${card} p-5 flex gap-4 items-start`}>
                  <span className="font-sans font-black text-[#D4DE72] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-[#E8E6D9]/85 leading-relaxed">{e}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Роботы */}
          <section>
            <h2 className={h2}>Роботы, с которыми мы работаем</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {ROBOTS.map((r) => (
                <div key={r.name} className={`${card} p-6`}>
                  <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#A3B18A]">{r.tag}</span>
                  <h3 className="font-sans font-bold uppercase text-lg text-[#E8E6D9] mt-1 mb-4">{r.name}</h3>
                  <ul className="space-y-2">
                    {r.points.map((p) => (
                      <li key={p} className="text-sm text-[#E8E6D9]/75 leading-relaxed flex gap-2.5">
                        <span className="text-[#D4DE72]">•</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Программа по дням, timeline с раскрытием */}
          <section>
            <h2 className={h2}>Программа по дням</h2>
            <div className="relative border-l border-[#E8E6D9]/15 ml-2 md:ml-3">
              {PROGRAM_DAYS.map((d, i) => {
                const isOpen = open === i;
                return (
                  <div key={d.day} className="relative pl-6 md:pl-8 pb-3">
                    <span className={`absolute -left-[6px] top-5 w-3 h-3 rounded-full border-2 ${isOpen ? "bg-[#D4DE72] border-[#D4DE72]" : "bg-[#0F1108]/60 border-[#A3B18A]"}`} />
                    <div className={`${card} overflow-hidden`}>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-[#344E41]/20 transition-colors"
                      >
                        <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                          <span className="font-sans font-bold uppercase text-sm text-[#D4DE72] tracking-widest">{d.day} · {d.date}</span>
                          <span className="font-sans font-bold uppercase text-base text-[#E8E6D9]">{d.title}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 shrink-0 text-[#A3B18A] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-[#E8E6D9]/5 space-y-2">
                              {d.schedule.map(([time, act]) => (
                                <div key={time + act} className="flex gap-4 items-baseline">
                                  <span className="font-sans font-bold text-xs text-[#A3B18A] shrink-0 w-24 md:w-28">{time}</span>
                                  <span className="text-sm text-[#E8E6D9]/80 leading-relaxed">{act}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Распорядок дня + хакатон */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-6">
            <section>
              <h2 className={h2}>Базовый распорядок дня</h2>
              <div className={`${card} p-6 space-y-2.5`}>
                {DAY_SCHEDULE.map(([t, a]) => (
                  <div key={t + a} className="flex gap-4 items-baseline">
                    <span className="font-sans font-bold text-xs text-[#D4DE72] shrink-0 w-24">{t}</span>
                    <span className="text-sm text-[#E8E6D9]/80">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={h2}>Хакатон 72 часа</h2>
              <div className={`${card} p-6`}>
                <p className="text-sm text-[#E8E6D9]/80 leading-relaxed mb-5">
                  Марафон разработки: команды создают рабочие прототипы роботизированных решений для АПК.
                  Среди победителей разыгрывается призовой фонд.
                </p>
                <p className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#A3B18A] mb-3">Критерии оценки</p>
                <ul className="space-y-2">
                  {HACKATHON_CRITERIA.map((c) => (
                    <li key={c} className="text-sm text-[#E8E6D9]/75 leading-relaxed flex gap-2.5">
                      <span className="text-[#D4DE72]">•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/apply" className="py-4 px-10 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white transition-all text-center">
              Подать заявку
            </Link>
            <Link to="/results" className="py-4 px-10 border border-[#E8E6D9]/30 hover:border-[#E8E6D9]/60 text-[#E8E6D9] font-semibold uppercase text-xs tracking-widest rounded-full transition-all text-center">
              Результаты смен
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
