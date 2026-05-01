// apps/b2c-portal/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Demo Logistics | Customer Portal",
  description: "Track packages and submit pre-alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen overflow-hidden antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
