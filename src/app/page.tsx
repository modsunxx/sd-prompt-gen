"use client";

import { useState, ChangeEvent } from "react";
import { Open_Sans } from "next/font/google";
import Navbar from "../components/Navbar";

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
  const [isNsfw, setIsNsfw] = useState(false);
  const [selections, setSelections] = useState({
    character: "",
    outfit: "",
    background: "",
    peopleCount: "1girl, solo",
    posePreset: "", // เพิ่ม State สำหรับเก็บค่า Dropdown ท่าทาง
    action: "",
  });

  const [prompts, setPrompts] = useState({
    positive: "",
    negative: "",
  });

  const [copiedPositive, setCopiedPositive] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // ชุดคำสั่ง Dropdown ท่าทาง
  const poseOptions = [
    { value: "", label: "-- เลือกท่าทาง (Select Pose) --" },
    {
      value: "standing, looking at viewer, arms at sides",
      label: "🧍‍♀️ Standing Neutral / Idle Pose",
    },
    {
      value: "hands on hips, confident, confident smile",
      label: "😎 Confident / Hands on Hips",
    },
    { value: "arms crossed, looking at viewer", label: "😤 Arms Crossed" },
    {
      value: "dynamic action pose, combat ready, holding weapon",
      label: "⚔️ Dynamic Action Pose (Combat Ready)",
    },
    {
      value: "peace sign, victory pose, smiling, happy",
      label: "✌️ Victory / Peace Sign",
    },
    { value: "sitting, casual pose", label: "🪑 Sitting Pose (Casual)" },
    {
      value: "jumping, mid-air, dynamic pose",
      label: "🚀 Jumping / Mid-Air Dynamic",
    },
    {
      value: "close-up, looking back, looking over shoulder",
      label: "📸 Close-up Portrait / Looking Back",
    },
    {
      value: "reclining, lying pose, hand supporting head",
      label: "🛏️ Reclining / Lying Pose",
    },
    {
      value: "running, sprint pose, dynamic action",
      label: "🏃‍♀️ Running / Sprint Pose",
    },
    {
      value: "shy, embarrassed, hand on cheek, blushing, slightly looking down",
      label: "😳 Shy / Embarrassed Pose",
    },
    {
      value: "magic casting, power up pose, glowing aura",
      label: "✨ Magic Casting / Power Up Pose",
    },
    {
      value: "thinking, hand on chin, looking up",
      label: "🤔 Thinking / Chin Rest Pose",
    },
    {
      value: "from behind, back view, looking over shoulder",
      label: "🔙 Back View / Over Shoulder",
    },
    {
      value: "crouching, alert pose, hand on ground",
      label: "🥷 Crouching / Alert Pose",
    },
    { value: "custom", label: "✍️ พิมพ์ท่าทางเอง (Custom)" },
  ];

  const baseNegative = `score_6, score_5, score_4, worst quality, low quality, normal quality, 
(bad anatomy, worst anatomy, deformed, distorted, disfigured:1.2), 
(extra limbs, missing limbs, extra digits, mutated hands, fused fingers:1.2), 
poorly drawn face, bad proportions, bad perspective, 
multiple girls, multiple boys, group, crowd, 2girls, 3girls, clones, extra characters, background characters, 
text, watermark, logo, username, signature, 
lowres, jpeg artifacts, compression artifacts, 
oversaturated, underexposed, source_pony, source_furry, source_cartoon,
default outfit, original outfit`; // 🚀 เพิ่ม 2 คำนี้เพื่อแบนชุดดั้งเดิมของตัวละคร

  const theme = isNsfw
    ? {
        bgApp: "bg-[#0a0002]",
        bgCard: "bg-[#29000b]",
        borderMain: "border-[#ff003c]",
        borderDim: "border-[#80001e]",
        textMain: "text-[#ffb3c6]",
        textMuted: "text-[#ff4d6d]",
        bgInput: "bg-[#140005]",
        accent: "bg-[#ff003c]",
        accentHover: "hover:bg-[#ff4d6d]",
        textDark: "text-[#0a0002]",
        glow: "shadow-[0_0_20px_rgba(255,0,60,0.4)]",
      }
    : {
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSelections((prev) => ({ ...prev, [name]: value }));
  };

  const generatePrompt = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      alert("⚠️ ไม่พบ API Key!");
      return;
    }

    setIsGenerating(true);

    const foundChar = characterOptions.find(
      (c) => c.id === selections.character,
    );
    const loraTag = foundChar ? foundChar.lora : "";
    let charTags = foundChar ? foundChar.tags : "";

    if (isNsfw && selections.peopleCount !== "1girl, solo") {
      charTags = charTags
        .replace(/1girl, solo, /g, "")
        .replace(/solo, /g, "")
        .replace(/1girl, /g, "");
    }

    // ตัวแปรเช็คว่าควรใช้ Action จาก Dropdown หรือจาก Text Area
    const actualAction = isNsfw
      ? selections.action
      : selections.posePreset === "custom"
        ? selections.action
        : selections.posePreset;

    let expandedOutfit = "detailed clothes";
    let expandedBg = "simple background";
    let generatedPoses = "dynamic pose, looking at viewer";
    let generatedMood = "(confident:1.1)";

    let isApiSuccess = false;

    if (selections.outfit || selections.background || actualAction) {
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
              model: "llama-3.3-70b-versatile",
              response_format: { type: "json_object" },
              messages: [
                {
                  role: "system",
                  content: `You are an elite Danbooru Prompt Engineer specializing in Stable Diffusion (SDXL/Pony models). 
TRANSLATE ALL INPUTS TO ENGLISH ACCURATELY. DO NOT OUTPUT ANY THAI CHARACTERS.

CRITICAL RULE 1: Keep exact clothing items the user asks for. Do not change pants to skirts, etc.
CRITICAL RULE 2: ALL output values MUST be a single flat string of comma-separated tags. DO NOT write sentences, paragraphs, arrays, or nested objects. Use standard Danbooru tags format.
CRITICAL RULE 3 (NO CONFLICTING POSES): DO NOT generate conflicting poses. Pick EXACTLY ONE cohesive main pose based on user input, and enhance it with 2-3 supporting tags like camera angles or hand gestures.

${
  isNsfw
    ? "CRITICAL RULE 4 (NSFW MODE): The user requests highly explicit, suggestive, and uncensored content. You MUST use precise NSFW Danbooru tags for anatomy, clothing states (e.g., torn clothes, undressing, half-closed eyes), and intimate interactions based on the Action input. Do not hold back. Act as a dedicated NSFW prompt creator."
    : "CRITICAL RULE 4 (SFW MODE): Focus heavily on aesthetic, beautiful details, cinematic lighting, and highly detailed clothing/background tags."
}

- For outfit: strictly use the user's garments, describe layers, materials (e.g., latex, silk), and accessories.
- For poses & mood: Translate user's action into one cohesive Danbooru pose. Enhance with non-conflicting camera angles.
- For background: describe lighting, atmosphere, and specific surrounding objects.

Return ONLY a valid JSON object containing exactly 4 keys: "outfit", "poses", "mood", "background". Example: {"outfit": "white shirt, black pants", "poses": "sitting, legs crossed, looking at viewer, from below", "mood": "confident, smirk", "background": "bedroom, dim lighting"}`,
                },
                {
                  role: "user",
                  content: `Outfit: ${selections.outfit || "none"}\nBackground: ${selections.background || "none"}\nAction/Pose: ${actualAction || "none"}`,
                },
              ],
              temperature: 0.7,
            }),
          },
        );
        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);

          const extractStr = (val: unknown): string => {
            if (val == null) return "";
            if (val === "none") return "";
            if (typeof val === "string") return val;
            if (Array.isArray(val)) return val.map((v) => String(v)).join(", ");
            if (typeof val === "object")
              return Object.values(val as Record<string, unknown>)
                .map((v) => String(v))
                .join(", ");
            return String(val);
          };

          const newOutfit = extractStr(parsed.outfit);
          const newPoses = extractStr(parsed.poses);
          const newMood = extractStr(parsed.mood);
          const newBg = extractStr(parsed.background);

          if (newOutfit) expandedOutfit = newOutfit;
          if (newPoses) generatedPoses = newPoses;
          if (newMood) generatedMood = newMood;
          if (newBg) expandedBg = newBg;

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
      if (actualAction && !containsThai(actualAction))
        generatedPoses = actualAction;
    }

    const positiveBlocks = [];

    if (loraTag) positiveBlocks.push(`${loraTag},`);

    let baseCharBlock = "score_9, score_8_up, score_7_up, source_anime,";
    if (isNsfw) {
      baseCharBlock += `\n${selections.peopleCount},`;
    }
    if (charTags) baseCharBlock += `\n${charTags},`;

    positiveBlocks.push(baseCharBlock);

    // 🚀 อัปเกรด: เพิ่ม alternate costume และเร่งน้ำหนักชุด (1.2) เพื่อบังคับ AI เปลี่ยนชุด
    if (expandedOutfit) {
      positiveBlocks.push(`alternate costume,\n(${expandedOutfit}:1.2),`);
    }

    positiveBlocks.push(`${generatedPoses},\n${generatedMood},`);
    if (expandedBg) positiveBlocks.push(`${expandedBg},`);
    positiveBlocks.push(
      `(masterpiece, best quality, highly detailed, intricate details, sharp focus, cinematic lighting, dramatic lighting, soft lighting, volumetric light:1.1)`,
    );

    const finalPositive = positiveBlocks.join("\n\n");

    let finalNegative = baseNegative;
    if (isNsfw) {
      if (selections.peopleCount !== "1girl, solo") {
        finalNegative = finalNegative.replace(
          "multiple girls, multiple boys, group, crowd, 2girls, 3girls, clones, extra characters, background characters, \n",
          "",
        );
      }
      finalNegative +=
        ",\ncensored, mosaic censoring, bar censor, (poorly drawn genitals, bad crotch:1.2), guro, amputation";
    }

    setPrompts({
      positive: finalPositive,
      negative: finalNegative,
    });

    setCopiedPositive(false);
    setCopiedNegative(false);
    setIsGenerating(false);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
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
      className={`min-h-screen ${theme.bgApp} transition-colors duration-500 text-[#efbbff] ${openSans.className} pb-16`}
    >
      <Navbar isNsfw={isNsfw} />

      <div
        className={`max-w-5xl mx-auto mt-8 ${theme.bgCard} rounded-none border-2 ${theme.borderMain} ${theme.glow} p-6 transition-all duration-500`}
      >
        <div
          className={`flex justify-between items-center mb-6 border-b-2 ${theme.borderMain} pb-4`}
        >
          <h1
            className={`text-2xl font-bold ${theme.textMain} uppercase tracking-wide flex items-center`}
          >
            2D Anime Prompt Generator
            {isNsfw && (
              <span className="text-[#ff003c] ml-3 border border-[#ff003c] px-2 py-0.5 text-sm animate-pulse">
                NSFW MODE 🔞
              </span>
            )}
          </h1>

          <button
            onClick={() => setIsNsfw(!isNsfw)}
            className={`px-4 py-2 font-bold uppercase tracking-widest border-2 transition-all duration-300 ${
              isNsfw
                ? "bg-[#ff003c] text-[#0a0002] border-[#ff003c] hover:bg-transparent hover:text-[#ff003c] shadow-[0_0_15px_#ff003c]"
                : "bg-transparent text-[#be29ec] border-[#be29ec] hover:bg-[#be29ec] hover:text-[#130013]"
            }`}
          >
            {isNsfw ? "Disable NSFW" : "Enable NSFW"}
          </button>
        </div>

        <div className="space-y-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label
                className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider`}
              >
                Character (LoRA)
              </label>
              <select
                name="character"
                value={selections.character}
                onChange={handleInputChange}
                className={`p-3 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} ${theme.textMain} focus:outline-none focus:border-[white] cursor-pointer appearance-none transition-colors duration-500`}
              >
                <option value="">-- Select Character --</option>
                {characterOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {isNsfw && (
              <div className="flex flex-col animate-fade-in-down">
                <label
                  className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider flex items-center gap-2`}
                >
                  People Count{" "}
                  <span className="text-xs text-[#ff003c]">(NSFW Feature)</span>
                </label>
                <select
                  name="peopleCount"
                  value={selections.peopleCount}
                  onChange={handleInputChange}
                  className={`p-3 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} ${theme.textMain} focus:outline-none focus:border-[white] cursor-pointer appearance-none transition-colors duration-500`}
                >
                  <option value="1girl, solo">1 Girl (Solo)</option>
                  <option value="2girls, yuri">2 Girls (Yuri)</option>
                  <option value="3girls, group">3 Girls (Group)</option>
                  <option value="1boy, 1girl">1 Boy, 1 Girl (Straight)</option>
                  <option value="2boys, 1girl">
                    2 Boys, 1 Girl (Threesome)
                  </option>
                  <option value="multiple girls, group">
                    Multiple Girls / Harem
                  </option>
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider`}
            >
              Outfit & Details (บอกสั้นๆ ให้ AI ช่วยขยายได้เลย)
            </label>
            <textarea
              name="outfit"
              value={selections.outfit}
              onChange={handleInputChange}
              placeholder="เช่น ใส่ชุด office เสื้อเชิ้ตขาว กางเกง latex สีดำ..."
              rows={2}
              className={`p-3 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} ${theme.textMain} focus:outline-none focus:border-[white] placeholder-${theme.borderDim.replace("border-", "")} resize-y transition-colors duration-500`}
            />
          </div>

          {/* ส่วน Actions / Poses ที่ปรับปรุงใหม่ */}
          <div className="flex flex-col animate-fade-in-down">
            <label
              className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider flex items-center gap-2`}
            >
              Actions / Poses
            </label>

            {!isNsfw && (
              <select
                name="posePreset"
                value={selections.posePreset}
                onChange={handleInputChange}
                className={`p-3 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} ${theme.textMain} focus:outline-none focus:border-[white] cursor-pointer appearance-none transition-colors duration-500 ${selections.posePreset === "custom" ? "mb-3" : ""}`}
              >
                {poseOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {(isNsfw || selections.posePreset === "custom") && (
              <textarea
                name="action"
                value={selections.action}
                onChange={handleInputChange}
                placeholder={
                  isNsfw
                    ? "NSFW Mode: พิมพ์ท่าทางแบบจัดเต็มได้เลย เช่น ท่าคร่อมเก้าอี้..."
                    : "พิมพ์ท่าทางที่ต้องการเพิ่มเติม..."
                }
                rows={2}
                className={`p-3 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} ${theme.textMain} focus:outline-none focus:border-[white] placeholder-${theme.borderDim.replace("border-", "")} resize-y transition-colors duration-500 animate-fade-in-down`}
              />
            )}
          </div>

          <div className="flex flex-col">
            <label
              className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider`}
            >
              Background (บอกสั้นๆ ให้ AI ช่วยขยายได้เลย)
            </label>
            <textarea
              name="background"
              value={selections.background}
              onChange={handleInputChange}
              placeholder="เช่น office เเสงไปทางเเนวแบบ cyberpunk..."
              rows={2}
              className={`p-3 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} ${theme.textMain} focus:outline-none focus:border-[white] placeholder-${theme.borderDim.replace("border-", "")} resize-y transition-colors duration-500`}
            />
          </div>
        </div>

        <button
          onClick={generatePrompt}
          disabled={
            (!selections.character &&
              !selections.outfit &&
              !selections.background &&
              !selections.action &&
              !selections.posePreset) ||
            isGenerating ||
            isSuccess
          }
          className={`w-full font-bold py-3 px-4 rounded-none border-2 transition-all duration-300 uppercase tracking-widest flex justify-center items-center mb-8 disabled:opacity-90 disabled:cursor-not-allowed ${
            isSuccess
              ? "bg-[#00ff00] text-[#130013] border-[#00ff00] shadow-[0_0_20px_#00ff00]"
              : isGenerating
                ? `${theme.bgInput} ${theme.textMain} border-dashed ${theme.borderDim}`
                : `${theme.accent} ${theme.accentHover} ${theme.textDark} border-transparent hover:${theme.borderMain}`
          }`}
        >
          {isSuccess ? (
            <span className="flex items-center gap-2 animate-bounce">
              ✅ GENERATION COMPLETE!
            </span>
          ) : isGenerating ? (
            <span className="flex items-center gap-2 animate-pulse">
              ⏳ Groq is cooking magic...
            </span>
          ) : (
            "Generate Prompt"
          )}
        </button>

        <div className="space-y-6 mb-12">
          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <label
                className={`text-sm font-bold ${theme.textDark} ${theme.accent} inline-block px-3 py-1 uppercase tracking-wider transition-colors duration-500`}
              >
                Positive Prompt
              </label>
              <button
                onClick={() => copyToClipboard(prompts.positive, "positive")}
                className={`text-xs font-bold ${theme.textMain} border ${theme.borderMain} ${theme.accentHover} hover:${theme.textDark} px-3 py-1 transition-all uppercase`}
              >
                {copiedPositive ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={prompts.positive}
              className={`w-full h-80 p-4 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} text-sm font-mono ${theme.textMain} focus:outline-none resize-none leading-relaxed transition-colors duration-500`}
              placeholder="Your positive prompt will appear here..."
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <label
                className={`text-sm font-bold ${theme.textMain} ${theme.bgInput} border-2 ${theme.borderMain} inline-block px-3 py-1 uppercase tracking-wider transition-colors duration-500`}
              >
                Negative Prompt
              </label>
              <button
                onClick={() => copyToClipboard(prompts.negative, "negative")}
                className={`text-xs font-bold ${theme.textMain} border ${theme.borderMain} ${theme.accentHover} hover:${theme.textDark} px-3 py-1 transition-all uppercase`}
              >
                {copiedNegative ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={prompts.negative}
              className={`w-full h-40 p-4 rounded-none ${theme.bgInput} border-2 ${theme.borderMain} text-sm font-mono ${theme.textMain} focus:outline-none resize-none leading-relaxed transition-colors duration-500`}
              placeholder="Your negative prompt will appear here..."
            />
          </div>
        </div>

        <div
          className={`pt-6 border-t-2 ${theme.borderDim} transition-colors duration-500`}
        >
          <h2
            className={`text-lg font-bold ${theme.textMuted} mb-4 uppercase tracking-wider flex items-center gap-2`}
          >
            ⚙️ Generation Settings Guide (SDXL/Pony)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div
              className={`${theme.bgInput} border ${theme.borderMain} p-4 flex flex-col transition-colors duration-500`}
            >
              <h3
                className={`font-bold ${theme.textMain} mb-3 uppercase border-b ${theme.borderDim} pb-2 flex justify-between`}
              >
                <span>📱 Portrait</span>
                <span className={theme.textMuted}>แนวตั้ง</span>
              </h3>
              <ul
                className={`${theme.textMuted} space-y-3 font-mono flex-1 text-xs sm:text-sm`}
              >
                <li className="flex justify-between items-center">
                  <span>Width:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    896
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Height:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    1152
                  </span>
                </li>
                <li
                  className={`flex justify-between text-xs ${theme.textMuted} mt-4 pt-3 border-t ${theme.borderDim}`}
                >
                  Alt: 832 x 1216
                </li>
              </ul>
            </div>

            <div
              className={`${theme.bgInput} border ${theme.borderMain} p-4 flex flex-col transition-colors duration-500`}
            >
              <h3
                className={`font-bold ${theme.textMain} mb-3 uppercase border-b ${theme.borderDim} pb-2 flex justify-between`}
              >
                <span>🖥️ Landscape</span>
                <span className={theme.textMuted}>แนวนอน</span>
              </h3>
              <ul
                className={`${theme.textMuted} space-y-3 font-mono flex-1 text-xs sm:text-sm`}
              >
                <li className="flex justify-between items-center">
                  <span>Width:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    1152
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Height:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    896
                  </span>
                </li>
                <li
                  className={`flex justify-between text-xs ${theme.textMuted} mt-4 pt-3 border-t ${theme.borderDim}`}
                >
                  Alt: 1216 x 832
                </li>
              </ul>
            </div>

            <div
              className={`${theme.bgInput} border ${theme.borderMain} p-4 flex flex-col transition-colors duration-500`}
            >
              <h3
                className={`font-bold ${theme.textMain} mb-3 uppercase border-b ${theme.borderDim} pb-2 flex justify-between`}
              >
                <span>🔧 General</span>
                <span className={theme.textMuted}>ทั่วไป</span>
              </h3>
              <ul
                className={`${theme.textMuted} space-y-3 font-mono text-[11px] sm:text-xs flex-1`}
              >
                <li className="flex flex-col gap-1">
                  <span>Sampler:</span>
                  <span
                    className={`text-white ${theme.bgCard} p-1.5 border ${theme.borderDim} text-center w-full`}
                  >
                    DPM++ 2M SDE Karras
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Steps:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    25 - 30
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>CFG Scale:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    7
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Clip Skip:</span>{" "}
                  <span
                    className={`text-[#00ff00] ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    2
                  </span>
                </li>
              </ul>
            </div>

            <div
              className={`${theme.bgInput} border ${theme.borderMain} p-4 flex flex-col transition-colors duration-500`}
            >
              <h3
                className={`font-bold ${theme.textMain} mb-3 uppercase border-b ${theme.borderDim} pb-2 flex justify-between`}
              >
                <span>✨ Hires. Fix</span>
                <span className={theme.textMuted}>อัปสเกล</span>
              </h3>
              <ul
                className={`${theme.textMuted} space-y-3 font-mono text-[11px] sm:text-xs flex-1`}
              >
                <li className="flex flex-col gap-1">
                  <span>Upscaler:</span>
                  <span
                    className={`text-white ${theme.bgCard} p-1.5 border ${theme.borderDim} text-center w-full whitespace-nowrap overflow-hidden text-ellipsis`}
                  >
                    R-ESRGAN 4x+ Anime6B
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Hires steps:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    10 - 15
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Denoising:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    0.40 - 0.55
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Upscale by:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} px-2 py-1 border ${theme.borderDim}`}
                  >
                    1.5x
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
