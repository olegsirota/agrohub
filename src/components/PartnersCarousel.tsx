import React from "react";

const PARTNERS = [
  { name: "АО «Росагролизинг»", role: "Со-организатор", file: "assets/rosagro.png" },
  { name: "Минсельхоз РФ", role: "Поддержка", file: "assets/minselkhoz.png" },
  { name: "Ассоциация «Народный фермер»", role: "Партнёр", file: "assets/fermer.png" },
  { name: "Истринская сыроварня Олега Сироты", role: "Площадка", file: "assets/sirota.png" },
];

export default function PartnersCarousel() {
  const base = import.meta.env.BASE_URL;
  // Дублируем список, чтобы бесконечная лента прокручивалась бесшовно (-50%).
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <section
      aria-label="Организаторы и партнёры"
      className="relative bg-[#E8E6D9] py-9 md:py-12 overflow-hidden"
    >
      <div className="flex items-center justify-center gap-3 mb-7 px-6">
        <span className="h-px w-8 md:w-12 bg-[#1B3022]/25" />
        <span className="uppercase text-[11px] md:text-xs tracking-[0.28em] font-bold text-[#1B3022] text-center">
          Организаторы и партнёры
        </span>
        <span className="h-px w-8 md:w-12 bg-[#1B3022]/25" />
      </div>

      <div className="relative">
        {/* Плавное затухание по краям ленты */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-28 bg-gradient-to-r from-[#E8E6D9] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-28 bg-gradient-to-l from-[#E8E6D9] to-transparent" />

        <div className="animate-marquee hover:[animation-play-state:paused]">
          {items.map((p, i) => (
            <div
              key={i}
              title={p.name}
              aria-hidden={i >= PARTNERS.length}
              className="group mx-3 md:mx-4 shrink-0 flex items-center gap-4 h-20 md:h-24 rounded-2xl bg-white shadow-[0_6px_24px_rgba(15,17,8,0.10)] px-6 md:px-7 ring-1 ring-black/5"
            >
              <img
                src={`${base}${p.file}`}
                alt={p.name}
                loading="lazy"
                className="max-h-12 md:max-h-16 w-auto object-contain shrink-0"
              />
              <div className="hidden md:block leading-tight border-l border-black/10 pl-4 max-w-[190px]">
                <div className="text-[10px] uppercase tracking-widest text-[#3A5A40] font-bold">
                  {p.role}
                </div>
                <div className="text-[13px] text-[#0F1108] font-semibold">{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
