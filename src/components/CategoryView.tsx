"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
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



  // handles number & raw strings )

  
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortOption === "asc") {
      return list.sort((a, b) => Number(a.today ?? 0) - Number(b.today ?? 0));
    }
    if (sortOption === "desc") {
      return list.sort((a, b) => Number(b.today ?? 0) - Number(a.today ?? 0));
    }
    return list;
  }, [products, sortOption]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      
{/* 1. category card */}
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

{/* 2. sorting toolbar*/}


      <div className="bg-white rounded-2xl px-5 py-3.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-end gap-3">
        <span className="text-xs font-medium text-gray-500">সাজান</span>
        <div className="relative inline-block">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as "default" | "asc" | "desc")}
            className="appearance-none text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>


      <div>
        <p className="text-xs text-gray-500 font-medium">
          মোট {toBengaliNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>
      </div>



{/* 4. grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
