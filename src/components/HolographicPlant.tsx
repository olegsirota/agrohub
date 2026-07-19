import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, Sparkles, Activity, Cpu } from "lucide-react";

interface TelemetryMetric {
  label: string;
  value: string | number;
  unit?: string;
  status?: "normal" | "warning" | "optimal";
}

export default function HolographicPlant() {
  const [stage, setStage] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [isWatering, setIsWatering] = useState(false);

  const TOTAL_STAGES = 5;

  const handleGrow = () => {
    if (isWatering || stage >= TOTAL_STAGES) return;

    setIsWatering(true);

    // After water droplet animation completes, advance growth
    setTimeout(() => {
      setClicks((prev) => prev + 1);
      setStage((prev) => Math.min(prev + 1, TOTAL_STAGES));
      setIsWatering(false);
    }, 1000);
  };

  const handleReset = () => {
    setStage(1);
    setClicks(0);
  };

  // Stage details
  const stageNames = [
    "Инициализация ядра (Seed Initialization)",
    "Калибровка ростка (Laser Sprout)",
    "Ускорение стебля (Stem Acceleration)",
    "Формирование завязи (Ear Calibration)",
    "Спелый золотой колос (Full Harvest Yield)"
  ];

  // Dynamic telemetry based on stage
  const getTelemetry = (): TelemetryMetric[] => {
    switch (stage) {
      case 1:
        return [
          { label: "Высота", value: "0", unit: "см" },
          { label: "Поглощение влаги", value: "12", unit: "%", status: "warning" },
          { label: "Биостабильность", value: "99.8", unit: "%", status: "optimal" },
          { label: "Активные сенсоры", value: "2", unit: "ед." }
        ];
      case 2:
        return [
          { label: "Высота", value: "12", unit: "см" },
          { label: "Поглощение влаги", value: "45", unit: "%" },
          { label: "Биостабильность", value: "97.2", unit: "%", status: "optimal" },
          { label: "Активные сенсоры", value: "6", unit: "ед." }
        ];
      case 3:
        return [
          { label: "Высота", value: "48", unit: "см" },
          { label: "Поглощение влаги", value: "78", unit: "%", status: "optimal" },
          { label: "Биостабильность", value: "95.1", unit: "%" },
          { label: "Активные сенсоры", value: "14", unit: "ед." }
        ];
      case 4:
        return [
          { label: "Высота", value: "95", unit: "см" },
          { label: "Поглощение влаги", value: "92", unit: "%", status: "optimal" },
          { label: "Биостабильность", value: "96.4", unit: "%", status: "optimal" },
          { label: "Активные сенсоры", value: "24", unit: "ед." }
        ];
      case 5:
      default:
        return [
          { label: "Высота", value: "145", unit: "см" },
          { label: "Поглощение влаги", value: "98", unit: "%", status: "optimal" },
          { label: "Биостабильность", value: "99.2", unit: "%", status: "optimal" },
          { label: "Итоговый выход (Yield)", value: "98.7", unit: "%", status: "optimal" }
        ];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#344E41]/10 p-6 md:p-8 rounded-3xl border border-[#E8E6D9]/10 relative overflow-hidden backdrop-blur-sm">
      {/* Absolute pulsing background glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#A3B18A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#344E41]/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Procedural Plant SVG Canvas (cols 1 to 7) */}
      <div className="col-span-1 md:col-span-7 flex flex-col items-center justify-center bg-[#0F1108]/40 border border-[#E8E6D9]/5 rounded-2xl p-6 relative min-h-[420px] aspect-[4/3] md:aspect-auto">
        {/* Stage HUD label */}
        <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#A3B18A] bg-[#344E41]/20 px-3 py-1.5 rounded-full border border-[#E8E6D9]/10">
          <Activity className="w-3 h-3 animate-pulse text-[#D4DE72]" />
          <span>Сцена {stage} / {TOTAL_STAGES}</span>
        </div>

        {/* Dynamic drop-icon-hide-box simulator on top */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          {/* Water droplet animation */}
          <AnimatePresence>
            {isWatering && (
              <motion.div
                initial={{ y: -20, opacity: 0, scale: 0.5 }}
                animate={{ y: 220, opacity: [0, 1, 1, 0], scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "cubic-bezier(0.55, 0.085, 0.68, 0.53)" }}
                className="w-3 h-5 rounded-full bg-cyan-400 blur-[0.5px] border border-cyan-200 shadow-[0_0_10px_#22d3ee]"
              />
            )}
          </AnimatePresence>
        </div>

        {/* The plant SVG itself */}
        <div className="w-full max-w-[280px] h-[320px] flex items-end justify-center relative">
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(163,177,138,0.2)]"
          >
            {/* Grid background lines */}
            <line x1="100" y1="0" x2="100" y2="240" stroke="rgba(232,230,217,0.04)" strokeDasharray="4 4" />
            <line x1="0" y1="220" x2="200" y2="220" stroke="rgba(232,230,217,0.06)" />
            <circle cx="100" cy="220" r="12" fill="none" stroke="rgba(232,230,217,0.1)" strokeDasharray="2 2" />

            {/* Base Bio-Reactor Seed Shell (always visible) */}
            <g transform="translate(100, 220)">
              <circle cx="0" cy="0" r="10" fill="#0F1108" stroke="#DAD7CD" strokeWidth="1" />
              <circle cx="0" cy="0" r="6" fill="#344E41" className="animate-pulse" />
              {/* Spinning telemetry ring */}
              <motion.circle
                cx="0"
                cy="0"
                r="15"
                fill="none"
                stroke="#A3B18A"
                strokeWidth="0.5"
                strokeDasharray="4 12"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
            </g>

            {/* STAGE 2+: Stem Growth */}
            {stage >= 2 && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                d="M 100 220 Q 105 170 100 130"
                fill="none"
                stroke="#A3B18A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )}

            {/* STAGE 3+: Branching structure */}
            {stage >= 3 && (
              <>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  d="M 102 180 Q 80 160 70 150"
                  fill="none"
                  stroke="#588157"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  d="M 101 155 Q 120 140 128 132"
                  fill="none"
                  stroke="#588157"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Leaf Node left */}
                <motion.path
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  d="M 70 150 C 65 140, 75 135, 70 150"
                  fill="#D4DE72"
                  className="origin-bottom-right"
                />
              </>
            )}

            {/* STAGE 4+: Bud Calibration or Upper stem */}
            {stage >= 4 && (
              <>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  d="M 100 130 Q 95 90 100 65"
                  fill="none"
                  stroke="#A3B18A"
                  strokeWidth="2.5"
                />

                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  d="M 98 100 Q 115 85 122 75"
                  fill="none"
                  stroke="#588157"
                  strokeWidth="2"
                />

                {/* Cyber-scanning lasers */}
                <motion.line
                  x1="50"
                  y1="75"
                  x2="150"
                  y2="75"
                  stroke="rgba(212, 222, 114, 0.3)"
                  strokeWidth="1"
                  animate={{ y: [60, 110, 60] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
              </>
            )}

            {/* STAGE 5: Golden Harvest (Wheat Ear) */}
            {stage >= 5 && (
              <g transform="translate(100, 65)">
                {/* Golden glowing wheat head ears */}
                {/* Center head */}
                <motion.path
                  initial={{ scale: 0, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  d="M 0 -5 C -10 -15, 0 -35, 0 -35 C 0 -35, 10 -15, 0 -5"
                  fill="#D4DE72"
                  className="shadow-glow"
                />
                
                {/* Left side ears */}
                {[-10, -22, -32].map((yOffset, i) => (
                  <motion.path
                    key={`left-ear-${i}`}
                    initial={{ scale: 0, x: 5 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    d={`M -2 ${yOffset} C -12 ${yOffset - 10}, -15 ${yOffset - 2}, -5 ${yOffset + 2}`}
                    fill="#DAD7CD"
                  />
                ))}

                {/* Right side ears */}
                {[-10, -22, -32].map((yOffset, i) => (
                  <motion.path
                    key={`right-ear-${i}`}
                    initial={{ scale: 0, x: -5 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.12 * i }}
                    d={`M 2 ${yOffset} C 12 ${yOffset - 10}, 15 ${yOffset - 2}, 5 ${yOffset + 2}`}
                    fill="#D4DE72"
                  />
                ))}

                {/* Glowing bio-particle emitters */}
                <motion.circle
                  cx="0"
                  cy="-42"
                  r="3"
                  fill="#D4DE72"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <motion.circle
                  cx="-15"
                  cy="-25"
                  r="1.5"
                  fill="#DAD7CD"
                  animate={{ opacity: [0.1, 0.8, 0.1], y: [-25, -35] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                />
                <motion.circle
                  cx="15"
                  cy="-20"
                  r="2"
                  fill="#D4DE72"
                  animate={{ opacity: [0.1, 0.9, 0.1], y: [-20, -32] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }}
                />
              </g>
            )}
          </svg>
        </div>

        {/* Results notice for the final stage */}
        <AnimatePresence>
          {stage === TOTAL_STAGES && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-[#D4DE72]/10 border border-[#D4DE72]/30 px-4 py-2.5 rounded-xl text-center backdrop-blur-md"
            >
              <p className="font-serif italic text-xs text-[#D4DE72] tracking-wider flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Новый результат достигнут: Now you can see the results!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Control Panel & Telemetry (cols 8 to 12) */}
      <div className="col-span-1 md:col-span-5 flex flex-col justify-between h-full gap-6">
        <div>
          <span className="text-[#A3B18A] font-mono text-[9px] uppercase tracking-[0.25em] block mb-2">
            Агроинженерия / Симулятор
          </span>
          <h3 className="font-serif italic text-2xl text-[#E8E6D9] leading-tight mb-4">
            Взрасти урожай своими алгоритмами
          </h3>
          <p className="text-xs text-[#E8E6D9]/70 leading-relaxed mb-6">
            Этот интерактивный симулятор демонстрирует философию лагеря АгроХаб: точный цифровой уход порождает превосходный физический результат. Жми на кнопку запуска ресурсов для ускорения роста.
          </p>

          {/* Core metrics panel */}
          <div className="space-y-3 bg-[#0F1108]/30 p-4 rounded-2xl border border-[#E8E6D9]/10">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E8E6D9]/10">
              <Sliders className="w-4 h-4 text-[#A3B18A]" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#DAD7CD]">
                Телеметрия ростка
              </span>
            </div>

            <div className="space-y-2">
              {getTelemetry().map((metric, i) => (
                <div
                  key={metric.label}
                  className="flex justify-between items-center text-xs py-1 border-b border-[#E8E6D9]/5 last:border-0"
                >
                  <span className="text-[#E8E6D9]/50">{metric.label}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[#E8E6D9] font-medium">{metric.value}</span>
                    {metric.unit && <span className="text-[10px] text-[#A3B18A]">{metric.unit}</span>}
                    {metric.status === "optimal" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth control buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#E8E6D9]/40 px-1">
            <span>Питание ядра: {clicks * 25}%</span>
            <span>Статус: {stage === TOTAL_STAGES ? "Завершено" : "Рост..."}</span>
          </div>
          
          <button
            onClick={handleGrow}
            disabled={isWatering || stage >= TOTAL_STAGES}
            className={`w-full py-4 rounded-full font-sans font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 border ${
              stage >= TOTAL_STAGES
                ? "bg-transparent border-[#E8E6D9]/10 text-[#E8E6D9]/30 cursor-not-allowed"
                : isWatering
                ? "bg-[#344E41]/30 border-[#A3B18A]/30 text-[#A3B18A] cursor-wait"
                : "bg-[#E8E6D9] border-[#E8E6D9] text-[#0F1108] hover:bg-white hover:border-white shadow-[0_4px_20px_rgba(232,230,217,0.1)] active:scale-[0.98]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isWatering ? "1.5s" : "0s" }} />
            {stage === TOTAL_STAGES
              ? "Урожай собран!"
              : isWatering
              ? "Подача питательных веществ..."
              : "Полить и вырастить колос"}
          </button>

          {stage === TOTAL_STAGES && (
            <button
              onClick={handleReset}
              className="w-full py-2 bg-transparent border border-[#E8E6D9]/10 text-[#E8E6D9]/60 hover:text-[#E8E6D9] hover:border-[#E8E6D9]/30 rounded-full text-[10px] uppercase tracking-widest font-mono transition-colors"
            >
              Сбросить цикл
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
