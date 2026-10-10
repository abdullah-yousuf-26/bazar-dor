"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, ChevronDown, LogOut, User } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { toBengaliNumber, getBengaliDate } from "@/lib/bengali";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface TickerProduct {
  id?: string | number;
  name: string;
  price: number | string;
  unit: string;
  change: number;
  emoji?: string;
}

export interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
  emoji?: string;
}

const defaultCategories: CategoryItem[] = [
  { id: 1, name: "চাল", slug: "chal", emoji: "🍚" },
  { id: 2, name: "ডাল", slug: "dal", emoji: "🫘" },
  { id: 3, name: "তেল", slug: "oil", emoji: "🥫" },
  { id: 4, name: "সবজি", slug: "vegetable", emoji: "🥬" },
  { id: 5, name: "মাছ", slug: "fish", emoji: "🐟" },
  { id: 6, name: "মাংস", slug: "meat", emoji: "🍗" },
  { id: 7, name: "ডিম-দুধ", slug: "egg-milk", emoji: "🥛" },
  { id: 8, name: "মসলা", slug: "spice", emoji: "🌶️" },
];

export default function Navbar({
  categories = defaultCategories,
  tickerItems = [],
}: {
  categories?: CategoryItem[];
  tickerItems?: TickerProduct[];
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState("মঙ্গলবার, ৬ অক্টোবর, ২০২৬");

  useEffect(() => {
    setBanglaDate(getBengaliDate(new Date()));
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("লগআউট সফল হয়েছে");
      setMenuOpen(false);
    } catch {
      toast.error("লগআউট ব্যর্থ হয়েছে");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* 1. Top Row: Brand & Profile/Auth */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">বাজার দর</h1>
            <p className="text-xs text-gray-500">{banglaDate}</p>
          </div>
        </Link>

        {/* User Auth Info */}
        <div className="relative">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 hidden sm:inline">
                  {session.user.name || "ব্যবহারকারী"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    প্রোফাইল
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    লগআউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-700 hover:text-emerald-700 px-3 py-1.5"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg shadow-sm transition"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. Middle Row: Category Navigation */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center space-x-2 md:space-x-6 py-2.5 overflow-x-auto text-sm scrollbar-none">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{cat.emoji || "🏷️"}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Row: Price Marquee Ticker */}
      <div className="border-y border-gray-100 bg-gray-50/90 py-2 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8">
          {[...tickerItems, ...tickerItems].map((item, index) => {
            const isUp = item.change > 0;
            const isDown = item.change < 0;

            return (
              <div key={index} className="inline-flex items-center gap-1.5 text-xs text-gray-800 shrink-0">
                <span>{item.emoji || "🍚"}</span>
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-gray-900 font-semibold">
                  {toBengaliNumber(item.price)} টাকা/{item.unit}
                </span>
                <span
                  className={`font-semibold flex items-center gap-0.5 ${
                    isUp ? "text-emerald-600" : isDown ? "text-rose-600" : "text-gray-500"
                  }`}
                >
                  {isUp ? "▲" : isDown ? "▼" : "—"} {toBengaliNumber(Math.abs(item.change))}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
