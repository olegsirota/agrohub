import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Submission, Review, FAQItem } from "./types";
import { FAQ_DATA, REVIEWS_DATA, PARTNERS_DATA } from "./data";

// Sub-components
import Header from "./components/Header";
import HolographicPlant from "./components/HolographicPlant";
import AiConsultant from "./components/AiConsultant";
import RealityShow from "./components/RealityShow";
import FormSection from "./components/FormSection";
import PartnersCarousel from "./components/PartnersCarousel";
import ReelModal from "./components/ReelModal";

// Icons
import {
  ChevronDown,
  Cpu,
  Dog,
  Brain,
  Sparkles,
  Award,
  Zap,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Flame,
  Milestone,
  X,
  Database,
  Users,
  Video,
  Play,
  Volume2,
  Heart,
  Eye
} from "lucide-react";

const TRACK_GALLERIES = [
  {
    id: 1,
    title: "Программируй роботов",
    subtitle: "Роботы и Манипуляторы в действии",
    items: [
      {
        type: "video",
        url: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Тестирование захвата манипулятора",
        desc: "Программирование деликатного захвата для сортировки хрупкой продукции на сыроварне.",
        likes: "1.2k",
        views: "14.5k"
      },
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Калибровка датчиков давления",
        desc: "Точность до миллиметра при взаимодействии робота с сырными головками.",
        likes: "945",
        views: "8.2k"
      },
      {
        type: "video",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Автоматический обход конвейера",
        desc: "Интеграция роборуки с лентой подачи готовой продукции.",
        likes: "2.1k",
        views: "22.0k"
      }
    ]
  },
  {
    id: 2,
    title: "«Дрессируй» Unitree Go2",
    subtitle: "Испытания четвероногих на ферме",
    items: [
      {
        type: "video",
        url: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Обход территории коровника",
        desc: "Unitree Go2 патрулирует Истринскую ферму, собирая данные о температуре и влажности.",
        likes: "3.4k",
        views: "45.1k"
      },
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Преодоление препятствий на поле",
        desc: "Программирование алгоритмов стабилизации на сложной каменистой почве.",
        likes: "1.8k",
        views: "19.3k"
      },
      {
        type: "video",
        url: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Синхронный танец робособак",
        desc: "Душевные вечерние тесты робособак у костра — любимое шоу участников.",
        likes: "4.7k",
        views: "58.9k"
      }
    ]
  },
  {
    id: 3,
    title: "Обучай нейросети",
    subtitle: "АгроИИ и компьютерное зрение",
    items: [
      {
        type: "video",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Распознавание зерна в реальном времени",
        desc: "Обученная модель за миллисекунды классифицирует сорт и влажность пшеницы по фото.",
        likes: "2.8k",
        views: "33.2k"
      },
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Анализ зрелости колосьев",
        desc: "Сбор датасета пшеницы на полях Подмосковья для предобучения ИИ-моделей.",
        likes: "1.1k",
        views: "11.6k"
      },
      {
        type: "video",
        url: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&h=1000&q=80",
        title: "Тепловая карта здоровья посевов",
        desc: "Обработка снимков со спутника для составления точных карт полива.",
        likes: "3.2k",
        views: "38.5k"
      }
    ]
  }
];

// Обложки треков: гуманоид (роботы), робособака, программист (нейросети).
// Клик по обложке открывает ленту тиктоков (ReelModal).
const TRACK_COVERS = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&h=800&q=80",
];

function VerticalReelTicker({ items }: { items: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3000); // Switch every 3 seconds
    return () => clearInterval(timer);
  }, [items.length]);

  const currentItem = items[activeIndex];

  return (
    <div className="relative aspect-[9/16] h-[220px] w-auto overflow-hidden rounded-2xl bg-black/40 border border-[#E8E6D9]/10 mt-3 flex items-center justify-center mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full flex flex-col justify-between p-4"
        >
          {/* Background Image Preview */}
          <div className="absolute inset-0">
            <img
              src={currentItem.url}
              alt=""
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          </div>

          {/* Top Tag & Info */}
          <div className="relative z-10 flex justify-between items-center w-full">
            <span className="font-mono text-[7px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              {currentItem.type === "video" ? "VIDEO REEL" : "PHOTO SPOT"}
            </span>
            <div className="flex items-center gap-1 text-[9px] text-white/80 font-mono">
              <span className="flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                {currentItem.likes}
              </span>
            </div>
          </div>

          {/* Play Icon Indicator Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-lg">
              {currentItem.type === "video" ? (
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#D4DE72]" />
              )}
            </div>
          </div>

          {/* Bottom Title & Description */}
          <div className="relative z-10 text-left">
            <h4 className="font-serif italic text-xs text-white leading-tight mb-0.5 truncate">
              {currentItem.title}
            </h4>
            <p className="text-[9px] text-[#DAD7CD]/80 font-sans line-clamp-1 leading-normal">
              {currentItem.desc}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeFaq, setActiveFaq] = useState<string | null>("faq-1");
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  // Reset active reel when modal track changes
  useEffect(() => {
    setActiveReelIndex(0);
  }, [expandedTrack]);

  // Section Refs for smooth scrolling
  const whyRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Load initial submissions from Express API on mount
  useEffect(() => {
    fetch("/api/submissions")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setSubmissions(data))
      .catch((err) => {
        console.error("Could not fetch submissions, using default fallback seed data.", err);
        // Fallback seed data if backend is still starting up
        setSubmissions([
          {
            id: "seed-1",
            name: "Игорь К.",
            role: "Разработчик ИИ",
            track: "ИИ и Нейросети",
            timestamp: "2 мин. назад"
          },
          {
            id: "seed-2",
            name: "Дарья П.",
            role: "Инженер-робототехник",
            track: "Роботы и Манипуляторы",
            timestamp: "15 мин. назад"
          }
        ]);
      });
  }, []);

  const handleAddSubmission = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const handleScrollToForm = () => {
    const link = document.createElement("a");
    link.href = "https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

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
        onScrollToForm={handleScrollToForm}
        onScrollToSection={handleScrollToSection}
        submissionsCount={submissions.length}
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
                  {[["3-я смена", "16–25 июля"], ["4-я смена", "9–19 августа"], ["5-я смена", "19–29 августа"]].map(([sm, d]) => (
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
              <img src={TRACK_COVERS[0]} alt="Роботы" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
              <img src={TRACK_COVERS[1]} alt="Робособаки" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
              <img src={TRACK_COVERS[2]} alt="Нейросети" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
              src={`${import.meta.env.BASE_URL}assets/logo.png`}
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
