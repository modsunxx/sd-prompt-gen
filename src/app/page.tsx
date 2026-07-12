"use client";

import { useState, ChangeEvent } from "react";
import { Open_Sans } from "next/font/google";
import Navbar from "../components/Navbar"; // นำเข้า Navbar ที่เราเพิ่งสร้าง

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

type Option = {
  id: string;
  label: string;
  lora: string;
  tags: string;
};

export default function PromptGenerator() {
  const [selections, setSelections] = useState({
    character: "",
    outfit: "",
    background: "",
  });

  const [prompts, setPrompts] = useState({
    positive: "",
    negative: "",
  });

  const [copiedPositive, setCopiedPositive] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const characterOptions: Option[] = [
    {
      id: "ada",
      label: "Ada Wong",
      lora: "<lora:Ada_Wong_pony:0.88>",
      tags: "ada wong, 1girl, solo, beautiful detailed face, short black hair",
    },
    {
      id: "feixiao",
      label: "Feixiao",
      lora: "<lora:feixiao_pony:0.88>",
      tags: "feixiao, 1girl, solo, beautiful detailed face, white hair, animal ears",
    },
    {
      id: "kafka",
      label: "Kafka",
      lora: "<lora:kafka_pony:0.88>",
      tags: "kafka (honkai: star rail), 1girl, solo, beautiful detailed face, purple hair, sunglasses on head",
    },
    {
      id: "raiden",
      label: "Raiden Shogun",
      lora: "<lora:raiden_shogun_pony:0.88>",
      tags: "raiden shogun, 1girl, solo, beautiful detailed face, purple hair, long braided hair",
    },
    {
      id: "yae",
      label: "Yae Miko",
      lora: "<lora:yae_miko_pony:0.88>",
      tags: "yae miko, 1girl, solo, beautiful detailed face, pink hair, fox ears",
    },
    {
      id: "yaoguang",
      label: "Yaoguang",
      lora: "<lora:yaoguang_pony:0.88>",
      tags: "yaoguang, 1girl, solo, beautiful detailed face, long hair, white hair",
    },
  ];

  const baseNegative = `score_6, score_5, score_4, worst quality, low quality, normal quality, 
(bad anatomy, worst anatomy, deformed, distorted, disfigured:1.2), 
(extra limbs, missing limbs, extra digits, mutated hands, fused fingers:1.2), 
poorly drawn face, bad proportions, bad perspective, 
multiple girls, multiple boys, group, crowd, 2girls, 3girls, clones, extra characters, background characters, 
text, watermark, logo, username, signature, 
lowres, jpeg artifacts, compression artifacts, 
oversaturated, underexposed, source_pony, source_furry, source_cartoon`;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSelections((prev) => ({ ...prev, [name]: value }));
  };

  const generatePrompt = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      alert(
        "⚠️ ไม่พบ API Key!\nกรุณาตรวจสอบไฟล์ .env.local ว่ามี NEXT_PUBLIC_GROQ_API_KEY หรือไม่",
      );
      return;
    }

    setIsGenerating(true);

    const foundChar = characterOptions.find(
      (c) => c.id === selections.character,
    );
    const loraTag = foundChar ? foundChar.lora : "";
    const charTags = foundChar ? foundChar.tags : "";

    let expandedOutfit = "detailed clothes";
    let expandedBg = "simple background";
    let generatedPoses = "dynamic pose, looking at viewer";
    let generatedMood = "(confident:1.1)";

    let isApiSuccess = false;

    if (selections.outfit || selections.background) {
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
              model: "llama-3.1-8b-instant",
              response_format: { type: "json_object" },
              messages: [
                {
                  role: "system",
                  content: `You are a Master Stable Diffusion Prompt Engineer. 
TRANSLATE ALL INPUTS TO ENGLISH ACCURATELY. DO NOT OUTPUT ANY THAI CHARACTERS.
CRITICAL RULE: You MUST strictly keep the exact clothing items the user asks for. If the user inputs "กางเกง" (pants, trousers, jeans), you MUST output pants/trousers, NEVER change it to a skirt. Do not alter the core garment types provided by the user.
The user will give you a short description of an Outfit and/or Background.
Your MUST deeply EXPAND these descriptions into highly detailed Danbooru-style tags in English.
- For outfit: strictly use the user's garments, describe layers, materials, styles.
- For poses & mood: generate 5-8 related poses/camera angles and 4-6 personality/mood tags based on the outfit style.
- For background: describe lighting, atmosphere, and specific surrounding objects.
Return ONLY a valid JSON object containing exactly 4 keys: "outfit", "poses", "mood", "background".`,
                },
                {
                  role: "user",
                  content: `Outfit: ใส่ชุด office เสื้อเชิ้ตขาว กางเกง latex สีดำ\nBackground: office เเสงไปทางเเนวแบบ cyberpunk`,
                },
                {
                  role: "assistant",
                  content: `{"outfit": "white office dress shirt, collared white shirt, slightly unbuttoned, sleeves rolled up, black shiny latex pants, tight black latex pants, glossy latex, reflective surface", "poses": "dynamic pose, (standing, leaning on desk, sitting on desk, side view, three quarter view, from below, looking at viewer, looking away:1.1)", "mood": "(office lady, confident, seductive, professional, teasing, elegant, serious:1.15)", "background": "cyberpunk office, neon lights, holographic displays, rainy window background, futuristic office"}`,
                },
                {
                  role: "user",
                  content: `Outfit: ${selections.outfit || "none"}\nBackground: ${selections.background || "none"}`,
                },
              ],
              temperature: 0.4,
            }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);

          if (parsed.outfit && parsed.outfit !== "none")
            expandedOutfit = parsed.outfit;
          if (parsed.poses && parsed.poses !== "none")
            generatedPoses = parsed.poses;
          if (parsed.mood && parsed.mood !== "none")
            generatedMood = parsed.mood;
          if (parsed.background && parsed.background !== "none")
            expandedBg = parsed.background;

          isApiSuccess = true;
        } else {
          console.error("API Error Response:", await res.text());
        }
      } catch (error) {
        console.error("Groq API Request Failed:", error);
      }
    }

    const containsThai = (txt: string) => /[ก-๙]/.test(txt);
    if (!isApiSuccess) {
      if (selections.outfit && !containsThai(selections.outfit))
        expandedOutfit = selections.outfit;
      if (selections.background && !containsThai(selections.background))
        expandedBg = selections.background;
    }

    const positiveBlocks = [];

    if (loraTag) positiveBlocks.push(`${loraTag},`);

    let baseCharBlock = "score_9, score_8_up, score_7_up, source_anime,";
    if (charTags) baseCharBlock += `\n${charTags},`;
    positiveBlocks.push(baseCharBlock);

    if (expandedOutfit) positiveBlocks.push(`${expandedOutfit},`);

    positiveBlocks.push(`${generatedPoses},\n${generatedMood},`);

    if (expandedBg) positiveBlocks.push(`${expandedBg},`);

    positiveBlocks.push(
      `(masterpiece, best quality, highly detailed, intricate details, sharp focus, cinematic lighting, dramatic lighting, soft lighting, volumetric light:1.1)`,
    );

    const finalPositive = positiveBlocks.join("\n\n");

    setPrompts({
      positive: finalPositive,
      negative: baseNegative,
    });

    setCopiedPositive(false);
    setCopiedNegative(false);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string, type: "positive" | "negative") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "positive") {
      setCopiedPositive(true);
      setTimeout(() => setCopiedPositive(false), 2000);
    } else {
      setCopiedNegative(true);
      setTimeout(() => setCopiedNegative(false), 2000);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#130013] text-[#efbbff] ${openSans.className} pb-16`}
    >
      {/* เพิ่ม Navbar ตรงนี้ */}
      <Navbar />

      <div className="max-w-4xl mx-auto mt-8 bg-[#2a002a] rounded-none border-2 border-[#be29ec] shadow-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#efbbff] border-b-2 border-[#be29ec] pb-2 uppercase tracking-wide">
          2D Anime Prompt Generator (Powered by Groq)
        </h1>

        {/* ... (ส่วนอื่นๆ ของฟอร์มเหมือนเดิมทั้งหมด) ... */}

        <div className="space-y-5 mb-6">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#d896ff] uppercase tracking-wider">
              Character (LoRA)
            </label>
            <select
              name="character"
              value={selections.character}
              onChange={handleInputChange}
              className="p-3 rounded-none bg-[#1a001a] border-2 border-[#be29ec] text-[#efbbff] focus:outline-none focus:border-[#d896ff] cursor-pointer appearance-none"
            >
              <option value="">-- Select Character --</option>
              {characterOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#d896ff] uppercase tracking-wider">
              Outfit & Details (บอกสั้นๆ ให้ AI ช่วยขยายได้เลย)
            </label>
            <textarea
              name="outfit"
              value={selections.outfit}
              onChange={handleInputChange}
              placeholder="เช่น ใส่ชุด office เสื้อเชิ้ตขาว กางเกง latex สีดำ..."
              rows={2}
              className="p-3 rounded-none bg-[#1a001a] border-2 border-[#be29ec] text-[#efbbff] focus:outline-none focus:border-[#d896ff] placeholder-[#800080] resize-y"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-[#d896ff] uppercase tracking-wider">
              Background (บอกสั้นๆ ให้ AI ช่วยขยายได้เลย)
            </label>
            <textarea
              name="background"
              value={selections.background}
              onChange={handleInputChange}
              placeholder="เช่น office เเสงไปทางเเนวแบบ cyberpunk..."
              rows={2}
              className="p-3 rounded-none bg-[#1a001a] border-2 border-[#be29ec] text-[#efbbff] focus:outline-none focus:border-[#d896ff] placeholder-[#800080] resize-y"
            />
          </div>
        </div>

        <button
          onClick={generatePrompt}
          disabled={
            (!selections.character &&
              !selections.outfit &&
              !selections.background) ||
            isGenerating
          }
          className="w-full bg-[#be29ec] hover:bg-[#d896ff] text-[#130013] font-bold py-3 px-4 rounded-none border-2 border-[#d896ff] transition disabled:opacity-50 disabled:cursor-not-allowed mb-8 uppercase tracking-widest flex justify-center items-center"
        >
          {isGenerating ? (
            <span className="animate-pulse">Groq is cooking magic...</span>
          ) : (
            "Generate Prompt"
          )}
        </button>

        <div className="space-y-6 mb-12">
          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-bold text-[#130013] bg-[#be29ec] inline-block px-3 py-1 uppercase tracking-wider">
                Positive Prompt
              </label>
              <button
                onClick={() => copyToClipboard(prompts.positive, "positive")}
                className="text-xs font-bold text-[#efbbff] border border-[#be29ec] hover:bg-[#be29ec] hover:text-[#130013] px-3 py-1 transition uppercase"
              >
                {copiedPositive ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={prompts.positive}
              className="w-full h-80 p-4 rounded-none bg-[#1a001a] border-2 border-[#be29ec] text-sm font-mono text-[#efbbff] focus:outline-none focus:border-[#d896ff] resize-none leading-relaxed"
              placeholder="Your positive prompt will appear here..."
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-bold text-[#efbbff] bg-[#1a001a] border-2 border-[#be29ec] inline-block px-3 py-1 uppercase tracking-wider">
                Negative Prompt
              </label>
              <button
                onClick={() => copyToClipboard(prompts.negative, "negative")}
                className="text-xs font-bold text-[#efbbff] border border-[#be29ec] hover:bg-[#be29ec] hover:text-[#130013] px-3 py-1 transition uppercase"
              >
                {copiedNegative ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={prompts.negative}
              className="w-full h-40 p-4 rounded-none bg-[#1a001a] border-2 border-[#be29ec] text-sm font-mono text-[#efbbff] focus:outline-none focus:border-[#d896ff] resize-none leading-relaxed"
              placeholder="Your negative prompt will appear here..."
            />
          </div>
        </div>

        <div className="pt-6 border-t-2 border-[#800080]">
          <h2 className="text-lg font-bold text-[#d896ff] mb-4 uppercase tracking-wider flex items-center gap-2">
            ⚙️ Generation Settings Guide (SDXL/Pony)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#1a001a] border border-[#be29ec] p-4">
              <h3 className="font-bold text-[#efbbff] mb-3 uppercase border-b border-[#800080] pb-2 flex justify-between">
                <span>📱 Portrait</span>
                <span className="text-[#800080]">แนวตั้ง</span>
              </h3>
              <ul className="text-[#d896ff] space-y-2 font-mono">
                <li className="flex justify-between">
                  <span>Width:</span> <span className="text-white">896</span>
                </li>
                <li className="flex justify-between">
                  <span>Height:</span> <span className="text-white">1152</span>
                </li>
                <li className="flex justify-between text-xs text-[#800080] mt-2 pt-2 border-t border-[#800080]">
                  Alt: 832 x 1216
                </li>
              </ul>
            </div>

            <div className="bg-[#1a001a] border border-[#be29ec] p-4">
              <h3 className="font-bold text-[#efbbff] mb-3 uppercase border-b border-[#800080] pb-2 flex justify-between">
                <span>🖥️ Landscape</span>
                <span className="text-[#800080]">แนวนอน</span>
              </h3>
              <ul className="text-[#d896ff] space-y-2 font-mono">
                <li className="flex justify-between">
                  <span>Width:</span> <span className="text-white">1152</span>
                </li>
                <li className="flex justify-between">
                  <span>Height:</span> <span className="text-white">896</span>
                </li>
                <li className="flex justify-between text-xs text-[#800080] mt-2 pt-2 border-t border-[#800080]">
                  Alt: 1216 x 832
                </li>
              </ul>
            </div>

            <div className="bg-[#1a001a] border border-[#be29ec] p-4">
              <h3 className="font-bold text-[#efbbff] mb-3 uppercase border-b border-[#800080] pb-2 flex justify-between">
                <span>🔧 General</span>
                <span className="text-[#800080]">ทั่วไป</span>
              </h3>
              <ul className="text-[#d896ff] space-y-2 font-mono">
                <li className="flex flex-col">
                  <span className="mb-1">Sampler:</span>
                  <span className="text-white text-xs bg-[#130013] p-1 border border-[#800080] text-center">
                    DPM++ 2M SDE Karras
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Steps:</span>{" "}
                  <span className="text-white">20 - 30</span>
                </li>
                <li className="flex justify-between">
                  <span>CFG Scale:</span>{" "}
                  <span className="text-white">5 - 7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
