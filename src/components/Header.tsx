import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { APPLY_FORM } from "../data";

const NAV = [
  { to: "/", label: "Главная", end: true },
  { to: "/program", label: "Программа", end: false },
  { to: "/results", label: "Результаты смен", end: false },
  { to: "/apply", label: "Подать заявку", end: false },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const base = import.meta.env.BASE_URL;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${isActive ? "text-[#D4DE72]" : "text-[#E8E6D9]/80 hover:text-[#E8E6D9]"}`;

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent border-b border-[#E8E6D9]/10 py-3.5 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
        <img
          src={`${base}assets/cheese_logo.png`}
          className="w-10 h-10 object-contain"
          alt="Logo"
          referrerPolicy="no-referrer"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <span className="font-sans font-bold uppercase text-xs md:text-sm tracking-widest text-[#E8E6D9] leading-none">
          Агрохаб 2026
        </span>
      </Link>

      {/* десктоп-навигация */}
      <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-sans font-bold">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <a
          href={APPLY_FORM}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-block py-2.5 px-5 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-[9px] tracking-widest rounded-full hover:bg-white transition-all active:scale-95"
        >
          Подать заявку
        </a>
        {/* мобильное меню */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[#E8E6D9] p-1"
          aria-label="Меню"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0F1108]/97 backdrop-blur-md border-b border-[#E8E6D9]/10 flex flex-col py-4 px-6 gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-3 uppercase text-sm tracking-widest font-sans font-bold border-b border-[#E8E6D9]/5 ${
                  isActive ? "text-[#D4DE72]" : "text-[#E8E6D9]/90"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
