"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ANIMAL_OPTIONS, MINSK_DISTRICTS } from "@/lib/types";

export default function NewListingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка при отправке");
      }

      router.push("/success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Подать объявление</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
      >
        {/* Type */}
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">
            Тип объявления *
          </legend>
          <div className="flex gap-4">
            {[
              { value: "lost", label: "Пропал" },
              { value: "found", label: "Найден" },
              { value: "give_away", label: "Отдам в добрые руки" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="type"
                  value={value}
                  required
                  className="text-orange-500"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Animal */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Животное *
          </label>
          <select
            name="animal"
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Выберите</option>
            {ANIMAL_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Кличка</label>
          <input
            type="text"
            name="name"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Необязательно"
          />
        </div>

        {/* Breed */}
        <div>
          <label className="text-sm font-medium text-gray-700">Порода</label>
          <input
            type="text"
            name="breed"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Необязательно"
          />
        </div>

        {/* Color */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Цвет / окрас
          </label>
          <input
            type="text"
            name="color"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* District */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Район Минска
          </label>
          <select
            name="district"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Выберите район</option>
            {MINSK_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Features */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Особые приметы
          </label>
          <textarea
            name="features"
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Шрам на ухе, ошейник красного цвета..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Описание ситуации *
          </label>
          <textarea
            name="description"
            rows={3}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Опишите обстоятельства..."
          />
        </div>

        {/* Photo */}
        <div>
          <label className="text-sm font-medium text-gray-700">Фото</label>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png"
            className="mt-1 block w-full text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">JPG или PNG, до 5 МБ</p>
        </div>

        {/* Contact */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Контакт (телефон или @username) *
          </label>
          <input
            type="text"
            name="contact"
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="+375291234567 или @username"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email для уведомления *
          </label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="your@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {submitting ? "Отправка..." : "Подать объявление"}
        </button>
      </form>
    </div>
  );
}
