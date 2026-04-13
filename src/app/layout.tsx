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
    <header className="glass-strong sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl animate-float">🐾</span>
          <span className="text-xl font-bold gradient-text">
            Потеряшки BY
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/listings"
            className="text-gray-600 hover:text-violet-600 text-sm font-medium transition-colors"
          >
            Все объявления
          </Link>
          <Link
            href="/new"
            className="gradient-primary btn-shimmer text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-all"
          >
            Подать объявление
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
        <footer className="glass mt-12 py-6">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            <span className="gradient-text font-semibold">Потеряшки BY</span>{" "}
            &copy; {new Date().getFullYear()} — Помогаем воссоединять питомцев
            с хозяевами 💜
          </div>
        </footer>
      </body>
    </html>
  );
}
