"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Edit3 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";


  const formattedJoinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("bn-BD")
    : "উপলব্ধ নয়";

  return (
    <div className="min-h-screen bg-[#f8faf8] text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#e8f5e9] border-2 border-emerald-300 flex items-center justify-center shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#0f7a42]">
                    {userInitial}
                  </span>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-gray-800">নাম:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-gray-800">ইমেইল:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-gray-800">যোগদান:</span>
                <span>{formattedJoinedDate}</span>
              </div>
            </div>

            {/* info change btn*/}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Link
                href="/profile/update"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f7a42] hover:bg-[#0c6637] text-white text-xs font-bold shadow-sm transition"
              >
                <Edit3 className="w-4 h-4" />
                তথ্য পরিবর্তন করুন
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}