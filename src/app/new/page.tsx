"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ANIMAL_OPTIONS,
  SEX_OPTIONS,
  BREED_OPTIONS_CAT,
  BREED_OPTIONS_DOG,
  COLOR_OPTIONS,
  AGE_OPTIONS,
  MINSK_DISTRICTS,
} from "@/lib/types";

export default function NewListingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState("");

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
      <h1 className="text-2xl font-bold mb-6">
        <span className="gradient-text">Подать объявление</span>
      </h1>

      {error && (
        <div className="bg-red-50/80 backdrop-blur border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass-strong rounded-2xl p-6 space-y-5 shadow-lg shadow-violet-100/20"
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
              { value: "help", label: "Нужна помощь" },
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
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
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

        {/* Sex */}
        <div>
          <label className="text-sm font-medium text-gray-700">Пол</label>
          <select
            name="sex"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Не знаю</option>
            {SEX_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Breed */}
        <div>
          <label className="text-sm font-medium text-gray-700">Порода</label>
          <select
            name="breed"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Выберите породу</option>
            {(selectedAnimal === "кошка"
              ? BREED_OPTIONS_CAT
              : selectedAnimal === "собака"
                ? BREED_OPTIONS_DOG
                : [...new Set([...BREED_OPTIONS_CAT, ...BREED_OPTIONS_DOG])].sort()
            ).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Цвет / окрас
          </label>
          <select
            name="color"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Выберите окрас</option>
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Возраст (примерно)
          </label>
          <select
            name="age"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Не знаю</option>
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Event date */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Дата и время (когда пропал / нашли)
          </label>
          <input
            type="text"
            name="event_date"
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Например: 12 апреля 2026, около 18:00"
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
          className="w-full gradient-primary btn-shimmer disabled:opacity-50 text-white py-3 rounded-full font-semibold shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-all text-base"
        >
          {submitting ? "Отправка..." : "Подать объявление"}
        </button>
      </form>
    </div>
  );
}
