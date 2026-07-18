"use client";

import { Open_Sans } from "next/font/google";
import Navbar from "../components/Navbar";
import { useState, ChangeEvent, useEffect } from "react";

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
    negativeInput: "",
    peopleCount: "1girl, solo",
    posePreset: "",
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

  const [isLoaded, setIsLoaded] = useState(false);

  // --------------------------------------------------------
  // 🧠 ระบบ LocalStorage
  // --------------------------------------------------------
  useEffect(() => {
    const savedSelections = localStorage.getItem("aiMegaPack_selections");
    const savedPrompts = localStorage.getItem("aiMegaPack_prompts");
    const savedNsfw = localStorage.getItem("aiMegaPack_isNsfw");

    // eslint-disable-next-line
    if (savedSelections) setSelections(JSON.parse(savedSelections));
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
    if (savedNsfw) setIsNsfw(JSON.parse(savedNsfw));

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aiMegaPack_selections", JSON.stringify(selections));
    }
  }, [selections, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aiMegaPack_prompts", JSON.stringify(prompts));
    }
  }, [prompts, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aiMegaPack_isNsfw", JSON.stringify(isNsfw));
    }
  }, [isNsfw, isLoaded]);

  // 🚀 รายชื่อ Character LoRA
  const characterOptions: Option[] = [
    {
      id: "2b",
      label: "2B",
      lora: "<lora:2B_pony:0.75>",
      tags: "2b (nier:automata), 1girl, solo, beautiful detailed face, blindfold, white hair, short hair, black dress, black gloves, thigh boots, hairband",
    },
    {
      id: "ada",
      label: "Ada Wong",
      lora: "<lora:Ada_Wong_pony:0.75>",
      tags: "ada wong, 1girl, solo, beautiful detailed face, short black hair, brown eyes, red dress, elegant, mole under eye",
    },
    {
      id: "aemeath",
      label: "aemeath",
      lora: "<lora:aemeath_pony:0.75>",
      tags: "aemeath (wuthering waves), 1girl, solo, beautiful detailed face, tall, fair skin, gold eyes, star-shaped pupils, pink hair, high ponytail, gradient hair, yellow hair tips, halo, wing hair ornament",
    },
    {
      id: "alya",
      label: "Alya",
      lora: "<lora:Alya_pony-10:0.75>",
      tags: "alya (alya sometimes hides her feelings in russian), 1girl, solo, beautiful detailed face, long hair, ash-blonde hair, blue eyes",
    },
    {
      id: "arlecchino",
      label: "Arlecchino",
      lora: "<lora:arlecchino_pony:0.75>",
      tags: "arlecchino (genshin impact), 1girl, solo, beautiful detailed face, long hair, dark hair, red eyes, horns, black dress, gloves",
    },
    {
      id: "changli",
      label: "Changli",
      lora: "<lora:changli_pony:0.75>",
      tags: "changli (wuthering waves), 1girl, solo, beautiful detailed face, long hair, red hair, red eyes, fox ears, chinese clothes",
    },
    {
      id: "chasca",
      label: "Chasca",
      lora: "<lora:Chasca_pony:0.75>",
      tags: "chasca (genshin impact), 1girl, solo, beautiful detailed face, dark skin, white hair, feather hair ornament, hat",
    },
    {
      id: "chisa",
      label: "Chisa",
      lora: "<lora:chisa_pony:0.75>",
      tags: "chisa (wuthering waves), 1girl, solo, beautiful detailed face, pale skin, long hair, black hair, red eyes, beauty mark, school uniform, sailor uniform, red ribbon, black jacket, collar",
    },
    {
      id: "clorinde",
      label: "Clorinde",
      lora: "<lora:Clorinde_Pony:0.75>",
      tags: "clorinde (genshin impact), 1girl, solo, beautiful detailed face, long hair, black hair, purple eyes, gothic dress, hat",
    },
    {
      id: "evelyn",
      label: "Evelyn",
      lora: "<lora:evelyn_pony:0.75>",
      tags: "evelyn chevalier (zenless zone zero), 1girl, solo, beautiful detailed face, blonde hair, short hair, hair bun, sidelocks, purple eyes, mole under eye, black suit, necktie, large breasts",
    },
    {
      id: "feixiao",
      label: "Feixiao",
      lora: "<lora:feixiao_pony:0.75>",
      tags: "feixiao (honkai: star rail), 1girl, solo, beautiful detailed face, white hair, animal ears, fox ears, long hair, gold eyes, armor",
    },
    {
      id: "hatsune_miku",
      label: "Hatsune Miku",
      lora: "<lora:Hatsune_Miku_Pony:0.75>",
      tags: "hatsune miku, 1girl, solo, beautiful detailed face, twintails, teal hair, teal eyes, detached sleeves, necktie",
    },
    {
      id: "herta",
      label: "Herta",
      lora: "<lora:Herta_pony:0.75>",
      tags: "herta (honkai: star rail), 1girl, solo, beautiful detailed face, white hair, purple eyes, twintails, small breasts, doll-like",
    },
    {
      id: "kafka",
      label: "Kafka",
      lora: "<lora:kafka_pony:0.75>",
      tags: "kafka (honkai: star rail), 1girl, solo, beautiful detailed face, purple hair, sunglasses on head, purple eyes, long hair, black dress",
    },
    {
      id: "kurashiki_reina",
      label: "Kurashiki Reina",
      lora: "<lora:Kurashiki_Reina_pony:0.75>",
      tags: "kurashiki reina, 1girl, solo, beautiful detailed face",
    },
    {
      id: "lauma",
      label: "Lauma",
      lora: "<lora:Lauma_pony:0.75>",
      tags: "lauma (genshin impact), 1girl, solo, beautiful detailed face, pale skin, long hair, purple hair, blue hair, wavy hair, antlers, pointed ears, turquoise eyes, pink eyes, hair over one eye, elf",
    },
    {
      id: "lynae",
      label: "Lynae",
      lora: "<lora:lynae_pony:0.75>",
      tags: "lynae (wuthering waves), 1girl, solo, beautiful detailed face, blonde hair, teal streaks, braids, purple eyes, school uniform, necktie, white jacket, gyaru, earrings",
    },
    {
      id: "marin",
      label: "Marin Kitagawa",
      lora: "<lora:Marin_pony:0.75>",
      tags: "kitagawa marin, 1girl, solo, beautiful detailed face, long hair, orange hair, brown eyes, twintails, gyaru",
    },
    {
      id: "mauika",
      label: "Mauika",
      lora: "<lora:mauika_pony:0.75>",
      tags: "mauika (genshin impact), 1girl, solo, beautiful detailed face, dark skin, orange hair",
    },
    {
      id: "navia",
      label: "Navia",
      lora: "<lora:Navia_Pony:0.75>",
      tags: "navia (genshin impact), 1girl, solo, beautiful detailed face, long hair, blonde hair, blue eyes, hat, gothic lolita, umbrella",
    },
    {
      id: "raiden",
      label: "Raiden Shogun",
      lora: "<lora:raiden_shogun_pony:0.75>",
      tags: "raiden shogun, braid, braided ponytail, hair flower, hair ornament, long hair, mole, mole under eye, purple eyes, purple flower, purple hair, single braid, sidelocks",
    },
    {
      id: "rappa",
      label: "Rappa",
      lora: "<lora:Rappa_pony:0.75>",
      tags: "rappa (honkai: star rail), 1girl, solo, beautiful detailed face, orange hair, short hair, oni horns, tomboy",
    },
    {
      id: "reika",
      label: "Reika Shichijou",
      lora: "<lora:reika_shichijou_pony:0.75>",
      tags: "reika shichijou, 1girl, solo, beautiful detailed face",
    },
    {
      id: "rias",
      label: "Rias Gremory",
      lora: "<lora:rias_pony:0.75>",
      tags: "rias gremory, 1girl, solo, beautiful detailed face, red hair, long hair, blue eyes, ponytail, large breasts",
    },
    {
      id: "shenhe",
      label: "Shenhe",
      lora: "<lora:shenhe_pony:0.75>",
      tags: "shenhe (genshin impact), 1girl, solo, beautiful detailed face, long hair, white hair, grey eyes, braid, tassel",
    },
    {
      id: "shorekeeper",
      label: "Shorekeeper",
      lora: "<lora:shorekeeper_pony:0.75>",
      tags: "shorekeeper (wuthering waves), 1girl, solo, beautiful detailed face, long hair, blue hair, blindfold, halo",
    },
    {
      id: "skirk",
      label: "Skirk",
      lora: "<lora:skirk_pony:0.75>",
      tags: "skirk (genshin impact), 1girl, solo, beautiful detailed face, long hair, black hair, blue eyes, cold expression",
    },
    {
      id: "tokisaki_kurumi",
      label: "Tokisaki Kurumi",
      lora: "<lora:TokisakiKurumi_Pony:0.75>",
      tags: "tokisaki kurumi, 1girl, solo, beautiful detailed face, long hair, black hair, mismatched eyes, red eye, gold eye, ribbon",
    },
    {
      id: "yae",
      label: "Yae Miko",
      lora: "<lora:yaemiko_pony:0.75>",
      tags: "yae miko, animal ears, floppy ears, fox ears, hair between eyes, long hair, pink hair, purple eyes, pink hair,",
    },
    {
      id: "yaoguang",
      label: "Yaoguang",
      lora: "<lora:yaoguang_pony:0.75>",
      tags: "yaoguang, 1girl, solo, beautiful detailed face, long hair, white hair",
    },
    {
      id: "yelan",
      label: "Yelan",
      lora: "<lora:yelan_pony:0.75>",
      tags: "yelan (genshin impact), 1girl, solo, beautiful detailed face, long hair, dark blue hair, purple eyes, tassel, detective",
    },
  ];

  const poseOptions = [
    { value: "", label: "-- เลือกท่าทาง (Select Pose) --" },
    {
      value:
        "standing, looking at viewer, arms at sides, straight posture, feet together, relaxed shoulders",
      label: "🧍‍♀️ ยืนตรง ท่าปกติ",
    },
    {
      value:
        "standing, hands on hips, confident, confident smile, chest out, one leg slightly forward, smirk",
      label: "😎 ท่ามั่นใจ มือเท้าเอว",
    },
    {
      value:
        "standing, arms crossed, looking at viewer, serious expression, weight on one leg, slight frown",
      label: "😤 กอดอก",
    },
    {
      value:
        "dynamic action pose, combat ready stance, holding weapon, knees bent, one arm extended, intense gaze, wind blowing hair",
      label: "⚔️ ท่าแอ็คชั่น พร้อมต่อสู้",
    },
    {
      value:
        "peace sign, victory pose, smiling, happy, one eye closed, tongue out slightly, tilted head",
      label: "✌️ ท่าชู 2 นิ้ว ยิ้มสดใส",
    },
    {
      value:
        "sitting, casual pose, legs crossed, hand resting on lap, relaxed expression, looking at viewer",
      label: "🪑 นั่งท่าลำลอง",
    },
    {
      value:
        "jumping, mid-air, dynamic pose, hair flowing, arms spread out, skirt flutter, excited expression",
      label: "🚀 ท่ากระโดดลอยตัว",
    },
    {
      value:
        "close-up, upper body, looking back, looking over shoulder, soft smile, wind in hair, blush",
      label: "📸 ภาพระยะใกล้ หันมอง",
    },
    {
      value:
        "reclining, lying pose, hand supporting head, on side, relaxed expression, one leg bent",
      label: "🛏️ ท่านอนเอนกาย",
    },
    {
      value:
        "running, sprint pose, dynamic action, leaning forward, arms pumping, determined expression, motion blur background",
      label: "🏃‍♀️ ท่าวิ่งเร็ว",
    },
    {
      value:
        "shy, embarrassed, hand on cheek, blushing, looking away, nervous smile, fidgeting fingers",
      label: "😳 ท่าเขินอาย",
    },
    {
      value:
        "magic casting, power up pose, glowing aura, sparkles, hand raised with energy effect, determined eyes, cape flowing",
      label: "✨ ท่าร่ายเวทมนตร์",
    },
    {
      value:
        "thinking, hand on chin, looking up, tilted head, curious expression, one eyebrow raised",
      label: "🤔 ท่าคิด เอามือแตะคาง",
    },
    {
      value:
        "from behind, back view, looking over shoulder, hair flowing, hand touching hair, soft smile",
      label: "🔙 มุมมองด้านหลัง หันมอง",
    },
    {
      value:
        "crouching, alert pose, hand on ground, low stance, sharp gaze, ready to spring, tense muscles",
      label: "🥷 ท่าหมอบ พร้อมระวังภัย",
    },
    { value: "custom", label: "✍️ พิมพ์ท่าทางเอง (Custom)" },
  ];

  const baseNegative = `score_6, score_5, score_4, worst quality, low quality, normal quality, 
3d, render, realistic, cg,
(extra legs, extra limbs, fused anatomy:1.2), 
(bad hands, poorly drawn face:1.2), 
multiple girls, multiple boys, group, clones, 
text, watermark, logo, username, signature, 
source_pony, source_furry, source_cartoon,
(default outfit, original outfit, signature attire:1.2)`;

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

  // 🧹 ฟังก์ชันล้างข้อมูลทั้งหมด
  const handleClear = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูล Prompt ทั้งหมด?")) {
      setSelections({
        character: "",
        outfit: "",
        background: "",
        negativeInput: "",
        peopleCount: "1girl, solo",
        posePreset: "",
        action: "",
      });
      setPrompts({
        positive: "",
        negative: "",
      });
    }
  };

  const generatePrompt = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      alert("⚠️ ไม่พบ API Key! กรุณาตั้งค่าในไฟล์ .env.local");
      return;
    }
    setIsGenerating(true);

    const foundChar = characterOptions.find(
      (c) => c.id === selections.character,
    );
    const loraTag = foundChar ? foundChar.lora.replace("0.88", "0.75") : "";
    let charTags = foundChar ? foundChar.tags : "";

    if (isNsfw && selections.peopleCount !== "1girl, solo") {
      charTags = charTags
        .replace(/1girl, solo, /g, "")
        .replace(/solo, /g, "")
        .replace(/1girl, /g, "");
    }

    const actualAction = isNsfw
      ? selections.action
      : selections.posePreset === "custom"
        ? selections.action
        : selections.posePreset;

    let expandedOutfit = "detailed clothes";
    let expandedBg = "simple background";
    let generatedPoses = "dynamic pose, looking at viewer";
    let generatedMood = "(confident:1.1)";
    let generatedNegative = "";

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
                content: `You are an elite Danbooru Prompt Engineer. TRANSLATE ALL THAI INPUTS TO ENGLISH.
DO NOT output sentences or paragraphs. Output ONLY flat, comma-separated Danbooru tags.

CRITICAL INSTRUCTIONS PER JSON KEY:
1. "outfit": Preserve user's exact garments, colors, and materials. DO NOT use underscores (e.g., write "white shirt, long sleeves" INSTEAD OF "white_long_sleeved_shirt"). Break complex outfits into simple modular tags.
  ${isNsfw ? "-> [NSFW MODE]: MUST explicitly describe the physical state of the clothes (e.g., partially unbuttoned, clothes pulled down, torn)." : "-> [SFW MODE]: Enhance with fabric textures (e.g., silk, latex) and high-detail clothing tags."}
2. "poses": ${
                  isNsfw
                    ? "-> [NSFW MODE]: Translate the user's action deeply, literally, and accurately. Output ALL necessary explicit, interaction, and anatomical Danbooru tags without any limits. Capture every detail of the described action."
                    : "-> [SFW MODE]: Pick EXACTLY ONE main physical pose to prevent conflicts. Enhance with 2-3 compatible supporting tags (e.g., camera angle, hand gesture, head tilt)."
                }
3. "background": ALLOW compound phrases here to maintain environmental context (e.g., "sitting on futuristic office desk", "rainy neon cyberpunk street"). 
4. "mood": Output facial expressions, cinematic lighting, and atmospheric tags (e.g., confident smile, rim lighting, depth of field).
5. "negative": Translate the 'Avoid' input into negative Danbooru tags (e.g., skirt, boots, glasses). If 'Avoid' is 'none' or empty, output an empty string.

Return ONLY a valid JSON object matching this exact structure: {"outfit": "...", "poses": "...", "mood": "...", "background": "...", "negative": "..."}`,
              },
              {
                role: "user",
                content: `Outfit: ${selections.outfit || "none"}\nBackground: ${selections.background || "none"}\nAction: ${actualAction || "none"}\nAvoid: ${selections.negativeInput || "none"}`,
              },
            ],
            temperature: 0.7,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        // 🚀 อัปเกรด: ฟังก์ชันสกัดข้อความแบบฉลาดขึ้น กรองคำว่า none ทิ้ง
        const extractStr = (val: unknown): string => {
          if (val == null) return "";
          let str = "";
          if (typeof val === "string") str = val;
          else if (Array.isArray(val))
            str = val.map((v) => String(v)).join(", ");
          else if (typeof val === "object")
            str = Object.values(val as Record<string, unknown>)
              .map((v) => String(v))
              .join(", ");
          else str = String(val);

          str = str.trim();
          // ป้องกัน AI หลอนตอบคำว่างเปล่ามา
          if (["none", "n/a", "-", "", "null"].includes(str.toLowerCase()))
            return "";
          return str;
        };

        expandedOutfit = extractStr(parsed.outfit) || expandedOutfit;
        generatedPoses = extractStr(parsed.poses) || generatedPoses;
        generatedMood = extractStr(parsed.mood) || generatedMood;
        expandedBg = extractStr(parsed.background) || expandedBg;
        generatedNegative = extractStr(parsed.negative);
      } else {
        // 🚀 อัปเกรด: ระบบแจ้งเตือนเมื่อ API มีปัญหา
        const errText = await res.text();
        console.error("Groq API Error:", errText);
        alert(
          `เกิดข้อผิดพลาดจาก API ของ Groq ครับ (${res.status})\nกรุณาลองใหม่อีกครั้ง`,
        );
        setIsGenerating(false);
        return;
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ครับ");
      setIsGenerating(false);
      return;
    }

    // --- ประกอบ Positive Prompt แบบคลีนๆ ---
    const positiveBlocks = [];
    if (loraTag) positiveBlocks.push(`${loraTag},`);

    let baseCharBlock = "score_9, score_8_up, score_7_up, source_anime,";

    // 🚀 เพิ่มระบบคุมโทนภาพ (Rating System)
    if (isNsfw) {
      baseCharBlock += " rating_explicit,"; // โหมด NSFW บังคับให้เป็น 18+
      baseCharBlock += `\n${selections.peopleCount},`;
    } else {
      baseCharBlock += " rating_safe,"; // โหมดปกติ บังคับให้เป็นภาพปลอดภัย
    }

    if (charTags) baseCharBlock += `\n${charTags},`;
    positiveBlocks.push(baseCharBlock);

    if (expandedOutfit)
      positiveBlocks.push(`alternate costume,\n(${expandedOutfit}:1.2),`);
    if (generatedPoses) positiveBlocks.push(`${generatedPoses},`);
    if (generatedMood) positiveBlocks.push(`${generatedMood},`);
    if (expandedBg) positiveBlocks.push(`${expandedBg},`);

    positiveBlocks.push(
      `(masterpiece, best quality, highly detailed, intricate details, sharp focus, cinematic lighting, dramatic lighting, soft lighting, volumetric light:1.1)`,
    );

    // --- ประกอบ Negative Prompt แบบคลีนๆ ---
    let finalNegative = baseNegative;

    // 🚀 สลับแท็กบล็อกตามโหมด
    if (isNsfw) {
      finalNegative = `rating_safe, rating_questionable,\n${finalNegative}`;
    } else {
      finalNegative = `rating_explicit, rating_questionable,\n${finalNegative}`;
    }

    if (generatedNegative) {
      finalNegative = `(${generatedNegative}:1.3),\n${finalNegative}`;
    }

    if (isNsfw) {
      if (selections.peopleCount !== "1girl, solo") {
        finalNegative = finalNegative.replace(
          "multiple girls, multiple boys, group, clones, \n",
          "",
        );
      }
      finalNegative +=
        ",\ncensored, mosaic censoring, bar censor, (poorly drawn genitals, bad crotch:1.2), guro, amputation";
    }

    setPrompts({
      positive: positiveBlocks.filter(Boolean).join("\n\n"),
      negative: finalNegative.trim(),
    });

    setIsGenerating(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
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

          {/* 🚀 มัดรวมปุ่ม Clear และปุ่ม NSFW ไว้ด้วยกัน */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleClear}
              className={`px-4 py-2 font-bold uppercase tracking-widest border-2 transition-all duration-300 bg-transparent ${theme.textMuted} ${theme.borderDim} hover:bg-white/10 hover:${theme.textMain}`}
              title="ล้างข้อมูลทั้งหมด"
            >
              🧹 Clear
            </button>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label
                className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider`}
              >
                Outfit & Details (บรีฟชุดที่อยากได้)
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

            <div className="flex flex-col">
              <label
                className={`mb-2 text-sm font-semibold ${theme.textMuted} uppercase tracking-wider`}
              >
                🚫 สิ่งที่ไม่ต้องการ (Negative Details)
              </label>
              <textarea
                name="negativeInput"
                value={selections.negativeInput}
                onChange={handleInputChange}
                placeholder="เช่น ไม่เอากระโปรง ไม่เอารองเท้าบูท..."
                rows={2}
                className={`p-3 rounded-none ${theme.bgInput} border-2 border-red-500 text-red-200 focus:outline-none focus:border-red-400 placeholder-red-900 resize-y transition-colors duration-500`}
              />
            </div>
          </div>

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
              !selections.posePreset &&
              !selections.negativeInput) ||
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
                  <span>Sampler:</span>{" "}
                  <span
                    className={`text-white ${theme.bgCard} p-1.5 border ${theme.borderDim} text-center w-full`}
                  >
                    Euler a (Automatic)
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
                  <span>Upscaler:</span>{" "}
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
