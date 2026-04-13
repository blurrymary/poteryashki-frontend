import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="glass-strong rounded-3xl p-10 shadow-lg shadow-violet-100/20">
        <div className="text-6xl mb-5 animate-float">🎉</div>
        <h1 className="text-2xl font-bold mb-3">
          <span className="gradient-text">Объявление отправлено!</span>
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Ваше объявление принято и будет опубликовано после проверки. Мы
          отправим уведомление на ваш email.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="gradient-primary btn-shimmer text-white px-6 py-2.5 rounded-full font-semibold shadow-md shadow-orange-200 hover:shadow-lg transition-all"
          >
            На главную
          </Link>
          <Link
            href="/listings"
            className="glass hover:bg-white/90 text-gray-700 px-6 py-2.5 rounded-full font-semibold transition-all"
          >
            Все объявления
          </Link>
        </div>
      </div>
    </div>
  );
}
