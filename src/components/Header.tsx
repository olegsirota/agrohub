import React from "react";
import { Award, Zap, MessageCircle } from "lucide-react";

interface HeaderProps {
  onScrollToForm: () => void;
  onScrollToSection: (sectionId: string) => void;
  submissionsCount: number;
}

export default function Header({ onScrollToForm, onScrollToSection, submissionsCount }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent border-b border-[#E8E6D9]/10 py-3.5 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* Brand logo */}
      <div className="flex items-center gap-3">
        <img
          src={`${import.meta.env.BASE_URL}assets/logo.png`}
          className="w-10 h-10 object-contain"
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

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest text-[#E8E6D9]/80 font-sans font-bold">
        <button
          onClick={() => onScrollToSection("why-section")}
          className="hover:text-[#E8E6D9] cursor-pointer transition-colors"
        >
          О лагере
        </button>
        <button
          onClick={() => onScrollToSection("tracks-section")}
          className="hover:text-[#E8E6D9] cursor-pointer transition-colors"
        >
          Направления
        </button>
        <button
          onClick={() => onScrollToSection("faq-section")}
          className="hover:text-[#E8E6D9] cursor-pointer transition-colors"
        >
          FAQ
        </button>
      </nav>

      {/* Live submissions and CTA */}
      <div className="flex items-center gap-4">
        <a
          href="https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-5 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-[9px] tracking-widest rounded-full hover:bg-white transition-all cursor-pointer shadow-[0_2px_10px_rgba(232,230,217,0.1)] active:scale-95 text-center inline-block"
        >
          Подать заявку
        </a>
      </div>
    </header>
  );
}
