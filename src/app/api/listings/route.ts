import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const type = formData.get("type") as string;
    const animal = formData.get("animal") as string;
    const description = formData.get("description") as string;
    const contact = formData.get("contact") as string;
    const email = formData.get("email") as string;

    if (!type || !animal || !description || !contact || !email) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 }
      );
    }

    // Generate listing ID
    const listingId = crypto.randomUUID();

    // Upload photo if provided
    let photoUrl: string | null = null;
    const photo = formData.get("photo") as File | null;
    if (photo && photo.size > 0) {
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Фото не должно превышать 5 МБ" },
          { status: 400 }
        );
      }

      const ext = photo.name.split(".").pop() || "jpg";
      const path = `${listingId}/photo.${ext}`;
      const buffer = Buffer.from(await photo.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from("animal-photos")
        .upload(path, buffer, { contentType: photo.type });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage
          .from("animal-photos")
          .getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }
    }

    // Insert listing
    const { error: insertError } = await supabaseAdmin
      .from("listings")
      .insert({
        id: listingId,
        type,
        animal,
        breed: (formData.get("breed") as string) || null,
        color: (formData.get("color") as string) || null,
        age: (formData.get("age") as string) || null,
        sex: (formData.get("sex") as string) || null,
        name: (formData.get("name") as string) || null,
        city: "Минск",
        district: (formData.get("district") as string) || null,
        features: (formData.get("features") as string) || null,
        description,
        contact,
        photo_url: photoUrl,
        source: "manual",
        moderation_status: "pending",
        status: "active",
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Ошибка сохранения: " + insertError.message },
        { status: 500 }
      );
    }

    // GPT moderation (async, don't wait)
    moderateWithGPT(listingId, description).catch(console.error);

    // Send confirmation email (async)
    sendConfirmationEmail(email, listingId).catch(console.error);

    return NextResponse.json({ id: listingId });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(email: string, listingId: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return;

  const resend = new Resend(RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://poteryashki-by.netlify.app";

  await resend.emails.send({
    from: "Потеряшки BY <onboarding@resend.dev>",
    to: email,
    subject: "Ваше объявление принято",
    html: `
      <h2>Спасибо за ваше объявление!</h2>
      <p>Ваше объявление принято и будет опубликовано после проверки модератором.</p>
      <p>Ссылка на объявление: <a href="${siteUrl}/listings/${listingId}">${siteUrl}/listings/${listingId}</a></p>
      <p>Обычно проверка занимает несколько минут.</p>
      <br>
      <p>С уважением,<br>Команда Потеряшки BY</p>
    `,
  });
}

async function moderateWithGPT(listingId: string, text: string) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'Ты модератор сайта о пропавших животных. Проверь объявление. Отклони если: спам, реклама, не связано с животными, оскорбительный контент. Одобри если: реальное объявление о пропаже, находке или передаче животного. Верни ТОЛЬКО JSON: {"decision": "approved" | "rejected", "reason": "причина если rejected"}',
          },
          { role: "user", content: `Объявление: ${text}` },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
      }),
    });

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);

    await supabaseAdmin
      .from("listings")
      .update({ moderation_status: result.decision })
      .eq("id", listingId);
  } catch (err) {
    console.error("GPT moderation error:", err);
  }
}
