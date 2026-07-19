import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, HelpCircle, CornerDownLeft } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export default function AiConsultant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: "Привет! Я АгроИИ Помощник — экспертный консультант агроинженерного лагеря АгроХаб. Расскажи мне о своих навыках или технологическом бэкграунде (например, знаешь ли ты Python, С++, нейросети или роботов), и я помогу выбрать идеальное направление на хакатоне!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMissingKey, setIsMissingKey] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "Я пишу на Python и хочу робособак 🐕",
    "Расскажи про трек 'ИИ и Нейросети' 🧠",
    "Какое железо будет на сыроварне? ⚙️",
    "Где жить и как кормят? 🏕️"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Map history to server schema
      const chatHistory = messages
        .filter((m) => !m.id.startsWith("welcome")) // ignore welcome message
        .map((m) => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, chatHistory })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка соединения с сервером.");
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        text: data.reply
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (data.isMissingKey) {
        setIsMissingKey(true);
      }
    } catch (err: any) {
      console.error(err);
      
      let errorText = "Ой, что-то пошло не так при запросе к ИИ. Попробуйте еще раз!";
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
        setIsMissingKey(true);
        errorText = "Для работы ИИ-консультанта требуется указать действительный API-ключ Gemini в панели Secrets (настройки AI Studio). Вы все равно можете подать обычную заявку!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          text: errorText
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="bg-[#0F1108]/90 border border-[#E8E6D9]/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col h-[520px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Laser header glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A3B18A] to-transparent animate-pulse" />

      {/* AI Header Card */}
      <div className="flex items-center justify-between border-b border-[#E8E6D9]/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#344E41]/50 border border-[#A3B18A]/30 flex items-center justify-center text-[#A3B18A]">
            <Sparkles className="w-4.5 h-4.5 animate-pulse text-[#D4DE72]" />
          </div>
          <div>
            <h4 className="font-serif italic text-lg text-[#DAD7CD] leading-none flex items-center gap-2">
              АгроИИ Помощник
            </h4>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#A3B18A] block mt-1">
              Модель: Gemini 3.5 Flash • Активен
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#E8E6D9]/40">
            AI CONSULTANT
          </span>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-[#344E41] scrollbar-track-transparent">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-[#DAD7CD] text-[#0F1108] rounded-br-none font-medium"
                  : "bg-[#344E41]/30 border border-[#E8E6D9]/5 text-[#E8E6D9]/90 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#344E41]/20 border border-[#E8E6D9]/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3B18A] animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3B18A] animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3B18A] animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="mt-4 pt-2 border-t border-[#E8E6D9]/5">
          <span className="text-[9px] uppercase tracking-wider text-[#E8E6D9]/40 font-mono flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Кликни для быстрого вопроса:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] text-[#A3B18A] bg-[#344E41]/20 hover:bg-[#344E41]/40 border border-[#E8E6D9]/5 hover:border-[#A3B18A]/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="mt-4 flex gap-2 border-t border-[#E8E6D9]/10 pt-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Спроси АгроИИ: 'Я знаю C++, куда пойти?'"
          className="flex-1 bg-[#0F1108] border border-[#E8E6D9]/10 rounded-xl px-4 py-3 text-xs text-[#E8E6D9] placeholder-[#E8E6D9]/30 focus:outline-none focus:border-[#A3B18A] transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#DAD7CD] hover:bg-white text-[#0F1108] disabled:bg-transparent disabled:border-[#E8E6D9]/10 disabled:text-[#E8E6D9]/30 border border-transparent rounded-xl px-4 flex items-center justify-center transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-[#0F1108] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
