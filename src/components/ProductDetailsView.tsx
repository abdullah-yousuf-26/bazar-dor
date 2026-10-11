"use client";

import Link from "next/link";
import { Product, MarketItem } from "./ProductCard";
import { toBengaliNumber } from "@/lib/bengali";

interface Props {
  product: Product;
}

export default function ProductDetailsView({ product }: Props) {
  const markets: MarketItem[] = product.markets || [];

  // 1. Calculations across all markets
  const minPrices = markets.map((m) => m.min);
  const maxPrices = markets.map((m) => m.max);

  const lowestPrice = minPrices.length > 0 ? Math.min(...minPrices) : product.today;
  const highestPrice = maxPrices.length > 0 ? Math.max(...maxPrices) : product.today;

  // Find markets offering lowest and highest prices
  const lowestMarket = markets.find((m) => m.min === lowestPrice)?.market || "সব বাজার";
  const highestMarket = markets.find((m) => m.max === highestPrice)?.market || "সব বাজার";

  // Calculate average of today's price across markets
  const totalAvg =
    markets.length > 0
      ? markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) / markets.length
      : product.today;

  // Unit translation
  const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };
  const unitName = unitMap[product.unit] || product.unit;

  // Price difference compared to yesterday
  const priceDiff = (product.today ?? 0) - (product.yesterday ?? product.today ?? 0);
  const absDiff = Math.abs(priceDiff);
  const diffText =
    priceDiff > 0
      ? `গতকালকের তুলনায় আজ দাম বেড়েছে - ${toBengaliNumber(absDiff)} টাকা`
      : priceDiff < 0
      ? `গতকালকের তুলনায় আজ দাম কমেছে - ${toBengaliNumber(absDiff)} টাকা`
      : "গতকালকের তুলনায় দামে কোনো পরিবর্তন হয়নি";

  const pct = product.change?.pct ?? 0;
  const dir = product.change?.dir || (pct > 0 ? "up" : pct < 0 ? "down" : "flat");
  const isUp = dir === "up";
  const isDown = dir === "down";

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-emerald-700 transition">
          হোম
        </Link>
        <span>›</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-emerald-700 transition"
        >
          {product.categoryNameBn || "ক্যাটাগরি"}
        </Link>
        <span>›</span>
        <span className="text-gray-800 font-semibold">{product.nameBn}</span>
      </nav>

      {/* 2. Top Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            {product.image || product.categoryIcon || "📦"}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {product.nameBn}
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              প্রতি {unitName} · {product.categoryNameBn}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-medium">{diffText}</p>
          </div>
        </div>

        {/* Today's Price Box */}
        <div className="bg-[#f9faf9] border border-gray-100 rounded-2xl p-5 text-center min-w-[150px] self-start md:self-auto">
          <span className="text-[11px] text-gray-400 font-medium block">
            আজকের দাম
          </span>
          <span className="text-2xl font-black text-gray-900 block my-0.5">
            {toBengaliNumber(product.today)}
          </span>
          <span className="text-xs text-gray-500 block">
            টাকা / {unitName}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold mt-2 ${
              isUp ? "text-rose-600" : isDown ? "text-emerald-700" : "text-gray-400"
            }`}
          >
            {isUp && "▲"}
            {isDown && "▼"}
            {toBengaliNumber(Math.abs(pct).toFixed(1))}%
          </span>
        </div>
      </div>

      {/* 3. দামের সারসংক্ষেপ (Summary 3-col Grid) */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* সর্বনিম্ন দাম */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-xs text-gray-400 font-medium block">
              সর্বনিম্ন দাম
            </span>
            <div className="text-xl font-black text-emerald-600 my-1">
              {toBengaliNumber(lowestPrice)} <span className="text-sm font-normal text-gray-600">টাকা</span>
            </div>
            <p className="text-xs text-gray-400">
              সবচেয়ে কম {lowestMarket}
            </p>
          </div>

          {/* সর্বাধিক দাম */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-xs text-gray-400 font-medium block">
              সর্বাধিক দাম
            </span>
            <div className="text-xl font-black text-rose-500 my-1">
              {toBengaliNumber(highestPrice)} <span className="text-sm font-normal text-gray-600">টাকা</span>
            </div>
            <p className="text-xs text-gray-400">
              সবচেয়ে বেশি {highestMarket}
            </p>
          </div>

          {/* গড় দাম */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-xs text-gray-400 font-medium block">
              গড় দাম
            </span>
            <div className="text-xl font-black text-emerald-700 my-1">
              {toBengaliNumber(totalAvg.toFixed(0))} <span className="text-sm font-normal text-gray-600">টাকা</span>
            </div>
            <p className="text-xs text-gray-400">
              প্রতি {unitName}-এর হিসাবে
            </p>
          </div>
        </div>
      </section>

      {/* 4. বাজারভিত্তিক আজকের দাম (Table) */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-[#f9faf9] border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="py-3.5 px-6">বাজার</th>
                  <th className="py-3.5 px-6">বিভাগ</th>
                  <th className="py-3.5 px-6 text-right">সর্বনিম্ন</th>
                  <th className="py-3.5 px-6 text-right">সর্বাধিক</th>
                  <th className="py-3.5 px-6 text-right">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {markets.map((m, index) => {
                  const marketAvg = ((m.min + m.max) / 2).toFixed(2);
                  return (
                    <tr
                      key={`${m.market}-${index}`}
                      className="hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-semibold text-gray-900">
                        {m.market}
                      </td>
                      <td className="py-3.5 px-6 text-gray-500">
                        {m.division}
                      </td>
                      <td className="py-3.5 px-6 text-right font-medium text-gray-800">
                        {toBengaliNumber(m.min)} টাকা
                      </td>
                      <td className="py-3.5 px-6 text-right font-medium text-gray-800">
                        {toBengaliNumber(m.max)} টাকা
                      </td>
                      <td className="py-3.5 px-6 text-right font-bold text-gray-900">
                        {toBengaliNumber(marketAvg)} টাকা
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
