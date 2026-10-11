"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut, authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Controlled input with local override
  const [typedName, setTypedName] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const currentName = typedName ?? session?.user?.name ?? "";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentName.trim()) {
      toast.error("নাম ফাঁকা রাখা যাবে না");
      return;
    }

    setUpdating(true);
    try {
      const res = await authClient.updateUser({
        name: currentName.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "আপডেট করা যায়নি");
      } else {
        toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
        router.refresh();
      }
    } catch {
      toast.error("আপডেট ব্যর্থ হয়েছে");
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সাইন আউট সফল হয়েছে");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  const user = session?.user;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-2xl mx-auto px-4 pt-12 pb-20">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              আমার প্রোফাইল
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
            </p>
          </div>

          <div className="space-y-6">
            {/* User Info & Sign Out */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user?.name || "ইউজার প্রোফাইল"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-600">
                      {userInitial}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {user?.name || (isPending ? "লোড হচ্ছে..." : "ব্যবহারকারী")}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {user?.email || "ইমেইল পাওয়া যায়নি"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-center"
              >
                <span>↩</span>
                <span>সাইন আউট</span>
              </button>
            </div>

            {/* Profile Update Form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <h3 className="text-sm font-bold text-gray-900 mb-4">তথ্য</h3>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    নাম
                  </label>
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition placeholder:text-gray-400 bg-[#fbfdfb]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 rounded-xl bg-[#0f7a42] hover:bg-[#0c6637] text-white font-bold text-sm shadow-sm transition disabled:opacity-60 cursor-pointer"
                >
                  {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}