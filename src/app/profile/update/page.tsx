"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession, updateUser } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/signin");
      } else if (session.user.name && !name) {

        // stil working

        setName(session.user.name);
      }
    }
  }, [session, isPending, router, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }

    setLoading(true);
    try {
        
      //  API call
      const res = await updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "তথ্য আপডেট করা যায়নি");
      } else {
        toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              তথ্য পরিবর্তন করুন
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  নাম
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition placeholder:text-gray-400 bg-[#fbfdfb]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 rounded-xl bg-[#0f7a42] hover:bg-[#0c6637] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? "আপডেট হচ্ছে..." : "Update Information"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <Link
                href="/profile"
                className="text-xs text-gray-400 hover:text-gray-700 transition"
              >
                বাতিল করুন এবং প্রোফাইলে ফিরে যান
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
