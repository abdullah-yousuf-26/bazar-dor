"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { getBengaliDate } from "@/lib/bengali";
import { useSession, signOut } from "@/lib/auth-client";
import { CATEGORIES } from "@/lib/constants";

export interface TickerItem {
  id: string | number;
  name: string;
  price: string | number;
  unit: string;
  change: number;
  emoji?: string;
}

export default function Navbar({ tickerItems = [] }: { tickerItems?: TickerItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [bengaliDate, setBengaliDate] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Bengali date
  useEffect(() => {
    const timer = setTimeout(() => {
      setBengaliDate(getBengaliDate(new Date()));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMenuOpen(false);
      toast.success("সাইন আউট সফল হয়েছে");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  const user = session?.user;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const firstName = user?.name ? user.name.split(" ")[0] : "ব্যবহারকারী";

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-0 z-50">
      
      {/* Logo & User */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-[18px] bg-[#0d8246] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200 p-2">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর"
              width={30}
              height={30}
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-[22px] leading-tight text-[#1a231e] tracking-tight">
              বাজার দর
            </span>
            <span className="text-[12px] text-gray-700 font-normal mt-0.5">
              {bengaliDate || "লোড হচ্ছে..."}
            </span>
          </div>
        </Link>

        {/* Dropdown Menu */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:opacity-85 transition p-1 rounded-xl cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#e8f5e9] border border-emerald-300 flex items-center justify-center shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#0f7a42]">
                    {userInitial}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
                {firstName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Card */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Info */}
                <div className="pb-3 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                {/* Menu */}
                <div className="pt-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>আমার প্রোফাইল</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>সাইন আউট</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="text-xs font-semibold text-gray-700 hover:text-[#0f7a42] transition"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="bg-[#0f7a42] hover:bg-[#0c6637] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

{/* Categories */}
      <nav className="border-t border-gray-100/80 bg-white overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 sm:gap-4 py-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition ${
                  isActive
                    ? "bg-[#0f7a42] text-white font-semibold shadow-sm"
                    : "text-gray-600 hover:text-[#0f7a42] hover:bg-emerald-50/50"
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

{/* Marquee  */}
      {tickerItems.length > 0 && (
        <div className="border-t border-gray-100 bg-[#f9faf9] overflow-hidden whitespace-nowrap py-1.5 relative">
          <div className="inline-flex gap-8 animate-marquee text-[11px] font-medium text-gray-700">
            {tickerItems.map((item, idx) => {
              const isUp = item.change > 0;
              const isDown = item.change < 0;
              return (
                <span key={`${item.id}-${idx}`} className="inline-flex items-center gap-1.5">
                  <span>{item.emoji || "•"}</span>
                  <span className="text-gray-900 font-semibold">{item.name}</span>
                  <span>{item.price} টাকা/{item.unit}</span>
                  <span
                    className={`font-semibold ${
                      isUp ? "text-rose-600" : isDown ? "text-emerald-700" : "text-gray-400"
                    }`}
                  >
                    {isUp && "▲"}
                    {isDown && "▼"}
                    {isDown ? Math.abs(item.change) : item.change}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}