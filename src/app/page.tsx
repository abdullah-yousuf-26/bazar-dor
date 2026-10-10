import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const demoTicker = [
  { name: "স্বর্ণমাছি চাল", price: 64, unit: "কেজি", change: 2.1, emoji: "🍚" },
  { name: "মিনিকেট চাল", price: 99, unit: "কেজি", change: -2.9, emoji: "🍚" },
  { name: "বাটাম সাইজ চাল", price: 66, unit: "কেজি", change: 3.5, emoji: "🍚" },
  { name: "মসুর ডাল", price: 142, unit: "কেজি", change: 2.9, emoji: "🫘" },
  { name: "ছোলা", price: 120, unit: "কেজি", change: -2.4, emoji: "🫘" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <Navbar tickerItems={demoTicker} />
      <Hero />
      
      {/* Anchor Section target for CTA test */}
      <div id="সব-পণ্য" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-xl font-bold text-gray-900">সব পণ্য সেকশন</h2>
      </div>
    </div>
  );
}
