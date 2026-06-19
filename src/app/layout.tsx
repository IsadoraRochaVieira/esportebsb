import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Esporte Brasília — Encontre jogos no DF",
  description: "Encontre e crie jogos de futsal, tênis, vôlei, basquete e mais em Brasília. A rede social dos esportes do DF — saúde, comunidade e movimento.",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Esporte Brasília" },
  openGraph: {
    title: "Esporte Brasília",
    description: "A rede social dos esportes de Brasília — saúde, comunidade e movimento.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
