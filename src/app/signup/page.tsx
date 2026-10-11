"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUp, signIn } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম প্রদান করুন");
      return;
    }
    if (!email.trim()) {
      toast.error("ইমেইল প্রদান করুন");
      return;
    }
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মেলেনি");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      toast.error(`${provider} দিয়ে সাইন ইন ব্যর্থ হয়েছে`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-md mx-auto px-4 pt-10 pb-16 flex flex-col items-center">
          {/* Header Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 font-medium">
              বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
            </p>
          </div>

          {/* Form Card */}
          <div className="w-full bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  নাম
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রহিম উদ্দিন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition placeholder:text-gray-400 bg-[#fbfdfb]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  ইমেইল
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition placeholder:text-gray-400 bg-[#fbfdfb]"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition placeholder:text-gray-400 bg-[#fbfdfb]"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  type="password"
                  placeholder="আবার লিখুন"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition placeholder:text-gray-400 bg-[#fbfdfb]"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 rounded-xl bg-[#0f7a42] hover:bg-[#0c6637] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <span className="relative bg-white px-3 text-[11px] text-gray-400 font-medium">
                অথবা
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-sm font-bold text-[#EA4335]">G</span>
                <span>Google দিয়ে চালিয়ে যান</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignIn("github")}
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <span className="text-sm">🐙</span>
                <span>GitHub দিয়ে চালিয়ে যান</span>
              </button>
            </div>

            {/* Switch to Sign In */}
            <p className="text-center text-xs text-gray-500 mt-6">
              অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/signin"
                className="text-[#0f7a42] font-bold hover:underline"
              >
                সাইন ইন করুন
              </Link>
            </p>
          </div>

          {/* Back Link */}
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-800 transition mt-6 flex items-center gap-1"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </main>
      </div>

      <Footer />
    </div>
  );
}
