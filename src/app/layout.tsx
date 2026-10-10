import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "বাজার দর | আজকের বাজার দর এক নজরে",
  description: "নিত্যপ্রয়োজনীয় পণ্যের বাজার দর এক নজরে",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="antialiased bg-[#f8faf8] text-gray-900">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
