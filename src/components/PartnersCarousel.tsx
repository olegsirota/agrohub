import React from "react";

const PARTNERS = [
  { name: "АО «Росагролизинг»", role: "Со-организатор", file: "assets/rosagro.png" },
  { name: "Минсельхоз РФ", role: "Поддержка", file: "assets/minselkhoz.png" },
  { name: "Ассоциация «Народный фермер»", role: "Партнёр", file: "assets/fermer.png" },
  { name: "Истринская сыроварня Олега Сироты", role: "Площадка", file: "assets/sirota.png" },
];

export default function PartnersCarousel() {
  const base = import.meta.env.BASE_URL;
  // Дублируем список для бесшовной прокрутки (-50%).
  const items = [...PARTNERS, ...PARTNERS];

  return (
    // Прозрачный фон (#1B3022 = цвет низа hero и верха «Польза») — переход остаётся плавным.
    <section
      aria-label="Организаторы и партнёры"
      className="relative bg-[#1B3022] py-10 md:py-12 overflow-hidden"
    >
      {/* лёгкое затемнение сзади */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25" />

      <div className="relative flex items-center justify-center gap-3 mb-6 px-6">
        <span className="h-px w-8 md:w-12 bg-[#E8E6D9]/25" />
        <span className="uppercase text-[11px] md:text-xs tracking-[0.28em] font-bold text-[#A3B18A] text-center">
          Организаторы и партнёры
        </span>
        <span className="h-px w-8 md:w-12 bg-[#E8E6D9]/25" />
      </div>

      {/* две полупрозрачные линии сверху и снизу — метка карусели */}
      <div className="relative border-y border-[#E8E6D9]/15 bg-black/10">
        {/* затухание по краям в цвет секции */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-28 bg-gradient-to-r from-[#1B3022] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-28 bg-gradient-to-l from-[#1B3022] to-transparent" />

        <div className="animate-marquee hover:[animation-play-state:paused] py-6">
          {items.map((p, i) => (
            <div
              key={i}
              title={p.name}
              aria-hidden={i >= PARTNERS.length}
              className="group mx-6 md:mx-9 shrink-0 flex items-center gap-4"
            >
              {/* мягкая подсветка, чтобы лого читалось на тёмном фоне */}
              <div className="relative flex items-center justify-center h-16 md:h-20 w-28 md:w-32 shrink-0">
                <div className="absolute inset-0 rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(240,240,232,0.22),rgba(240,240,232,0.08)_45%,transparent_72%)] blur-[2px]" />
                <img
                  src={`${base}${p.file}`}
                  alt={p.name}
                  loading="lazy"
                  className="relative max-h-12 md:max-h-16 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
                />
              </div>
              <div className="hidden md:block leading-tight border-l border-[#E8E6D9]/20 pl-4 max-w-[190px]">
                <div className="text-[10px] uppercase tracking-widest text-[#D4DE72] font-bold">
                  {p.role}
                </div>
                <div className="text-[13px] text-[#E8E6D9] font-semibold">{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
