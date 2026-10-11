import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSections from "@/components/ProductSections";
import Footer from "@/components/Footer";
import { Product } from "@/components/ProductCard";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || json?.products || [];
  } catch (error) {
    console.error("API fetch failed:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  const tickerItems = products.map((p: Product) => ({
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
        <Hero />
        <ProductSections products={products} />
      </div>
      <Footer />
    </div>
  );
}