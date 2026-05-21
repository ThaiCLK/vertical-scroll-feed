import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VideoFeed",
  description: "Short video scrolling app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black text-white`}>
        <Navigation />
        {/*
         * Mobile:  full-width, full-height
         * PC:      đẩy nội dung sang phải 256px (w-64) để tránh Sidebar,
         *          rồi dùng flex center để căn giữa container 9:16
         */}
        <main className="h-screen w-full md:ml-64 flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
