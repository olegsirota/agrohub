import React, { useEffect, useState } from "react";
import { TRACK_GALLERIES } from "../data";

// Список всех видео сайта
const VIDEO_URLS = TRACK_GALLERIES.flatMap((g) => g.items.map((i) => i.url));

export default function VideoGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    let done = 0;
    let finished = false;
    const total = VIDEO_URLS.length || 1;

    const bump = () => {
      done += 1;
      setProgress(Math.round((done / total) * 100));
      if (done >= total) reveal();
    };

    const reveal = () => {
      if (finished) return;
      finished = true;
      setReady(true);
    };

    // Предзагрузка видео; iOS не грузит видео без жеста — событие suspend считаем как «готово»
    const videos = VIDEO_URLS.map((u) => {
      const v = document.createElement("video");
      v.preload = "auto";
      v.muted = true;
      let counted = false;
      const onOk = () => { if (counted) return; counted = true; bump(); };
      v.addEventListener("canplaythrough", onOk, { once: true });
      v.addEventListener("suspend", onOk, { once: true });
      v.addEventListener("error", onOk, { once: true });
      v.src = base + u;
      v.load();
      return v;
    });

    // Страховка: не держим экран дольше 6 с
    const t = setTimeout(reveal, 6000);
    return () => { clearTimeout(t); videos.forEach((v) => { v.src = ""; }); };
  }, []);

  return (
    <>
      <div style={{ visibility: ready ? "visible" : "hidden" }}>{children}</div>
      {!ready && (
        <div className="fixed inset-0 z-[100] bg-[#0F1108] flex flex-col items-center justify-center gap-6">
          <img
            src={`${import.meta.env.BASE_URL}assets/cheese_logo.png`}
            alt=""
            className="w-16 h-16 object-contain animate-pulse"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div className="font-sans font-black uppercase tracking-[0.3em] text-sm text-[#D4DE72]">
            Агрохаб 2026
          </div>
          <div className="w-48 h-1 rounded-full bg-[#E8E6D9]/10 overflow-hidden">
            <div
              className="h-full bg-[#D4DE72] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
