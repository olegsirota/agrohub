import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";
import PageHero from "../components/PageHero";
import ReelModal from "../components/ReelModal";
import { TRACK_GALLERIES, TRACK_COVERS } from "../data";

const card = "bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl";

// Краткие выводы и отзывы по проектам предыдущих смен
const PROJECT_RESULTS = [
  {
    project: "Интеллектуальный анализ недостач",
    result: "Собран прототип, который сводит разрозненные журналы в один поток и отсеивает ложные срабатывания, причины потерь стали видны быстрее.",
    review: "«Думал, будет очередной дашборд. А мы реально нашли, где ферма теряет деньги и показали это цифрами.»",
    author: "Команда «Недостачи»",
  },
  {
    project: "Апгрейд робота Unitree G1",
    result: "Гуманоид научился уверенно ходить по неровному грунту фермы и отрабатывать базовые операции в коровнике.",
    review: "«Первый раз держали в руках робота за 7 миллионов. К концу смены он ходил по гравию и не падал.»",
    author: "Команда робототехники",
  },
  {
    project: "Автоматизация флотационной установки",
    result: "Описан техпроцесс, налажен сбор данных с установки и собран контур автоматического управления.",
    review: "«Разобрались в реальном оборудовании, а не в учебном стенде, это совсем другой уровень задач.»",
    author: "Команда автоматизации",
  },
  {
    project: "Умная система выпойки телят",
    result: "Прототип роботизированной бутылочки, чат-бот для сотрудников и «Шкала счастья» для оценки состояния молодняка.",
    review: "«Проект про заботу о телятах зашёл всем. Приятно делать технологию, которую видно на ферме сразу.»",
    author: "Команда «Счастливый телёнок»",
  },
  {
    project: "Автоматизация рекламных кампаний",
    result: "Система на Perplexity API анализирует эффективность, генерирует объявления и управляет кампаниями во ВКонтакте.",
    review: "«За смену собрали то, что обычно делает целый отдел маркетинга. И это работает само.»",
    author: "Команда маркетинга",
  },
];

// Реальные фотографии со смены (папка «Агрохаб (Истра)»)
const GALLERY = Array.from({ length: 9 }, (_, i) => `assets/gallery/g${i + 1}.jpg`);

export default function ResultsPage() {
  const base = import.meta.env.BASE_URL;
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Что уже сделано"
        title="Результаты смен"
        subtitle="Каждая смена, это команды, которые за считаные дни доводят реальные задачи предприятий от идеи до рабочего прототипа. Ниже, итоги проектов, видео со смен и отзывы участников."
      />

      <div className="px-6 md:px-12 lg:px-24 pb-24 bg-[#0F1108]/60">
        <div className="max-w-6xl mx-auto space-y-20 md:space-y-24">

          {/* Достижения */}
          <section className="-mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["3", "смены проведено"],
              ["10+", "команд"],
              ["5", "проектов до прототипа"],
              ["7 млн ₽", "оборудования в работе"],
            ].map(([n, l]) => (
              <div key={l} className={`${card} p-6 text-center`}>
                <div className="font-sans font-black uppercase text-2xl md:text-3xl text-[#D4DE72] leading-none mb-2">{n}</div>
                <div className="text-xs text-[#E8E6D9]/70 leading-snug">{l}</div>
              </div>
            ))}
          </section>

          {/* Результаты проектов, таблица/карточки */}
          <section>
            <h2 className="font-sans font-bold uppercase text-2xl md:text-4xl text-[#DAD7CD] mb-8">Результаты проектов</h2>
            <div className="space-y-4">
              {PROJECT_RESULTS.map((p, i) => (
                <motion.div
                  key={p.project}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                  className={`${card} p-6 md:p-7 grid md:grid-cols-[1fr_1fr] gap-5 md:gap-8`}
                >
                  <div>
                    <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#A3B18A]">Проект {i + 1}</span>
                    <h3 className="font-sans font-bold uppercase text-lg text-[#E8E6D9] mt-1 mb-2 leading-tight">{p.project}</h3>
                    <p className="text-sm text-[#E8E6D9]/75 leading-relaxed">{p.result}</p>
                  </div>
                  <div className="md:border-l md:border-[#E8E6D9]/10 md:pl-8 flex flex-col justify-center">
                    <p className="font-serif italic text-base text-[#E8E6D9] leading-relaxed">{p.review}</p>
                    <span className="mt-3 text-[11px] uppercase tracking-widest font-bold text-[#A3B18A]">{p.author}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Видео со смен */}
          <section>
            <h2 className="font-sans font-bold uppercase text-2xl md:text-4xl text-[#DAD7CD] mb-8">Видео со смен</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {TRACK_GALLERIES.map((g, i) => (
                <div
                  key={g.id}
                  onClick={() => setExpandedTrack(g.id)}
                  className="relative overflow-hidden rounded-3xl h-[360px] cursor-pointer hover:scale-[1.02] transition-transform duration-300 group shadow-xl"
                >
                  <img src={`${base}${TRACK_COVERS[i]}`} alt={g.subtitle} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
                  <div className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/45 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                    <h3 className="font-sans font-bold uppercase text-lg text-[#E8E6D9]">{g.subtitle}</h3>
                    <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#D4DE72] mt-1">Смотреть</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Галерея */}
          <section>
            <h2 className="font-sans font-bold uppercase text-2xl md:text-4xl text-[#DAD7CD] mb-8">Галерея</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {GALLERY.map((src, i) => (
                <div key={src} className="relative overflow-hidden rounded-2xl aspect-[4/3] border border-[#E8E6D9]/10 group">
                  <img src={`${base}${src}`} alt="" referrerPolicy="no-referrer" style={{ objectPosition: i === 1 ? "center top" : "center" }} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#E8E6D9]/45">Фотоотчёты со смен пополняются после каждого заезда.</p>
          </section>

          <div className="flex justify-center">
            <Link to="/apply" className="py-4 px-10 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white transition-all text-center">
              Подать заявку на смену
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expandedTrack !== null && (() => {
          const gallery = TRACK_GALLERIES.find((g) => g.id === expandedTrack);
          if (!gallery) return null;
          return <ReelModal gallery={gallery} onClose={() => setExpandedTrack(null)} />;
        })()}
      </AnimatePresence>
    </>
  );
}
