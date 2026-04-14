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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <span className="text-black text-sm font-bold">P</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">Потеряшки BY</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/listings"
            className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm transition-colors"
          >
            Объявления
          </Link>
          <Link
            href="/new"
            className="btn-primary px-4 py-1.5 rounded-lg text-sm"
          >
            Подать
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] py-6 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-[var(--text-muted)]">
            Потеряшки BY &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}
