import React from "react";

const PARTNERS = [
  { name: "АО «Росагролизинг»", role: "Со-организатор", file: "assets/rosagro.png" },
  { name: "Минсельхоз РФ", role: "Поддержка", file: "assets/minselkhoz.png" },
  { name: "Ассоциация «Народный фермер»", role: "Партнёр", file: "assets/fermer.png" },
  { name: "Истринская сыроварня Олега Сироты", role: "Площадка", file: "assets/sirota.png" },
];

// Узкая полупрозрачная панель партнёров. Без заголовка, без фона —
// накладывается прямо на фото hero.
export default function PartnersCarousel() {
  const base = import.meta.env.BASE_URL;
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <div className="w-full bg-black/25 backdrop-blur-md border-t border-white/10 overflow-hidden">
      <div className="relative py-2.5 md:py-3">
        <div className="animate-marquee hover:[animation-play-state:paused]">
          {items.map((p, i) => (
            <div
              key={i}
              title={p.name}
              aria-hidden={i >= PARTNERS.length}
              className="mx-5 md:mx-8 shrink-0 flex items-center gap-3"
            >
              <img
                src={`${base}${p.file}`}
                alt={p.name}
                loading="lazy"
                className="max-h-8 md:max-h-10 w-auto object-contain drop-shadow-[0_1px_5px_rgba(0,0,0,0.7)]"
              />
              <div className="hidden lg:block leading-tight">
                <div className="text-[9px] uppercase tracking-widest text-[#D4DE72] font-bold">
                  {p.role}
                </div>
                <div className="text-[11px] text-[#E8E6D9] font-semibold whitespace-nowrap">
                  {p.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
