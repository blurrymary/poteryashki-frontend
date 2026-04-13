import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-3">Объявление отправлено!</h1>
      <p className="text-gray-600 mb-6">
        Ваше объявление принято и будет опубликовано после проверки. Мы отправим
        уведомление на ваш email.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          На главную
        </Link>
        <Link
          href="/listings"
          className="border border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          Все объявления
        </Link>
      </div>
    </div>
  );
}
