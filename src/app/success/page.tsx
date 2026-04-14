import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="surface rounded-xl p-10">
        <div className="w-12 h-12 rounded-full bg-[var(--green)]/15 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-[var(--green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Объявление отправлено</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">
          Будет опубликовано после проверки. Уведомление придёт на email.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="btn-primary px-5 py-2 rounded-lg text-sm">
            Главная
          </Link>
          <Link href="/listings" className="btn-ghost px-5 py-2 rounded-lg text-sm">
            Объявления
          </Link>
        </div>
      </div>
    </div>
  );
}
