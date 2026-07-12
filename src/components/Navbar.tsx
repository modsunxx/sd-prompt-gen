import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "📝 Prompt Generator", path: "/" },
    { name: "📸 Image to Outfit", path: "/image-to-prompt" },
  ];

  return (
    <nav className="bg-[#2a002a] border-b-2 border-[#be29ec] shadow-lg sticky top-0 z-50">
      {/* เปลี่ยนจาก max-w-4xl mx-auto เป็น w-full เพื่อให้ขยายเต็มจอ และใช้ px-8 ให้มีช่องว่างซ้ายขวานิดหน่อยให้ดูสวยงาม */}
      <div className="w-full px-8 py-4 flex justify-between items-center">
        <div className="text-[#efbbff] font-bold text-xl tracking-widest uppercase">
          AI MEGA PACK
        </div>
        <div className="flex gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.path} href={link.path}>
                <span
                  className={`px-4 py-2 font-semibold uppercase tracking-wider transition border-2 ${
                    isActive
                      ? "bg-[#be29ec] text-[#130013] border-[#d896ff]"
                      : "bg-[#1a001a] text-[#d896ff] border-[#800080] hover:bg-[#800080] hover:text-[#efbbff]"
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
