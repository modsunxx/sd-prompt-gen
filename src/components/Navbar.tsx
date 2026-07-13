import Link from "next/link";
import { usePathname } from "next/navigation";

// รับค่า isNsfw เข้ามาเพื่อเปลี่ยนธีม
export default function Navbar({ isNsfw = false }: { isNsfw?: boolean }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "📝 Prompt Generator", path: "/" },
    { name: "📸 Image to Outfit", path: "/image-to-prompt" },
    { name: "🏙️ Image to Background", path: "/image-to-background" }, // 🚀 เพิ่มเมนูใหม่ตรงนี้
  ];

  // กำหนดสี Navbar ตามโหมด
  const theme = isNsfw
    ? {
        bg: "bg-[#29000b]",
        border: "border-[#ff003c]",
        text: "text-[#ffb3c6]",
        linkBg: "bg-[#140005]",
        linkBorder: "border-[#80001e]",
        linkHover: "hover:bg-[#80001e] hover:text-[#ffb3c6]",
        activeBg: "bg-[#ff003c] text-[#0a0002] border-[#ff4d6d]",
      }
    : {
        bg: "bg-[#2a002a]",
        border: "border-[#be29ec]",
        text: "text-[#efbbff]",
        linkBg: "bg-[#1a001a]",
        linkBorder: "border-[#800080]",
        linkHover: "hover:bg-[#800080] hover:text-[#efbbff]",
        activeBg: "bg-[#be29ec] text-[#130013] border-[#d896ff]",
      };

  return (
    <nav
      className={`${theme.bg} border-b-2 ${theme.border} shadow-lg sticky top-0 z-50 transition-colors duration-500`}
    >
      <div className="w-full px-8 py-4 flex justify-between items-center">
        <div
          className={`${theme.text} font-bold text-xl tracking-widest uppercase flex items-center gap-2`}
        >
          AI MEGA PACK{" "}
          {isNsfw && (
            <span className="text-[#ff003c] text-sm animate-pulse">
              {" "}
              [NSFW]
            </span>
          )}
        </div>
        <div className="flex gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.path} href={link.path}>
                <span
                  className={`px-4 py-2 font-semibold uppercase tracking-wider transition-all duration-300 border-2 ${
                    isActive
                      ? theme.activeBg
                      : `${theme.linkBg} ${theme.text} ${theme.linkBorder} ${theme.linkHover}`
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
