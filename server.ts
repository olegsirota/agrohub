import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Standard dotenv loading
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory submissions database with some seed data to make it look active!
interface Submission {
  id: string;
  name: string;
  role: string;
  track: string;
  timestamp: string;
}

const submissions: Submission[] = [
  {
    id: "seed-1",
    name: "Игорь К.",
    role: "Разработчик ИИ",
    track: "ИИ и Нейросети",
    timestamp: "2 мин. назад"
  },
  {
    id: "seed-2",
    name: "Дарья П.",
    role: "Инженер-робототехник",
    track: "Роботы и Манипуляторы",
    timestamp: "15 мин. назад"
  },
  {
    id: "seed-3",
    name: "Алексей М.",
    role: "Студент-агроном",
    track: "Робособаки (Unitree Go2)",
    timestamp: "1 час назад"
  }
];

// Lazy initialisation of the Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required to use AI features.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Get camp submissions
app.get("/api/submissions", (req, res) => {
  res.json(submissions);
});

// Submit a new registration
app.post("/api/submissions", (req, res) => {
  const { name, role, track } = req.body;
  if (!name || !role || !track) {
    res.status(400).json({ error: "Missing required fields: name, role, track" });
    return;
  }

  const newSubmission: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name,
    role,
    track,
    timestamp: "Только что"
  };

  submissions.unshift(newSubmission);
  res.status(201).json(newSubmission);
});

// AI Chat Consultant
app.post("/api/ai/consult", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const ai = getAiClient();
    
    const systemInstruction = `Ты — АгроИИ Помощник, интеллектуальный консультант летнего агроинженерного лагеря и хакатона "АгроХаб Олега Сироты" в Истре (Лето 2026).
Твоя цель — помочь абитуриенту определиться с направлением, вдохновить его и ответить на любые технические или организационные вопросы о лагере.

Краткая справка об АгроХабе для ответов:
1. Где проходит: Истринская сыроварня Олега Сироты (Московская область, Истра). Проживание в палаточном лагере, все удобства, питание и инженерное железо предоставляются.
2. Кто может поехать: Студенты технических и аграрных вузов, инженеры, IT-специалисты, робототехники.
3. Стоимость: Условия участия (гранты, взносы) объявляются в официальном Telegram-канале. Традиционно вузы-партнеры отправляют команды бесплатно.
4. Основные направления хакатона:
   - РОБОТЫ: Программирование манипуляторов для деликатного захвата яиц, сортировки овощей, автоматизации теплиц.
   - РОБОСОБАКИ: "Дрессировка" робособак Unitree Go2 для обхода полей, составления карт грядок, сбора телеметрии и патрулирования территории.
   - ИИ И НЕЙРОСЕТИ: Обучение компьютерного зрения для мгновенного распознавания видов зерна по фото без лабораторий.
5. Фишка лагеря: Настоящее реалити-шоу! Профессиональная съемочная группа снимает ежедневные выпуски-сериалы о жизни инженеров в коровнике, рассветах, ночных багах и защите проектов.

Отвечай вежливо, увлеченно, профессионально на русском языке. Будь краток и структурирован. Обязательно предлагай конкретное направление исходя из навыков собеседника (например, если он знает Python/ROS, советуй Робособак или Роботов; если знает PyTorch/TensorFlow — Нейросети). Помогай придумать крутую идею для проекта на сыроварне.`;

    // Map conversation history to Gemini contents structure
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "Извините, не удалось сформировать ответ.";
    res.json({ reply: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "Произошла ошибка при обращении к ИИ.",
      isMissingKey: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY"
    });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // In dev mode, we MUST have a catch-all route that serves index.html transformed by Vite!
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const fs = await import("fs");
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
