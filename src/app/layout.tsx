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
        <main className="h-screen w-full md:ml-64 flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
