"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";

export default function ImageToBackground() {
  const [image, setImage] = useState<string | null>(null);
  const [resultTags, setResultTags] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // ฟังก์ชันย่อขนาดภาพก่อนส่ง เพื่อป้องกัน Error: Payload Too Large
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          // สร้าง Canvas เพื่อย่อขนาดภาพ
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // กำหนดขนาดสูงสุดที่ 800px
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // แปลงกลับเป็น Base64 แบบ JPEG พร้อมบีบอัดคุณภาพเหลือ 70%
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setImage(compressedBase64);
          setResultTags(""); // รีเซ็ตผลลัพธ์เก่าเมื่ออัปโหลดรูปใหม่
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      alert("⚠️ ไม่พบ API Key!");
      return;
    }

    setIsAnalyzing(true);
    setResultTags("");

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            // 🚀 ใช้โมเดล Qwen ตัวเดียวกับ Outfit
            model: "qwen/qwen3.6-27b",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    // 🚀 เปลี่ยน Prompt ให้เจาะจงเฉพาะฉากหลัง (Background & Environment)
                    text: `You are an expert Danbooru tagger specifically tailored for the SDXL Pony model. Analyze the background, environment, scenery, and lighting in this image.

CRITICAL RULES FOR PONY MODEL:
1. NO UNDERSCORES: You MUST use spaces instead of underscores (e.g., output "blue sky", NEVER "blue_sky").
2. MODULAR TAGS: Break complex scenes into simple, individual tags (e.g., "indoors", "classroom", "sunlight", "desk").
3. ENVIRONMENT & LIGHTING: Explicitly include time of day, weather, lighting types (e.g., cinematic lighting, neon lights, day, night, raining, depth of field) and specific architectural or natural elements.
4. ISOLATION: Focus ONLY on the background and environment. Do NOT describe any characters, people, clothing, or poses.

DO NOT output your thinking process. Return ONLY a flat, comma-separated list of lowercase tags. Do not include sentences, explanations, or bullet points.`,
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: image,
                    },
                  },
                ],
              },
            ],
            temperature: 0.2,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        let extractedTags = data.choices[0].message.content;

        // 🚀 1. หั่นเอากระบวนการคิด <think>...</think> ของ Qwen ทิ้งไป
        extractedTags = extractedTags
          .replace(/<think>[\s\S]*?<\/think>/gi, "")
          .trim();

        // 🚀 2. ถ้ามันดื้อพิมพ์ <think> มาแต่ลืมปิดแท็ก ให้เอาข้อความหลัง </think> (ถ้ามี)
        if (extractedTags.includes("</think>")) {
          extractedTags =
            extractedTags.split("</think>").pop() || extractedTags;
        }

        // 🚀 3. Failsafe: กรอง Underscore และการขึ้นบรรทัดใหม่ทิ้ง
        extractedTags = extractedTags.replace(/_/g, " ").replace(/\n/g, ", ");

        // 🚀 4. คลีนเครื่องหมายลูกน้ำที่อาจจะเบิ้ลกัน
        extractedTags = extractedTags
          .replace(/,\s*,/g, ",")
          .replace(/^,|,$/g, "")
          .trim();

        setResultTags(extractedTags);
      } else {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        alert(`⚠️ API Error: ${errorData.error?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Vision API Error:", error);
      alert("⚠️ เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต");
    }

    setIsAnalyzing(false);
  };

  const copyToClipboard = () => {
    if (!resultTags) return;
    navigator.clipboard.writeText(resultTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#130013] text-[#efbbff] pb-16 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-8 bg-[#2a002a] rounded-none border-2 border-[#be29ec] shadow-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#efbbff] border-b-2 border-[#be29ec] pb-2 uppercase tracking-wide">
          🖼️ Image to Background Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ฝั่งอัปโหลดรูป */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-[#d896ff] uppercase tracking-wider">
              1. Upload Reference Image
            </label>
            <div className="relative w-full h-80 border-2 border-dashed border-[#be29ec] bg-[#1a001a] flex justify-center items-center overflow-hidden hover:bg-[#2a002a] transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[#800080] font-bold uppercase tracking-widest text-center px-4">
                  Click or Drop Image Here
                </span>
              )}
            </div>

            <button
              onClick={analyzeImage}
              disabled={!image || isAnalyzing}
              className="w-full bg-[#be29ec] hover:bg-[#d896ff] text-[#130013] font-bold py-3 px-4 rounded-none border-2 border-[#d896ff] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {isAnalyzing ? "Analyzing Vision..." : "2. Analyze Background"}
            </button>
          </div>

          {/* ฝั่งแสดงผลลัพธ์ */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-[#130013] bg-[#be29ec] inline-block px-3 py-1 uppercase tracking-wider">
                Background Tags Output
              </label>
              <button
                onClick={copyToClipboard}
                disabled={!resultTags}
                className="text-xs font-bold text-[#efbbff] border border-[#be29ec] hover:bg-[#be29ec] hover:text-[#130013] px-3 py-1 transition uppercase disabled:opacity-50"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={resultTags}
              className="w-full h-83.75 p-4 rounded-none bg-[#1a001a] border-2 border-[#be29ec] text-sm font-mono text-[#efbbff] focus:outline-none focus:border-[#d896ff] resize-none leading-relaxed"
              placeholder="Your extracted background tags will appear here. Copy and paste them into the Prompt Generator..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
