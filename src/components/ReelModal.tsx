import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Heart, Eye, Volume2, Video, Sparkles } from "lucide-react";

interface ReelItem {
  type: string;
  url: string;
  title: string;
  desc: string;
  likes: string;
  views: string;
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

  // Активный рил определяется тем, какой слайд сейчас в центре ленты (ручной скролл).
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
        {/* ЛЕВО: описание кейса + кнопки (меняется при скролле ленты) */}
        <div className="w-full md:w-2/5 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#E8E6D9]/10 flex flex-col justify-between bg-[#1B3022]/10 shrink-0">
          <div>
            {gallery.subtitle && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#A3B18A]">
                {gallery.subtitle}
              </span>
            )}
            <h3 className="font-serif italic text-2xl md:text-3xl text-[#E8E6D9] leading-tight mt-2">
              {gallery.title}
            </h3>
            <div className="mt-5 pt-4 border-t border-[#E8E6D9]/10 min-h-[132px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-mono text-[#D4DE72] uppercase tracking-wider font-semibold mb-2">
                    {current.title}
                  </p>
                  <p className="text-sm text-[#E8E6D9]/75 leading-relaxed">
                    {current.desc}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-[11px] font-mono text-[#DAD7CD]/60">
                    <span className="flex items-center gap-1 text-red-400">
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      {current.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {current.views}
                    </span>
                  </div>
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
                aria-label={`Рил ${i + 1}`}
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
              Закрыть галерею
            </button>
          </div>
        </div>

        {/* ПРАВО: вертикальная лента рилсов 9:16, ручной скролл со snap */}
        <div
          ref={feedRef}
          className="relative w-full md:w-3/5 flex-1 min-h-0 bg-[#080905] overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-20 font-mono text-[9px] uppercase tracking-widest text-[#E8E6D9]/50 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
            Листай ленту ↕
          </div>

          {gallery.items.map((item, idx) => (
            <div
              key={idx}
              data-idx={idx}
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              className="snap-center h-full w-full flex items-center justify-center p-4 shrink-0"
            >
              <div className="relative aspect-[9/16] h-full max-h-[540px] w-auto rounded-2xl overflow-hidden bg-black border border-[#E8E6D9]/15 shadow-2xl group">
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40 pointer-events-none" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <span className="font-mono text-[8px] bg-black/60 text-[#DAD7CD] px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    {item.type === "video" ? (
                      <Video className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5 text-[#D4DE72]" />
                    )}
                    {item.type === "video" ? "VIDEO REEL" : "PHOTO SPOT"}
                  </span>
                  {item.type === "video" && (
                    <div className="w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
                      <Volume2 className="w-3 h-3 text-[#A3B18A]" />
                    </div>
                  )}
                </div>

                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 z-10 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-10">
                  <p className="font-serif italic text-base text-white leading-tight">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-[9px] font-mono text-[#DAD7CD]/70">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-red-400">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </span>
                    </span>
                    <span>@agrohub_live</span>
                  </div>
                </div>
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
