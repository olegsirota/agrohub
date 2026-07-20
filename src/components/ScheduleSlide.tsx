import React from "react";
import { motion } from "motion/react";

const STREAMS = [
  { n: "3", dates: "16–25 июля" },
  { n: "4", dates: "9–19 августа" },
  { n: "5", dates: "19–29 августа" },
];

const DAY: [string, string][] = [
  ["08:00", "Подъём"],
  ["11:00", "Лекция"],
  ["12:00–17:00", "Проекты · гемба на ферме"],
  ["18:00", "Съёмка контента"],
  ["21:00", "Рефлексия у костра"],
];

const LEARN = [
  "Робототехника Unitree G1",
  "Робособаки в поле",
  "Нейросети и компьютерное зрение",
  "Лекторий: лекции по продуктам",
  "Работа на ферме и нетворкинг",
];

export default function ScheduleSlide() {
  return (
    <section
      id="schedule-section"
      className="relative bg-[#0a0b05] text-[#E8E6D9] py-24 md:py-36 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="font-sans font-black uppercase text-4xl sm:text-6xl md:text-[80px] tracking-tighter leading-[0.85] mb-16 md:mb-24"
        >
          Смена — <span className="text-[#D4DE72]">8 дней</span>
        </motion.h2>

        {/* Потоки */}
        <div className="mb-20 md:mb-28">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#A3B18A] mb-6">
            Потоки 2026
          </p>
          <div className="border-y border-[#E8E6D9]/12">
            {STREAMS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-baseline justify-between gap-6 py-5 md:py-7 border-b border-[#E8E6D9]/12 last:border-b-0"
              >
                <span className="font-serif italic text-2xl md:text-4xl text-[#DAD7CD] shrink-0">
                  {s.n}-я смена
                </span>
                <span className="font-sans font-black uppercase text-2xl sm:text-4xl md:text-5xl tracking-tight text-right">
                  {s.dates}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* День + чему учим */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#A3B18A] mb-8">
              День в лагере
            </p>
            <div className="space-y-5">
              {DAY.map(([t, l]) => (
                <div key={t} className="flex gap-5 md:gap-8 items-baseline">
                  <span className="font-mono text-sm md:text-lg text-[#D4DE72] shrink-0 w-28 md:w-36">
                    {t}
                  </span>
                  <span className="text-lg md:text-2xl text-[#E8E6D9] leading-snug">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#A3B18A] mb-8">
              Чему учим
            </p>
            <ul className="space-y-5 font-serif italic text-2xl md:text-3xl text-[#DAD7CD] leading-tight">
              {LEARN.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
