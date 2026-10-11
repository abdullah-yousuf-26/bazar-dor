"use client";

import ProductCard, { Product } from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { toBengaliNumber } from "@/lib/bengali";

interface Props {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductSections({ products = [], isLoading = false }: Props) {
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  const safeProducts = Array.isArray(products) ? products : [];

  // Top 6 Risers (dir === "up" or pct > 0, highest pct first)
  const risers = safeProducts
    .filter((p) => (p.change?.pct ?? 0) > 0)
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  // Top 6 Fallers (dir === "down" or pct < 0, greatest drops first)
  const fallers = safeProducts
    .filter((p) => (p.change?.pct ?? 0) < 0)
    .sort((a, b) => (a.change?.pct ?? 0) - (b.change?.pct ?? 0))
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* 1. আজ দাম বেড়েছে */}
      {risers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-rose-500 font-bold text-sm">▲</span>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              আজ দাম বেড়েছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {risers.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 2. আজ দাম কমেছে */}
      {fallers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 font-bold text-sm">▼</span>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              আজ দাম কমেছে
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fallers.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 3. সব পণ্য */}
      <section id="সব-পণ্য" className="scroll-mt-24">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            সব পণ্য
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            মোট {toBengaliNumber(safeProducts.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {safeProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
