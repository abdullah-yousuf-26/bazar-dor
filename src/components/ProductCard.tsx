import Link from "next/link";
import { toBengaliNumber } from "@/lib/bengali";

export interface MarketItem {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface ProductChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export interface Product {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: ProductChange;
  markets?: MarketItem[];
  [key: string]: unknown;
}

export default function ProductCard({ product }: { product: Product }) {
  if (!product) return null;

  // 1. Title
  const productName = product.nameBn || "পণ্য";

  // 2. Today's Price
  const rawPrice = product.today ?? 0;
  const formattedPrice = toBengaliNumber(rawPrice.toLocaleString("en-US"));

  // 3. Change percentage & direction
  const pct = product.change?.pct ?? 0;
  const dir = product.change?.dir || (pct > 0 ? "up" : pct < 0 ? "down" : "flat");
  const formattedChange = toBengaliNumber(Math.abs(pct).toFixed(1));

  const isUp = dir === "up";
  const isDown = dir === "down";
  const isFlat = dir === "flat";

  // 4. Bengali unit label
  const unitMap: Record<string, string> = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };
  const unitText = unitMap[product.unit] || `প্রতি ${product.unit}`;

  // 5. Target URL
  const targetSlug = product.slug || String(product.id);

  return (
    <Link
      href={`/product/${targetSlug}`}
      className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between"
    >
      {/* Top: Icon + Title & Unit */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform duration-200">
          {product.image || product.categoryIcon || "📦"}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition text-base tracking-tight truncate">
            {productName}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{unitText}</p>
        </div>
      </div>

      {/* Bottom: Price + Trend Badge */}
      <div className="pt-2 flex items-end justify-between">
        <div>
          <span className="text-[11px] text-gray-400 font-medium block">
            আজকের দাম
          </span>
          <span className="text-base font-extrabold text-gray-900">
            {formattedPrice} টাকা
          </span>
        </div>

        {/* Change Badge */}
        <span
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
            isUp
              ? "bg-rose-50 text-rose-600"
              : isDown
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isUp && <span>▲</span>}
          {isDown && <span>▼</span>}
          {isFlat && <span>—</span>}
          <span>{formattedChange}%</span>
        </span>
      </div>
    </Link>
  );
}
