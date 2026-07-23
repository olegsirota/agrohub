import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const base = import.meta.env.BASE_URL;
  return (
    <footer className="pt-8 pb-8 px-6 md:px-12 lg:px-24 bg-[#0F1108] border-t border-[#E8E6D9]/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={`${base}assets/cheese_logo.png`}
            className="w-9 h-9 object-contain"
            alt="Logo"
            referrerPolicy="no-referrer"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <span className="font-sans font-bold uppercase text-xs md:text-sm tracking-widest text-[#E8E6D9] leading-none">
            Агрохаб 2026
          </span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-sans font-bold text-[#E8E6D9]/50">
          <Link to="/program" className="hover:text-[#E8E6D9]">Программа</Link>
          <Link to="/results" className="hover:text-[#E8E6D9]">Результаты смен</Link>
          <Link to="/apply" className="hover:text-[#E8E6D9]">Подать заявку</Link>
        </nav>

        <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#E8E6D9]/40 text-center">
          Истринская сыроварня Олега и Татьяны Сироты
        </span>
      </div>
    </footer>
  );
}
