"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { getBengaliDate } from "@/lib/bengali";
import { useSession } from "@/lib/auth-client";
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
  const { data: session } = useSession();
  const [bengaliDate, setBengaliDate] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setBengaliDate(getBengaliDate(new Date()));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-0 z-50">
      {/* Tier 1: Logo & User Status */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0f7a42] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-black text-xl text-gray-900 tracking-tight block leading-tight">
              বাজার দর
            </span>
            <span className="text-[11px] text-gray-400 font-medium block">
              {bengaliDate || "লোড হচ্ছে..."}
            </span>
          </div>
        </Link>

        {session?.user ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:opacity-85 transition p-1 rounded-xl"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#e8f5e9] border border-emerald-300 flex items-center justify-center shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-[#0f7a42]">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
              {session.user.name}
            </span>
            <span className="text-[10px] text-gray-400">▾</span>
          </Link>
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

      {/* Tier 2: Categories */}
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

      {/* Tier 3: Price Marquee */}
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