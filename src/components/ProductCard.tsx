"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { toBengaliNumber } from "@/lib/bengali";

export interface MarketItem {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: string | number;
  slug?: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit: string;
  today: number;
  yesterday?: number;
  image?: string;
  change?: {
    pct: number;
    dir: "up" | "down" | "flat";
  };
  markets?: MarketItem[];
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session } = useSession();

  const pct = product.change?.pct ?? 0;
  const dir = product.change?.dir || (pct > 0 ? "up" : pct < 0 ? "down" : "flat");
  const isUp = dir === "up";
  const isDown = dir === "down";

  const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };
  const unitName = unitMap[product.unit] || product.unit;

  const handleClick = (e: React.MouseEvent) => {
    if (!session?.user) {
      e.preventDefault();
      toast.error("বিস্তারিত দেখতে অনুগ্রহ করে আগে সাইন ইন করুন");
      router.push("/signin");
    }
  };

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      onClick={handleClick}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200">
          {product.image || product.categoryIcon || "📦"}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition">
            {product.nameBn}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">প্রতি {unitName}</p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 font-medium block">
            আজকের দাম
          </span>
          <span className="text-base font-black text-gray-900">
            {toBengaliNumber(product.today)} টাকা
          </span>
        </div>

        <div
          className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
            isUp
              ? "text-rose-600 bg-rose-50"
              : isDown
              ? "text-emerald-700 bg-emerald-50"
              : "text-gray-400 bg-gray-50"
          }`}
        >
          <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
          <span>{toBengaliNumber(Math.abs(pct).toFixed(1))}%</span>
        </div>
      </div>
    </Link>
  );
}
