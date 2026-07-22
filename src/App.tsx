import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FAQItem } from "./types";
import { FAQ_DATA } from "./data";

// Sub-components
import Header from "./components/Header";
import PartnersCarousel from "./components/PartnersCarousel";
import ReelModal from "./components/ReelModal";

import { ChevronDown, Play } from "lucide-react";

const TRACK_GALLERIES = [
  {
    id: 1,
    title: "Программируй роботов",
    subtitle: "Гуманоид на ферме",
    items: [
      {
        url: "assets/videos/robo1.mp4",
        title: "Учим робота ходить без страховки.",
        desc: "Связываем управление пультом, VR и нейросеть.",
      },
      {
        url: "assets/videos/robo2.mp4",
        title: "Стабилизируем и учим бегать.",
        desc: "Улучшаем устойчивость, чтобы робот не падал на крупном гравии.",
      },
      {
        url: "assets/videos/robo3.mp4",
        title: "Приносим кофе автоматически",
        desc: "Учим робота строить маршруты, оптимально их проходить, правильно определять объекты и аккуратно брать маленькие предметы.",
      },
    ],
  },
  {
    id: 2,
    title: "«Дрессируй» Unitree Go2",
    subtitle: "Робособаки в поле",
    items: [
      {
        url: "assets/videos/dog1.mp4",
        title: "Обход периметра фермы",
        desc: "Робособака идёт вдоль ограды загона, собирая данные о территории.",
      },
      {
        url: "assets/videos/dog2.mp4",
        title: "Отладка походки в ангаре",
        desc: "Настройка алгоритмов движения и стабилизации на гладком полу.",
      },
      {
        url: "assets/videos/dog3.mp4",
        title: "Маршрут у коровника",
        desc: "Go2 проходит заданный маршрут по гравию в сумерках.",
      },
    ],
  },
  {
    id: 3,
    title: "Обучай нейросети",
    subtitle: "АгроИИ и хакатон",
    items: [
      {
        url: "assets/videos/neiro1.mp4",
        title: "Распознаём изображение и данные с видео в реальном времени.",
        desc: "Дообучаем нейросети для корректной работы зрения робота, устанавливаем их на робота локально.",
      },
      {
        url: "assets/videos/neiro2.mp4",
        title: "Вендинг «Счастливый телёнок».",
        desc: "Изучаем счастье коров с помощью ИИ.",
      },
      {
        url: "assets/videos/neiro3.mp4",
        title: "Зрение и голова.",
        desc: "Собираем умную голову с локальным ИИ.",
      },
    ],
  },
];

// Обложки карточек направлений (клик открывает ленту видео).
const TRACK_COVERS = [
  "assets/robophoto.jpg",
  "assets/robodogphoto.jpg",
  "assets/neirophoto.jpg",
];

