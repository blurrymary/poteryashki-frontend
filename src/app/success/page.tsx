import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Объявление отправлено</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Будет опубликовано после проверки. Уведомление придёт на email.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/" className="btn-primary px-6 py-2.5 text-sm">Главная</Link>
        <Link href="/listings" className="btn-secondary px-6 py-2.5 text-sm">Объявления</Link>
      </div>
    </div>
  );
}
