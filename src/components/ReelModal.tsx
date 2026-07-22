import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ReelItem {
  url: string;
  title: string;
  desc: string;
}
interface Gallery {
  id: number;
  title: string;
  subtitle?: string;
  items: ReelItem[];
}

export default function ReelModal({
  gallery,
  onClose,
}: {
  gallery: Gallery;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const base = import.meta.env.BASE_URL;

  // Активное видео = то, что сейчас в центре ленты (ручной скролл).
  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.55) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { root, threshold: [0.55, 0.8] }
    );
    slideRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [gallery.id]);

  // Играет только активное видео, остальные на паузе.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active, gallery.id]);

  // При открытии ленты — сброс на первое видео (без дрейфа от загрузки видео).
  useEffect(() => {
    setActive(0);
    const id = requestAnimationFrame(() => {
      if (feedRef.current) feedRef.current.scrollTop = 0;
    });
    return () => cancelAnimationFrame(id);
  }, [gallery.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const current = gallery.items[active] ?? gallery.items[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0F1108]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 340 }}
        className="relative max-w-4xl w-full bg-[#12140D] border border-[#E8E6D9]/15 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[88vh] md:h-[78vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ЛЕВО: краткое описание + кнопки (меняется при скролле ленты) */}
        <div className="w-full md:w-2/5 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#E8E6D9]/10 flex flex-col justify-between bg-[#1B3022]/10 shrink-0">
          <div>
            {gallery.subtitle && (
              <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#A3B18A]">
                {gallery.subtitle}
              </span>
            )}
            <h3 className="font-sans font-bold uppercase text-2xl md:text-3xl text-[#E8E6D9] leading-tight mt-2">
              {gallery.title}
            </h3>
            <div className="mt-5 pt-4 border-t border-[#E8E6D9]/10 min-h-[110px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-sans font-bold text-[#D4DE72] uppercase tracking-wider mb-2">
                    {current.title}
                  </p>
                  <p className="text-sm text-[#E8E6D9]/75 leading-relaxed">
                    {current.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* индикатор позиции + быстрый переход */}
          <div className="hidden md:flex items-center gap-2 my-4">
            {gallery.items.map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  slideRefs.current[i]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-[#A3B18A]" : "w-1.5 bg-[#E8E6D9]/25"
                }`}
                aria-label={`Видео ${i + 1}`}
              />
            ))}
          </div>

          <div className="space-y-3">
            <a
              href="https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-white transition-all text-center block shadow-md"
            >
              Подать заявку
            </a>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-transparent border border-[#E8E6D9]/20 hover:border-[#E8E6D9]/40 text-[#E8E6D9] font-semibold uppercase text-[10px] tracking-widest rounded-full transition-all text-center block"
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* ПРАВО: вертикальная лента видео 9:16, ручной скролл со snap */}
        <div
          ref={feedRef}
          className="relative w-full md:w-3/5 flex-1 min-h-0 bg-[#080905] overflow-y-scroll snap-y snap-mandatory [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.items.map((item, idx) => (
            <div
              key={idx}
              data-idx={idx}
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              className="snap-center h-full w-full flex items-center justify-center p-4 shrink-0"
            >
              <div className="relative aspect-[9/16] h-full max-h-[540px] w-auto rounded-2xl overflow-hidden bg-black border border-[#E8E6D9]/15 shadow-2xl">
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={`${base}${item.url}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[#E8E6D9] hover:text-white hover:bg-black/80 transition-all z-[55]"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}
