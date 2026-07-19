import React, { useState, useEffect } from "react";
import { Series } from "../types";
import { SERIES_DATA } from "../data";
import { Play, Pause, Film, Monitor, Radio, CheckSquare, Terminal } from "lucide-react";

export default function RealityShow() {
  const [selectedSeries, setSelectedSeries] = useState<Series>(SERIES_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [progress, setProgress] = useState(25);

  // Rotate terminal logs inside the simulated viewport when "playing"
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setLogIndex((prev) => (prev + 1) % selectedSeries.logs.length);
        setProgress((prev) => {
          const next = prev + 1.5;
          return next > 100 ? 5 : next;
        });
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedSeries]);

  const handleSeriesSelect = (series: Series) => {
    setSelectedSeries(series);
    setLogIndex(0);
    setProgress(15 + Math.random() * 30);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* 1. Left: Cybernetic CCTV Player Screen (cols 1 to 7) */}
      <div className="lg:col-span-7 bg-[#0F1108]/95 border border-[#E8E6D9]/15 rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden shadow-[inset_0_0_40px_rgba(163,177,138,0.15)] min-h-[380px]">
        {/* Absolute CRT scanning line effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DAD7CD]/2 to-transparent pointer-events-none h-full w-full animate-pulse" />

        {/* Viewport Header */}
        <div className="flex items-center justify-between border-b border-[#E8E6D9]/10 pb-3 mb-4 font-mono text-[10px] text-[#A3B18A]">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-ping" />
            <span className="uppercase tracking-wider">CCTV.FEED // ИСТРИНСКАЯ_СЫРОВАРНЯ</span>
          </div>
          <div className="flex items-center gap-4">
            <span>RES: 1080P</span>
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-sm">
              LIVE BROADCAST
            </span>
          </div>
        </div>

        {/* Simulated Video Display Area */}
        <div className="flex-1 flex flex-col justify-center items-center bg-[#344E41]/10 rounded-2xl p-6 border border-[#E8E6D9]/5 relative">
          {/* Animated retro grid lines */}
          <div className="absolute inset-0 border border-dashed border-[#E8E6D9]/5 m-4 pointer-events-none" />

          {/* Central Play/Pause Action overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-[#E8E6D9] text-[#0F1108] flex items-center justify-center hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(232,230,217,0.3)] z-20 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Simulated Cyber-HUD logs running live! */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#0F1108]/90 border border-[#E8E6D9]/10 p-3 rounded-xl font-mono text-[9px] text-[#D4DE72] shadow-lg flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-[#A3B18A]" />
            <div className="flex-1 overflow-hidden truncate">
              {isPlaying ? (
                <span className="animate-pulse">{selectedSeries.logs[logIndex]}</span>
              ) : (
                <span className="text-[#E8E6D9]/40">// Нажмите Play, чтобы начать трансляцию серии</span>
              )}
            </div>
          </div>

          {/* Mini Tech HUD in center background */}
          <div className="absolute top-6 right-6 opacity-20 pointer-events-none font-mono text-[9px] text-right space-y-1">
            <p>CAM_NODE_04</p>
            <p>FPS: 60.00</p>
            <p>STREAMING: {isPlaying ? "OK" : "STANDBY"}</p>
          </div>
        </div>

        {/* Playback Controls Footer */}
        <div className="mt-4 pt-3 border-t border-[#E8E6D9]/10 flex justify-between items-center text-[10px] font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#E8E6D9]/40">Метраж:</span>
            <span className="text-[#E8E6D9]">{selectedSeries.duration}</span>
          </div>

          {/* Simulated progress bar */}
          <div className="flex-1 mx-6 bg-[#344E41]/30 h-1 rounded-full overflow-hidden relative">
            <div
              className="bg-[#A3B18A] h-full transition-all duration-1000"
              style={{ width: `${isPlaying ? progress : 25}%` }}
            />
          </div>

          <span className="text-[#A3B18A] uppercase tracking-wider text-[9px]">
            {selectedSeries.status}
          </span>
        </div>
      </div>

      {/* 2. Right: Episode Selector (cols 8 to 12) */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div className="space-y-4">
          <span className="text-[#A3B18A] font-mono text-[9px] uppercase tracking-[0.25em] block">
            Шоу изнутри / Реалити
          </span>
          <h3 className="font-serif italic text-3xl text-[#E8E6D9] leading-tight">
            Смотри жизнь лагеря каждый день
          </h3>
          <p className="text-xs text-[#E8E6D9]/70 leading-relaxed">
            Режиссерская группа АгроХаба превращает хакатон в полноценное интерактивное шоу. Выбери серию ниже, чтобы изучить краткое содержание и логи изнанки проекта.
          </p>

          {/* Series Lists Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 pt-2">
            {SERIES_DATA.map((item) => {
              const isActive = selectedSeries.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSeriesSelect(item)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "bg-[#344E41]/30 border-[#A3B18A] text-[#E8E6D9]"
                      : "bg-[#344E41]/10 border-[#E8E6D9]/10 hover:border-[#E8E6D9]/20 text-[#E8E6D9]/60"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-serif italic text-sm">{item.title}</span>
                    <Film className={`w-3.5 h-3.5 ${isActive ? "text-[#A3B18A]" : "text-[#E8E6D9]/20"}`} />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#A3B18A] block mt-1">
                    {item.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description card */}
        <div className="mt-6 bg-[#344E41]/20 border border-[#E8E6D9]/5 p-4 rounded-2xl">
          <h5 className="font-semibold text-xs text-[#E8E6D9] mb-1.5 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-[#A3B18A]" />
            Сюжет серии:
          </h5>
          <p className="text-xs text-[#E8E6D9]/70 leading-relaxed font-sans">
            {selectedSeries.description}
          </p>
        </div>
      </div>
    </div>
  );
}
