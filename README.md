# 🎨 2D Anime Prompt Generator (AI MEGA PACK)

Web Application สำหรับสายเจนรูป AI 2D Anime (Stable Diffusion / ComfyUI / WebUI) ที่ออกแบบมาเพื่อทุ่นแรงในการเขียน Prompt ยาวๆ โดยเฉพาะ โปรเจคนี้ขับเคลื่อนด้วย **Groq API** ที่ประมวลผลได้อย่างรวดเร็ว ช่วยแปลและขยายความข้อความสั้นๆ (รองรับภาษาไทย) ให้กลายเป็น Danbooru Tags แบบจัดเต็ม และมีระบบ Vision AI สำหรับแกะดีเทลชุดจากภาพเรฟเฟอเรนซ์

## ✨ Features

- **🪄 Smart Prompt Expansion:** พิมพ์ไอเดียชุดหรือฉากหลังสั้นๆ (ภาษาไทยหรืออังกฤษก็ได้) AI จะช่วยขยายความให้เป็น Prompt แบบละเอียด (Layers, Materials, Lighting)
- **📸 Image to Outfit (Vision AI):** อัปโหลดรูปภาพเรฟเฟอเรนซ์ เพื่อให้ Vision Model แกะแท็กรายละเอียดเสื้อผ้าออกมาให้โดยอัตโนมัติ
- **⚙️ SDXL / Pony Optimized:** 
  - จัดเรียงโครงสร้าง Positive Prompt ให้เหมาะสมกับโมเดลสาย Pony
  - Negative Prompt แบบพิเศษที่ช่วยดักทาง อนาโตมี่เพี้ยน และ ป้องกันตัวละครงอก (Multiple girls/clones)
- **📋 One-Click Copy:** ปุ่มคัดลอก Prompt พร้อมนำไปวางใน UI ได้ทันที
- **📖 Built-in Settings Guide:** แนะนำการตั้งค่า Resolution, Sampler และ Steps ที่เหมาะสมไว้ท้ายเว็บ

## 🛠️ Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** TypeScript
- **AI Integration:** [Groq API](https://groq.com/) (Llama-3.1-8b-instant & Llama Vision Models)

## 🚀 Getting Started (วิธีรันโปรเจค)

**1. Clone the repository & Install dependencies:**
\`\`\`bash
git clone https://github.com/yourusername/sd-prompt-gen.git
cd sd-prompt-gen
npm install
\`\`\`

**2. ตั้งค่า Environment Variables:**
สร้างไฟล์ชื่อ \`.env.local\` ไว้ที่โฟลเดอร์นอกสุดของโปรเจค และใส่ API Key ของ Groq ลงไป (สมัครฟรีได้ที่ [GroqCloud](https://console.groq.com/keys))

\`\`\`env
NEXT_PUBLIC_GROQ_API_KEY=gsk_your_api_key_here
\`\`\`

**3. รัน Development Server:**
\`\`\`bash
npm run dev
\`\`\`
เปิดเบราว์เซอร์และเข้าไปที่ [http://localhost:3000](http://localhost:3000) เพื่อใช้งาน

## ⚠️ Notes for Vision Model
เนี่องจาก Groq มีการอัปเดตโมเดล Vision อยู่บ่อยครั้ง หากฟีเจอร์ **Image to Outfit** ทำงานไม่ถูกต้อง (แจ้งเตือน Model decommissioned) สามารถเข้าไปเช็ค Model ID ล่าสุดได้ที่ [Groq Supported Models](https://console.groq.com/docs/models) และนำมาอัปเดตในไฟล์ \`src/app/image-to-prompt/page.tsx\`

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).