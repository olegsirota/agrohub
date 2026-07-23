import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import PageHero from "../components/PageHero";
import { FAQ_DATA, CONTACTS, APPLY_FORM, TG_CHANNEL } from "../data";

const card = "bg-[#344E41]/15 border border-[#E8E6D9]/10 rounded-2xl";

const INFO = [
  {
    title: "Кто может участвовать",
    desc: "Студенты аграрных и технических вузов, молодые инженеры, IT-специалисты и робототехники со всей страны.",
  },
  {
    title: "Условия",
    desc: "Часть мест зарезервирована для команд от вузов-партнёров. Остальные условия объявляются под каждую смену.",
  },
  {
    title: "Что взять",
    desc: "Спальник, коврик, одежду для поля и ноутбук. Палатки, питание и оборудование предоставляет организатор.",
  },
];

export default function ApplyPage() {
  const [activeFaq, setActiveFaq] = useState<string | null>("faq-1");

  return (
    <>
      <PageHero
        eyebrow="Набор открыт · лето 2026"
        title="Подать заявку"
        subtitle="Заполни регистрационную форму, и мы свяжемся с тобой по деталям смены. Ниже собраны условия участия, контакты организаторов и ответы на частые вопросы."
      />

      <div className="px-6 md:px-12 lg:px-24 pb-24 bg-[#0F1108]/60">
        <div className="max-w-5xl mx-auto space-y-20 md:space-y-24">

          {/* Инфо об участии */}
          <section className="-mt-4 grid sm:grid-cols-3 gap-4">
            {INFO.map((x) => (
              <div key={x.title} className={`${card} p-6`}>
                <h3 className="font-sans font-bold uppercase text-base text-[#E8E6D9] mb-2">{x.title}</h3>
                <p className="text-sm text-[#E8E6D9]/70 leading-relaxed">{x.desc}</p>
              </div>
            ))}
          </section>

          {/* Форма регистрации */}
          <section>
            <h2 className="font-sans font-bold uppercase text-2xl md:text-4xl text-[#DAD7CD] mb-8">Регистрация</h2>
            <div className={`${card} p-2 md:p-4 overflow-hidden`}>
              <iframe
                src={APPLY_FORM}
                title="Форма регистрации"
                className="w-full h-[720px] rounded-xl bg-white"
                loading="lazy"
              />
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-4">
              <a href={APPLY_FORM} target="_blank" rel="noopener noreferrer" className="py-4 px-8 bg-[#E8E6D9] text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-white transition-all text-center">
                Открыть форму в новой вкладке
              </a>
              <a href={TG_CHANNEL} target="_blank" rel="noopener noreferrer" className="py-4 px-8 border border-[#E8E6D9]/30 hover:border-[#E8E6D9]/60 text-[#E8E6D9] font-semibold uppercase text-xs tracking-widest rounded-full transition-all text-center">
                Задать вопрос в Telegram
              </a>
            </div>
          </section>

          {/* Контакты */}
          <section>
            <h2 className="font-sans font-bold uppercase text-2xl md:text-4xl text-[#DAD7CD] mb-8">Контакты</h2>
            <div className={`${card} divide-y divide-[#E8E6D9]/10`}>
              {CONTACTS.map((c) => (
                <div key={c.role} className="p-5 md:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="font-sans font-bold uppercase text-[11px] tracking-widest text-[#A3B18A]">{c.role}</div>
                    <div className="text-sm text-[#E8E6D9] mt-0.5">{c.name}</div>
                  </div>
                  {c.phone && (
                    <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="font-sans font-semibold text-sm text-[#D4DE72] whitespace-nowrap hover:underline">
                      {c.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-sans font-bold uppercase text-2xl md:text-4xl text-[#DAD7CD] mb-8">Частые вопросы</h2>
            <div className="space-y-4">
              {FAQ_DATA.map((item) => {
                const isOpen = activeFaq === item.id;
                return (
                  <div key={item.id} className="bg-[#344E41]/10 border border-[#E8E6D9]/10 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : item.id)}
                      className="w-full p-5 text-left flex justify-between items-center hover:bg-[#344E41]/20 transition-all"
                    >
                      <span className="font-sans font-bold uppercase text-sm sm:text-base text-[#E8E6D9]">{item.question}</span>
                      <ChevronDown className={`w-4 h-4 text-[#A3B18A] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 border-t border-[#E8E6D9]/5 text-xs sm:text-sm text-[#E8E6D9]/75 leading-relaxed">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