export default function App() {
  const [activeFaq, setActiveFaq] = useState<string | null>("faq-1");
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null);

  // Ссылки на секции для плавной прокрутки из меню
  const whyRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const handleScrollToSection = (sectionId: string) => {
    let targetRef: React.RefObject<HTMLDivElement | null> | null = null;
    if (sectionId === "why-section") targetRef = whyRef;
    else if (sectionId === "tracks-section") targetRef = tracksRef;
    else if (sectionId === "faq-section") targetRef = faqRef;

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1108] text-[#E8E6D9] font-sans overflow-x-clip selection:bg-[#A3B18A]/30 selection:text-[#E8E6D9]">
      
      {/* 2. Navigation Header */}
      <Header
        onScrollToSection={handleScrollToSection}
      />

      {/* 3. Hero Section (Opener) */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-24 px-6 md:px-12 lg:px-24 border-none bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 17, 8, 0) 0%, rgba(15, 17, 8, 0.1) 40%, rgba(27, 48, 34, 0.6) 80%, #1B3022 100%), url('${import.meta.env.BASE_URL}assets/farm_bg.jpeg')`
        }}
      >
        <div className="relative z-20 max-w-5xl">
          
          {/* Heavy Modern Display Heading */}
          <h1 className="font-sans font-black uppercase text-5xl sm:text-7xl md:text-[80px] tracking-tighter leading-[0.85] mb-8 text-[#E8E6D9]">
            АГРОХАБ 2026 <br />
            <span className="text-4xl sm:text-6xl md:text-[72px] block mt-4 text-[#E8E6D9] font-sans font-black uppercase tracking-tighter leading-[0.85]">
              на сыроварне Олега Сироты
            </span>
          </h1>

          <div className="max-w-2xl mb-8">
            <p className="font-serif italic text-xl sm:text-2xl text-[#D4DE72] mb-3 leading-relaxed">
              Отдохни за делом.
            </p>
            <p className="text-sm sm:text-base text-[#E8E6D9] leading-relaxed font-sans font-medium drop-shadow-sm">
              Программируй роботов, дрессируй робособак, обучай нейросети прямо на действующей сыроварне в Истре.
            </p>
          </div>

          {/* Core Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14">
            <a
              href="https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3"
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white hover:scale-[1.02] transition-all cursor-pointer text-center inline-block"
            >
              ПОДАТЬ ЗАЯВКУ
            </a>
            <button
              onClick={() => handleScrollToSection("tracks-section")}
              className="py-4 px-8 bg-transparent border border-[#E8E6D9]/30 hover:border-[#E8E6D9]/60 hover:bg-[#E8E6D9]/5 text-[#E8E6D9] font-semibold uppercase text-xs tracking-widest rounded-full transition-all cursor-pointer text-center"
            >
              Что внутри
            </button>
          </div>
        </div>

        {/* Узкая полупрозрачная панель партнёров поверх фото hero */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <PartnersCarousel />
        </div>
      </section>

      {/* 4. Why Section (Польза от участия в лагере) */}
      <section
        id="why-section"
        ref={whyRef}
        className="relative pt-24 md:pt-36 pb-0 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#1B3022] to-[#0F1108] overflow-hidden w-full"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="font-sans font-bold uppercase text-3xl md:text-5xl text-[#DAD7CD] mb-8 md:mb-10 text-center md:text-left"
          >
            Польза от участия в лагере
          </motion.h2>

          {/* Часть 1: две ключевые выгоды */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mb-14 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#0F1108]/15 backdrop-blur-3xl rounded-2xl p-5 hover:bg-[#0F1108]/25 transition-all duration-300 shadow-xl"
            >
              <h3 className="font-sans font-bold uppercase text-lg md:text-xl text-[#DAD7CD] mb-1.5">Реальные данные с первого дня</h3>
              <p className="text-xs sm:text-sm text-[#E8E6D9]/70 leading-relaxed">
                Сам строишь пайплайны сбора данных, разрабатываешь, анализируешь и тестируешь прямо на Истринской сыроварне.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#0F1108]/15 backdrop-blur-3xl rounded-2xl p-5 hover:bg-[#0F1108]/25 transition-all duration-300 shadow-xl"
            >
              <h3 className="font-sans font-bold uppercase text-lg md:text-xl text-[#DAD7CD] mb-1.5">Дорогое производственное оборудование</h3>
              <p className="text-xs sm:text-sm text-[#E8E6D9]/70 leading-relaxed">
                Манипуляторы, робособаки Unitree Go2, нейросети. Сразу получаешь доступ к технике и наставникам.
              </p>
            </motion.div>
          </div>

          {/* Часть 2: смена — даты, распорядок, лекции */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="border-t border-[#E8E6D9]/12 pt-10 md:pt-12"
          >
            <h3 className="font-sans font-black uppercase text-2xl md:text-4xl tracking-tight text-[#E8E6D9] mb-8 md:mb-10">
              Смена <span className="text-[#D4DE72]">8 дней</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <p className="font-sans font-bold text-[10px] uppercase tracking-[0.22em] text-[#A3B18A] mb-4">Потоки 2026</p>
                <div className="space-y-3">
                  {[["4-я смена", "9–19 августа"], ["5-я смена", "19–29 августа"]].map(([sm, d]) => (
                    <div key={sm} className="flex items-baseline justify-between gap-3 border-b border-[#E8E6D9]/10 pb-2">
                      <span className="font-sans font-bold uppercase text-base md:text-lg text-[#DAD7CD]">{sm}</span>
                      <span className="text-sm md:text-base font-semibold text-[#E8E6D9] whitespace-nowrap">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-sans font-bold text-[10px] uppercase tracking-[0.22em] text-[#A3B18A] mb-4">День в лагере</p>
                <div className="space-y-2.5">
                  {[["08:00", "Подъём"], ["11:00", "Лекция"], ["12:00–17:00", "Проекты · гемба на ферме"], ["18:00", "Съёмка контента"], ["21:00", "Рефлексия у костра"]].map(([t, l]) => (
                    <div key={t} className="flex gap-3 items-baseline">
                      <span className="font-sans font-bold text-xs text-[#D4DE72] shrink-0 w-24">{t}</span>
                      <span className="text-sm text-[#E8E6D9]/85">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-sans font-bold text-[10px] uppercase tracking-[0.22em] text-[#A3B18A] mb-4">Чему учим · лекции</p>
                <ul className="space-y-2.5">
                  {["Робототехника Unitree G1", "Робособаки в поле", "Нейросети и компьютерное зрение", "Лекторий: лекции по продуктам", "Работа на ферме и нетворкинг"].map((x) => (
                    <li key={x} className="text-sm text-[#E8E6D9]/85 flex gap-2.5"><span className="text-[#D4DE72]">•</span>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* ПОДАТЬ ЗАЯВКУ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="pt-14 pb-16 flex justify-center"
          >
            <a
              href="https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3"
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-10 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white hover:scale-[1.05] transition-all cursor-pointer text-center inline-block shadow-lg"
            >
              ПОДАТЬ ЗАЯВКУ
            </a>
          </motion.div>
        </div>
      </section>

      {/* 5. Directions/Tracks Section */}
      <section
        id="tracks-section"
        ref={tracksRef}
        className="relative z-20 pt-[5px] pb-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0F1108] to-[#0a0b05] overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="font-sans font-black uppercase text-3xl sm:text-5xl md:text-[60px] tracking-tighter leading-[0.85] text-[#E8E6D9] mb-4">
              Три направления. <br className="sm:hidden" /> Одна смена.
            </h2>
            <p className="text-xs md:text-sm text-[#E8E6D9]/90 leading-relaxed font-sans font-medium">
              Участники делятся на команды и работают над тремя типами задач, чтобы сделать агросектор умнее, точнее и эффективнее.
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Track 1: Robots */}
            <div
              onClick={() => setExpandedTrack(1)}
              className="snap-center shrink-0 w-[80%] sm:w-[55%] md:w-full relative overflow-hidden rounded-3xl h-[360px] cursor-pointer hover:scale-[1.02] transition-all group duration-300 shadow-xl"
            >
              <img src={`${import.meta.env.BASE_URL}${TRACK_COVERS[0]}`} alt="Роботы" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
              <div className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/45 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                <h3 className="font-sans font-bold uppercase text-2xl text-[#E8E6D9]">Роботы</h3>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#D4DE72] mt-1">Подробнее</p>
              </div>
            </div>

            {/* Track 2: Robodogs */}
            <div
              onClick={() => setExpandedTrack(2)}
              className="snap-center shrink-0 w-[80%] sm:w-[55%] md:w-full relative overflow-hidden rounded-3xl h-[360px] cursor-pointer hover:scale-[1.02] transition-all group duration-300 shadow-xl"
            >
              <img src={`${import.meta.env.BASE_URL}${TRACK_COVERS[1]}`} alt="Робособаки" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
              <div className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/45 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                <h3 className="font-sans font-bold uppercase text-2xl text-[#E8E6D9]">Робособаки</h3>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#D4DE72] mt-1">Подробнее</p>
              </div>
            </div>

            {/* Track 3: AI & Neural Networks */}
            <div
              onClick={() => setExpandedTrack(3)}
              className="snap-center shrink-0 w-[80%] sm:w-[55%] md:w-full relative overflow-hidden rounded-3xl h-[360px] cursor-pointer hover:scale-[1.02] transition-all group duration-300 shadow-xl"
            >
              <img src={`${import.meta.env.BASE_URL}${TRACK_COVERS[2]}`} alt="Нейросети" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
              <div className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/45 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                <h3 className="font-sans font-bold uppercase text-2xl text-[#E8E6D9]">Нейросети</h3>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#D4DE72] mt-1">Подробнее</p>
              </div>
            </div>
          </div>

          {/* ПОДАТЬ ЗАЯВКУ Button after this block, centered on the third slide */}
          <div className="mt-16 flex justify-center">
            <a
              href="https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3"
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-10 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white hover:scale-[1.05] transition-all cursor-pointer text-center inline-block shadow-lg"
            >
              ПОДАТЬ ЗАЯВКУ
            </a>
          </div>
        </div>
      </section>

        {/* 11. FAQ Accordion Section */}
        <section
          id="faq-section"
          ref={faqRef}
          className="relative pt-[5px] pb-12 px-6 md:px-12 lg:px-24 bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, #0a0b05 0%, rgba(15, 17, 8, 0.75) 50%, rgba(15, 17, 8, 0.9) 100%), url('${import.meta.env.BASE_URL}assets/2026-07-19 21.05.14.jpg')`
          }}
        >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-sans font-bold uppercase text-3xl md:text-4xl text-[#DAD7CD]">
              Частые вопросы участников
            </h3>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((item) => {
              const isOpen = activeFaq === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-[#344E41]/10 border border-[#E8E6D9]/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : item.id)}
                    className="w-full p-5 text-left flex justify-between items-center hover:bg-[#344E41]/20 transition-all cursor-pointer"
                  >
                    <span className="font-sans font-bold uppercase text-sm sm:text-base text-[#E8E6D9]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#A3B18A] transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-[#E8E6D9]/5 text-xs sm:text-sm text-[#E8E6D9]/75 leading-relaxed font-sans">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* ПОДАТЬ ЗАЯВКУ Button after this block */}
          <div className="mt-12 flex justify-center">
            <a
              href="https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3"
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-10 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white hover:scale-[1.05] transition-all cursor-pointer text-center inline-block shadow-lg"
            >
              ПОДАТЬ ЗАЯВКУ
            </a>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="pt-[5px] pb-[5px] px-6 md:px-12 lg:px-24 bg-[#0F1108] border-t border-[#E8E6D9]/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}assets/cheese_logo.png`}
              className="w-9 h-9 object-contain"
              alt="Logo"
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <span className="font-sans font-bold uppercase text-xs md:text-sm tracking-widest text-[#E8E6D9] block leading-none">
                Агрохаб 2026
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest font-sans font-bold text-[#E8E6D9]/40">
            <span>Истринская сыроварня Олега и Татьяны Сироты</span>
          </div>
        </div>
      </footer>

      {/* 13. Interactive Media Gallery Modal */}
      <AnimatePresence>
        {expandedTrack !== null && (() => {
          const gallery = TRACK_GALLERIES.find(g => g.id === expandedTrack);
          if (!gallery) return null;
          return <ReelModal gallery={gallery} onClose={() => setExpandedTrack(null)} />;
        })()}
      </AnimatePresence>
    </div>
  );
}
