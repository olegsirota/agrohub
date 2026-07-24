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

  // Активное видео = то, что сейчас в ленте (считаем по позиции скролла, // работает и при ручном свайпе, и при программном скролле).
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = feed.clientHeight || 1;
        const idx = Math.round(feed.scrollTop / h);
        setActive((prev) =>
          idx !== prev && idx >= 0 && idx < gallery.items.length ? idx : prev
        );
      });
    };
    feed.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      feed.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [gallery.id, gallery.items.length]);

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

  // При открытии ленты, сброс на первое видео (без дрейфа от загрузки видео).
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
      className="fixed inset-0 bg-[#0F1108]/95 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 340 }}
        className="relative max-w-4xl w-full bg-[#12140D] border border-[#E8E6D9]/15 rounded-3xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[78vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ПОДПИСЬ: на мобильном, компактная шапка сверху, на десктопе, левая колонка */}
        <div className="w-full md:w-2/5 shrink-0 p-4 pr-14 md:p-8 md:pr-8 border-b md:border-b-0 md:border-r border-[#E8E6D9]/10 flex flex-col md:justify-between bg-[#1B3022]/10">
          <div>
            {gallery.subtitle && (
              <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#A3B18A]">
                {gallery.subtitle}
              </span>
            )}
            <h3 className="font-sans font-bold uppercase text-lg md:text-3xl text-[#E8E6D9] leading-tight mt-1 md:mt-2">
              {gallery.title}
            </h3>
            <div className="mt-3 md:mt-5 md:pt-4 md:border-t border-[#E8E6D9]/10 md:min-h-[110px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-[11px] md:text-xs font-sans font-bold text-[#D4DE72] uppercase tracking-wider mb-1 md:mb-2">
                    {current.title}
                  </p>
                  <p className="text-[13px] md:text-sm text-[#E8E6D9]/75 leading-relaxed line-clamp-2 md:line-clamp-none">
                    {current.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* индикатор позиции + быстрый переход (виден на всех размерах) */}
          <div className="flex items-center gap-2 mt-3 md:my-4">
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
                  i === active ? "w-6 bg-[#A3B18A]" : "w-2 bg-[#E8E6D9]/25"
                }`}
                aria-label={`Видео ${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-3 md:mt-0 space-y-2 md:space-y-3">
            <a
              href="https://forms.yandex.ru/u/6a4b9a481f1eb5002fd7c9f3"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 md:py-3 px-6 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-white transition-all text-center block shadow-md"
            >
              Подать заявку
            </a>
            <button
              onClick={onClose}
              className="hidden md:block w-full py-3 px-6 bg-transparent border border-[#E8E6D9]/20 hover:border-[#E8E6D9]/40 text-[#E8E6D9] font-semibold uppercase text-[10px] tracking-widest rounded-full transition-all text-center"
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* ВИДЕО: вертикальная лента 9:16, ручной скролл со snap.
            На мобильном видео заполняет экран целиком (edge-to-edge). */}
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
              className="snap-center h-full w-full shrink-0 flex items-center justify-center p-0 md:p-4"
            >
              <div className="relative h-full w-full md:h-full md:w-auto md:aspect-[9/16] md:max-h-[540px] overflow-hidden bg-black rounded-none md:rounded-2xl md:border md:border-[#E8E6D9]/15 md:shadow-2xl">
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                    if (el) {
                      // iOS/Safari: атрибут muted обязателен для автозапуска
                      el.muted = true;
                      el.defaultMuted = true;
                      el.setAttribute("muted", "");
                    }
                  }}
                  src={`${base}${item.url}`}
                  poster={`${base}${item.url.replace("videos/", "videos/posters/").replace(/\.mp4$/, ".jpg")}`}
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
