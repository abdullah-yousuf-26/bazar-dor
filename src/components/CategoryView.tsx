"use client";

import { useState, useMemo } from "react";
import ProductCard, { Product } from "./ProductCard";
import { toBengaliNumber } from "@/lib/bengali";

interface CategoryViewProps {
  products: Product[];
  categoryName: string;
  categoryIcon: string;
}

export default function CategoryView({
  products,
  categoryName,
  categoryIcon,
}: CategoryViewProps) {
  const [sortOption, setSortOption] = useState<"default" | "asc" | "desc">("default");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortOption === "asc") {
      return list.sort((a, b) => (a.today ?? 0) - (b.today ?? 0));
    }
    if (sortOption === "desc") {
      return list.sort((a, b) => (b.today ?? 0) - (a.today ?? 0));
    }
    return list;
  }, [products, sortOption]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Category Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shrink-0 shadow-inner">
          {categoryIcon}
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {categoryName}
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            প্রতি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      {/* 2. Sort Toolbar Card */}
      <div className="bg-white rounded-2xl px-5 py-3.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-end gap-3">
        <span className="text-xs font-medium text-gray-500">সাজান</span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "default" | "asc" | "desc")}
          className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-600 cursor-pointer"
        >
          <option value="default">ডিফল্ট</option>
          <option value="asc">দাম: কম থেকে বেশি</option>
          <option value="desc">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {/* 3. Counter Text */}
      <div>
        <p className="text-xs text-gray-500 font-medium">
          মোট {toBengaliNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id || product.slug}
            product={product}
          />
        ))}
      </div>
    </main>
  );
}
