import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Google Fonts üzerinden Inter fontunu optimize edilmiş şekilde çekiyoruz
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "İşçi Ağı | Dayanışma ve Şeffaflık Platformu",
  description: "İş yerlerini inceleyin, çalışma şartlarını görün, isterseniz tamamen anonim kalarak deneyimlerinizi aktarın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-background text-foreground min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
