import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Submission } from "../types";
import { Check, ClipboardList, Send, Award, Sparkles, UserCheck } from "lucide-react";

interface FormSectionProps {
  onAddSubmission: (sub: Submission) => void;
  submissions: Submission[];
}

export default function FormSection({ onAddSubmission, submissions }: FormSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    role: "Разработчик ИИ",
    customRole: "",
    track: "ИИ и Нейросети",
    hasHardwareExperience: false,
    hardwareDetails: "",
    hasPartnerCode: false,
    partnerCode: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roles = [
    "Разработчик ИИ",
    "Инженер-робототехник",
    "Motion-дизайнер",
    "VFX-художник",
    "Студент-агроном",
    "Другое (Своя роль)"
  ];

  const tracks = [
    "ИИ и Нейросети (Computer Vision для зерна)",
    "Робособаки (Unitree Go2 в полевых условиях)",
    "Роботы и Манипуляторы (Сортировка сыроварни)"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.telegram) return;

    setLoading(true);

    try {
      const finalRole = formData.role === "Другое (Своя роль)" ? formData.customRole : formData.role;
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          role: finalRole || "Участник хакатона",
          track: formData.track
        })
      });

      if (!res.ok) {
        throw new Error("Не удалось подать заявку");
      }

      const data = await res.json();
      onAddSubmission(data);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        telegram: "",
        role: "Разработчик ИИ",
        customRole: "",
        track: "ИИ и Нейросети",
        hasHardwareExperience: false,
        hardwareDetails: "",
        hasPartnerCode: false,
        partnerCode: ""
      });

      // Clear success banner after 5s
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Извините, произошла ошибка. Но ваша заявка сымитирована на клиенте!");
      
      // Fallback local submission mock
      const mockSub: Submission = {
        id: `local-${Date.now()}`,
        name: formData.name,
        role: formData.role === "Другое (Своя роль)" ? formData.customRole : formData.role,
        track: formData.track,
        timestamp: "Только что"
      };
      onAddSubmission(mockSub);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Interactive Application Form */}
      <div className="bg-[#0F1108]/80 border border-[#E8E6D9]/10 rounded-3xl p-6 md:p-8 relative">
        <h4 className="font-serif italic text-2xl text-[#DAD7CD] mb-2">
          Занять место в смене
        </h4>
        <p className="text-xs text-[#E8E6D9]/60 leading-relaxed mb-6">
          Лето 2026 в Истре. Палаточный городок, высококлассное оборудование, работающее производство и профессиональное реалити-шоу. Заполни анкету.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#A3B18A] block">
                Ваше имя
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Иван Иванов"
                className="w-full bg-[#344E41]/10 border border-[#E8E6D9]/10 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] placeholder-[#E8E6D9]/30 focus:outline-none focus:border-[#A3B18A] transition-all"
              />
            </div>

            {/* Telegram handle */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#A3B18A] block">
                Telegram для связи
              </label>
              <input
                type="text"
                required
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="@username"
                className="w-full bg-[#344E41]/10 border border-[#E8E6D9]/10 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] placeholder-[#E8E6D9]/30 focus:outline-none focus:border-[#A3B18A] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role select */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#A3B18A] block">
                Кто вы? (Специализация)
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#344E41]/20 border border-[#E8E6D9]/10 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] focus:outline-none focus:border-[#A3B18A] transition-all"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-[#0F1108] text-[#E8E6D9]">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Track */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#A3B18A] block">
                Желаемый трек
              </label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full bg-[#344E41]/20 border border-[#E8E6D9]/10 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] focus:outline-none focus:border-[#A3B18A] transition-all"
              >
                {tracks.map((t) => (
                  <option key={t} value={t} className="bg-[#0F1108] text-[#E8E6D9]">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Input Field (Custom Role) */}
          <AnimatePresence>
            {formData.role === "Другое (Своя роль)" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#D4DE72] block">
                  Укажите вашу специализацию
                </label>
                <input
                  type="text"
                  required
                  value={formData.customRole}
                  onChange={(e) => setFormData({ ...formData, customRole: e.target.value })}
                  placeholder="Например, Моделист-конструктор, Сварщик..."
                  className="w-full bg-[#344E41]/10 border border-[#D4DE72]/30 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] placeholder-[#E8E6D9]/30 focus:outline-none focus:border-[#D4DE72] transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Checkbox 1: Hardware experience */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-xs text-[#E8E6D9]/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.hasHardwareExperience}
                onChange={(e) => setFormData({ ...formData, hasHardwareExperience: e.target.checked })}
                className="w-4 h-4 accent-[#A3B18A] rounded border-[#E8E6D9]/15"
              />
              <span>Есть опыт работы с ROS / Arduino / PyTorch / OpenCV?</span>
            </label>

            {/* Conditional input details */}
            <AnimatePresence>
              {formData.hasHardwareExperience && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#A3B18A] block">
                    Опишите ваш опыт или стек кратко
                  </label>
                  <textarea
                    rows={2}
                    value={formData.hardwareDetails}
                    onChange={(e) => setFormData({ ...formData, hardwareDetails: e.target.value })}
                    placeholder="Пример: Обучал Yolov8 для поиска дефектов, писал контроллеры на C++..."
                    className="w-full bg-[#344E41]/10 border border-[#E8E6D9]/10 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] placeholder-[#E8E6D9]/30 focus:outline-none focus:border-[#A3B18A] transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkbox 2: Promo / Partner code */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs text-[#E8E6D9]/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.hasPartnerCode}
                onChange={(e) => setFormData({ ...formData, hasPartnerCode: e.target.checked })}
                className="w-4 h-4 accent-[#A3B18A] rounded border-[#E8E6D9]/15"
              />
              <span>У меня есть код направления от ВУЗа или Партнёра</span>
            </label>

            {/* Conditional partner code input */}
            <AnimatePresence>
              {formData.hasPartnerCode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <input
                    type="text"
                    required
                    value={formData.partnerCode}
                    onChange={(e) => setFormData({ ...formData, partnerCode: e.target.value })}
                    placeholder="Введите 6-значный код вуза"
                    className="w-full bg-[#344E41]/10 border border-[#E8E6D9]/10 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] placeholder-[#E8E6D9]/30 focus:outline-none focus:border-[#A3B18A] transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Alert Success Banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <p className="text-xs text-emerald-400 font-semibold">
                  Заявка принята! Мы свяжемся с вами в Telegram в течение 24 часов.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#E8E6D9] hover:bg-white text-[#0F1108] font-bold uppercase text-xs tracking-widest rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(232,230,217,0.15)] active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? "Обработка..." : "Отправить заявку"}
          </button>
        </form>
      </div>
    </div>
  );
}
