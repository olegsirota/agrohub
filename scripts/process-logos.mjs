import { Jimp } from "jimp";
import path from "path";

const DL = "/Users/potato_girl/Downloads";
const OUT = path.resolve("public/assets");

// [source file, output name, target max width]
const jobs = [
  ["ChatGPT Image 19 июля 2026 г., 18_32_10.png", "logo.png", 480],
  ["images.jpeg", "rosagro.png", 420],       // Росагролизинг
  ["images-2.png", "minselkhoz.png", 420],   // жёлтый значок → Минсельхоз (по выбору пользователя)
  ["images-2.jpeg", "fermer.png", 420],      // Ассоциация «Народный фермер»
  ["images-3.png", "sirota.png", 460],       // Истринская сыроварня Олега Сироты
];

const WHITE = 240; // порог «белого» → прозрачный

for (const [src, out, maxW] of jobs) {
  const img = await Jimp.read(path.join(DL, src));

  // белый фон → прозрачный (с мягким краем для антиалиасинга)
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {
    const d = img.bitmap.data;
    const r = d[idx], g = d[idx + 1], b = d[idx + 2];
    const m = Math.min(r, g, b);
    if (m >= WHITE) {
      d[idx + 3] = 0; // полностью прозрачный
    } else if (m >= WHITE - 18) {
      // перо на границе: частичная прозрачность
      d[idx + 3] = Math.round(d[idx + 3] * (1 - (m - (WHITE - 18)) / 18));
    }
  });

  if (img.bitmap.width > maxW) img.resize({ w: maxW });

  await img.write(path.join(OUT, out));
  console.log(`✓ ${out}  (${img.bitmap.width}×${img.bitmap.height})  <- ${src}`);
}
console.log("done");
