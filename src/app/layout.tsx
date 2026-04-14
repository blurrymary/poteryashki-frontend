import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Потеряшки BY — Пропавшие и найденные животные",
  description:
    "Агрегатор объявлений о пропавших и найденных животных в Беларуси",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 21c-1.5 0-3-1-3-2.5S12 16 12 16s3 1 3 2.5S13.5 21 12 21z"/>
            <circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/>
            <path d="M8 14c-2 0-4-1-4-3s2-3 4-3" transform="rotate(-20 8 11)"/>
            <path d="M16 14c2 0 4-1 4-3s-2-3-4-3" transform="rotate(20 16 11)"/>
          </svg>
          <span className="font-bold text-lg">Потеряшки</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/listings" className="text-[var(--text-secondary)] hover:text-[var(--text)] text-sm font-medium transition-colors">
            Объявления
          </Link>
          <Link href="/new" className="btn-primary px-4 py-2 text-sm">
            Подать объявление
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[var(--text)]">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Потеряшки BY &middot; Помогаем воссоединять питомцев с хозяевами
          </div>
        </footer>
      </body>
    </html>
  );
}
