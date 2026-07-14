"use client";

import { useState, ChangeEvent } from "react";
import { Open_Sans } from "next/font/google";
import Navbar from "../../components/Navbar";
import Image from "next/image"; // 🚀 นำเข้า Image component ของ Next.js

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export default function ImageToBackground() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultTags, setResultTags] = useState("");
  const [copied, setCopied] = useState(false);

  const theme = {
    bgApp: "bg-[#130013]",
    bgCard: "bg-[#2a002a]",
    borderMain: "border-[#be29ec]",
    borderDim: "border-[#800080]",
    textMain: "text-[#efbbff]",
    textMuted: "text-[#d896ff]",
    bgInput: "bg-[#1a001a]",
    accent: "bg-[#be29ec]",
    accentHover: "hover:bg-[#d896ff]",
    textDark: "text-[#130013]",
    glow: "shadow-2xl",
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultTags("");
    }
  };

  // 🚀 ย่อรูปและบีบอัดให้ไม่เกิน 512px ก่อนส่ง เพื่อแก้ปัญหา Payload Too Large
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        // ใช้ window.Image เพื่อไม่ให้ชนกับ Component Image ของ Next.js
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const MAX_DIMENSION = 512; // 🚀 จำกัดขนาดไว้ที่ 512px

          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // แปลงกลับเป็น Base64 แบบ JPEG Quality 70% ให้เบาที่สุด
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const extractBackground = async () => {
    if (!imageFile) {
      alert("กรุณาอัปโหลดรูปภาพก่อนครับ!");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      alert("⚠️ ไม่พบ API Key!");
      return;
    }

    setIsGenerating(true);

    try {
      const base64Image = await convertToBase64(imageFile);

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct", // ✅ ใช้โมเดล Vision ตัวใหม่ล่าสุดที่ Groq แนะนำ
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `You are an expert Stable Diffusion prompt engineer specializing in environmental and background Danbooru tags.
Your ONLY task is to analyze the uploaded image and extract the background, environment, lighting, and atmosphere tags.

CRITICAL RULES:
1. IGNORE all characters, people, clothing, poses, and anatomy. Focus STRICTLY on the world around them.
2. Output ONLY a flat, comma-separated string of Danbooru tags. DO NOT write sentences or any introductory text.
3. Categorize your extraction mentally into: Location, Lighting & Time, Objects & Architecture, and Atmosphere/Camera.

Example valid output: outdoors, night, cyberpunk city, neon lights, raining, wet street, reflections, blurry background, bokeh`,
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: base64Image,
                    },
                  },
                ],
              },
            ],
            temperature: 0.2,
            max_tokens: 1024, // 🚀 เพิ่มลิมิตข้อความตอบกลับ
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        const extracted = data.choices[0].message.content.trim();
        const cleanTags = extracted
          .replace(/^Here are the tags:|^Tags:/gi, "")
          .trim();
        setResultTags(cleanTags);
      } else {
        // 🚀 ดักจับ Error ให้อ่านเป็น Text ก่อน จะได้รู้ว่าเกิดอะไรขึ้น
        const errorText = await res.text();
        console.error("🔥 Raw API Error:", errorText);

        try {
          const errObj = JSON.parse(errorText);
          alert(
            `API Error: ${errObj.error?.message || "ดูรายละเอียดใน Console"}`,
          );
        } catch {
          alert(`เกิดข้อผิดพลาดรหัส ${res.status} ลองเช็ค Console (F12) ครับ`);
        }
      }
    } catch (error) {
      console.error("Error generating background tags:", error);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลครับ");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!resultTags) return;
    navigator.clipboard.writeText(resultTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`min-h-screen ${theme.bgApp} transition-colors duration-500 text-[#efbbff] ${openSans.className} pb-16`}
    >
      <Navbar isNsfw={false} />

      <div
        className={`max-w-4xl mx-auto mt-8 ${theme.bgCard} rounded-none border-2 ${theme.borderMain} ${theme.glow} p-6`}
      >
        <div className={`mb-6 border-b-2 ${theme.borderMain} pb-4`}>
          <h1
            className={`text-2xl font-bold ${theme.textMain} uppercase tracking-wide flex items-center`}
          >
            📸 Image to Background Tags
          </h1>
          <p className={`text-sm ${theme.textMuted} mt-2`}>
            อัปโหลดภาพที่มีฉากหลังสวยๆ แล้วให้ AI ดึงเฉพาะแสง เงา
            และบรรยากาศออกมาเป็น Prompt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col">
            <label
              className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider`}
            >
              Upload Reference Image
            </label>
            <div
              className={`relative w-full h-80 border-2 border-dashed ${theme.borderDim} ${theme.bgInput} flex items-center justify-center overflow-hidden hover:${theme.borderMain} transition-colors`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {previewUrl ? (
                // 🚀 อัปเกรดมาใช้ Image Component ของ Next.js แทน <img> ธรรมดา
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="text-center p-4">
                  <span className="text-4xl mb-2 block">🖼️</span>
                  <span
                    className={`${theme.textMuted} text-sm font-bold uppercase`}
                  >
                    Click or Drag Image Here
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex-1 flex flex-col mb-4">
              <div className="flex justify-between items-end mb-2">
                <label
                  className={`text-sm font-bold ${theme.textDark} ${theme.accent} inline-block px-3 py-1 uppercase tracking-wider`}
                >
                  Background Tags
                </label>
                <button
                  onClick={copyToClipboard}
                  disabled={!resultTags}
                  className={`text-xs font-bold ${theme.textMain} border ${theme.borderMain} ${theme.accentHover} hover:${theme.textDark} px-3 py-1 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <textarea
                readOnly
                value={resultTags}
                placeholder="Background tags will appear here..."
                className={`w-full flex-1 p-4 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} text-sm font-mono ${theme.textMain} focus:outline-none resize-none leading-relaxed min-h-40`}
              />
            </div>

            <button
              onClick={extractBackground}
              disabled={!imageFile || isGenerating}
              className={`w-full font-bold py-3 px-4 rounded-none border-2 transition-all duration-300 uppercase tracking-widest flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed ${
                isGenerating
                  ? `${theme.bgInput} ${theme.textMain} border-dashed ${theme.borderDim}`
                  : `${theme.accent} ${theme.accentHover} ${theme.textDark} border-transparent hover:${theme.borderMain}`
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2 animate-pulse">
                  ⏳ Extracting Environment...
                </span>
              ) : (
                "Extract Background"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
