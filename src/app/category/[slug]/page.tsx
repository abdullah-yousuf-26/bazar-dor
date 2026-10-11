import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryView from "@/components/CategoryView";
import { Product } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || json?.products || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const matchedCategory = CATEGORIES.find((c) => c.slug === slug);
  if (!matchedCategory) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const filteredProducts = allProducts.filter((p) => p.category === slug);

  return (
    <CategoryView
      products={filteredProducts}
      categoryName={matchedCategory.name}
      categoryIcon={matchedCategory.icon}
    />
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const allProducts = await getAllProducts();

  const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  const tickerItems = allProducts.map((p: Product) => ({
    id: p.id,
    name: p.nameBn,
    price: p.today,
    unit: unitMap[p.unit] || p.unit,
    change: p.change?.pct ?? 0,
    emoji: p.image || p.categoryIcon,
  }));

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar tickerItems={tickerItems} />
        <Suspense
          fallback={
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="h-28 bg-white rounded-3xl border border-gray-100 animate-pulse mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-36 bg-white rounded-2xl border border-gray-100 animate-pulse"
                  />
                ))}
              </div>
            </div>
          }
        >
          <CategoryContent params={params} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
