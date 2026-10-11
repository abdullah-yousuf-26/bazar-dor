import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailsView from "@/components/ProductDetailsView";
import { Product } from "@/components/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
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

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({
    slug: p.slug || String(p.id),
  }));
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allProducts = await getAllProducts();

  // Find product by slug or ID
  const product = allProducts.find(
    (p) => p.slug === slug || String(p.id) === slug
  );

  if (!product) {
    notFound();
  }

  return <ProductDetailsView product={product} />;
}

export default async function ProductDetailPage({ params }: PageProps) {
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
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 bg-white rounded-3xl border border-gray-100 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse"
                  />
                ))}
              </div>
            </div>
          }
        >
          <ProductContent params={params} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
