"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getBengaliDate } from "@/lib/bengali";

export default function Hero() {
  const [banglaDate, setBanglaDate] = useState("মঙ্গলবার, ৬ অক্টোবর, ২০২৬");

  useEffect(() => {

    // working dont touch

    setBanglaDate(getBengaliDate(new Date()));
  }, []);

  const handleScrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("সব-পণ্য");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 pb-4">
      <div className="bg-[#f2f7f3] border border-[#e2ece4] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        
        
{/* Left side */}
        <div className="flex-1 max-w-xl space-y-4">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-medium px-3.5 py-1 rounded-full">
            {banglaDate}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত,
            গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="pt-2">
            <a
              href="#সব-পণ্য"
              onClick={handleScrollToProducts}
              className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm sm:text-base px-6 py-3 rounded-xl transition duration-200 shadow-sm cursor-pointer"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

      {/* Hero Banner Image JPG */}


        <div className="w-full md:w-auto flex justify-center items-center">
          <div className="relative w-64 h-52 sm:w-80 sm:h-64">
            <Image
              src="/bazar-hero.png"
              alt="বাজার দর হিরো ব্যানার"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
