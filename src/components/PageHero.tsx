import React from "react";
import { motion } from "motion/react";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative pt-36 md:pt-44 pb-12 md:pb-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#1B3022]/72 to-[#0F1108]/72 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {eyebrow && (
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.25em] text-[#A3B18A] mb-4">
            {eyebrow}
          </p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-sans font-black uppercase text-4xl sm:text-6xl md:text-[72px] tracking-tighter leading-[0.85] text-[#E8E6D9]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-sm sm:text-base text-[#E8E6D9]/80 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
