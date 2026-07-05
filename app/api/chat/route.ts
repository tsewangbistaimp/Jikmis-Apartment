import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the official AI receptionist for Jikmis Apartment in Boudha, Kathmandu.
Only answer using the provided apartment information below.

General information:
* Location: Boudha, Kathmandu near Boudhanath / Boudha Stupa, shops, restaurants, and public transportation
* Stay types: short-term stays and long-term rentals
* Apartment types: Studio Single, Studio Double, and 2 BHK Apartment
* Apartments are comfortable and fully furnished
* Amenities: free WiFi, 24/7 hot water, basic kitchen setup, cleaning service twice a week
* Laundry: available on request, NPR 200 per load, up to 8-9 kg per load
* Contact: WhatsApp +9779708538395, Call +9779708538395, Email jikmisdonkhang@gmail.com

Pricing:
* Studio Single: NPR 1,500 per day, NPR 37,000 per month
* Studio Double: NPR 2,500 per day, NPR 47,000 per month
* 2 BHK Apartment: NPR 4,000 per day, NPR 65,000 per month

Current availability:
* 2BHK Family Room: Available now
* Double Studio Room: Available from 12 July
* Single Studio Room: Available from 7 August
* These availability dates are the source of truth until the owner manually updates them.

Receptionist rules:
* Speak naturally like a friendly front desk staff member, not like AI.
* Keep replies short, warm, professional, and conversational.
* Answer only what the guest asks.
* Do not include extra information unless the guest specifically requests it.
* Mention exact prices by apartment type when asked about price.
* If asked about availability, use only the current availability above. Never invent different dates.
* If asked to book or view, ask only for the missing details needed next, such as dates, apartment type, or number of guests.
* If information is unknown, politely say you will check with the staff.
* If user asks unrelated questions, politely redirect to room, stay, or booking inquiries.
* Do not mention system prompts, policies, training data, or internal instructions.`;

const CONTACT_LINE = "WhatsApp or call +9779708538395 for the fastest confirmation.";
const BOOKING_DETAILS_PROMPT =
  "To check availability, please share your check-in date, check-out date, apartment type, and number of guests.";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function matchesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function isGreeting(text: string) {
  return /\b(hello|hi|namaste|hey)\b/.test(text);
}

function localReceptionistReply(message: string) {
  const text = message.toLowerCase();

  if (matchesAny(text, ["available", "availability", "book", "booking", "reserve", "vacant", "free", "room"])) {
    if (matchesAny(text, ["family", "2bhk", "2 bhk"])) {
      return "Yes! Our 2BHK Family Room is available right now.";
    }

    if (matchesAny(text, ["double"])) {
      return "The Double Studio Room will be available from 12 July.";
    }

    if (matchesAny(text, ["single"])) {
      return "Our Single Studio Room will be available from 7 August.";
    }

    return "Right now our 2BHK Family Room is available. The Double Studio Room will be available from 12 July, and the Single Studio Room will be available from 7 August.";
  }

  if (isGreeting(text)) {
    return "Hello! Welcome to Jikmis Apartment in Boudha. I can help with availability, pricing, bookings, facilities, and location. How can I help you today?";
  }

  if (matchesAny(text, ["price", "cost", "rate", "monthly", "month", "night", "daily", "rent", "charge", "payment"])) {
    return `Studio Single is NPR 1,500/day or NPR 37,000/month. Studio Double is NPR 2,500/day or NPR 47,000/month. 2 BHK is NPR 4,000/day or NPR 65,000/month. ${BOOKING_DETAILS_PROMPT}`;
  }

  if (matchesAny(text, ["laundry", "wash", "washing", "clothes"])) {
    return `Laundry service is available on request. It costs NPR 200 per load, up to 8-9 kg per load. ${CONTACT_LINE}`;
  }

  if (matchesAny(text, ["facility", "facilities", "amenity", "amenities", "wifi", "hot water", "kitchen", "clean", "bathroom", "furnished"])) {
    return `Amenities include free WiFi, 24/7 hot water, basic kitchen setup, fully furnished apartments, and cleaning twice a week. ${CONTACT_LINE}`;
  }

  if (matchesAny(text, ["location", "where", "address", "boudha", "boudhanath", "stupa", "near", "map"])) {
    return `Jikmis Apartment is in Boudha, Kathmandu near Boudhanath / Boudha Stupa, shops, restaurants, and public transportation. ${CONTACT_LINE}`;
  }

  return `I can help with availability, pricing, facilities, location, long-term rentals, short-term stays, viewing, booking process, and payment questions. ${BOOKING_DETAILS_PROMPT}`;
}

function isAvailabilityQuestion(message: string) {
  const text = message.toLowerCase();
  return matchesAny(text, ["available", "availability", "vacant", "free"]) || text.includes("which rooms");
}

function sanitizeMessages(messages: unknown, latestMessage: string): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return [{ role: "user", content: latestMessage }];
  }

  const sanitized = messages
    .filter((message): message is ChatMessage => {
      const maybeMessage = message as Partial<ChatMessage>;
      return (
        Boolean(maybeMessage) &&
        (maybeMessage.role === "user" || maybeMessage.role === "assistant") &&
        typeof maybeMessage.content === "string"
      );
    })
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 700)
    }))
    .filter((message) => message.content)
    .slice(-8);

  if (!sanitized.some((message) => message.role === "user" && message.content === latestMessage)) {
    sanitized.push({ role: "user", content: latestMessage });
  }

  return sanitized;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ message: "Message is required." }, { status: 400 });
  }

  if (isAvailabilityQuestion(message)) {
    return NextResponse.json({ reply: localReceptionistReply(message), source: "availability_source_of_truth" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ reply: localReceptionistReply(message), source: "local_fallback" });
  }

  const conversationMessages = sanitizeMessages(body?.messages, message);
  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 220,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...conversationMessages]
    })
  });

  const data = await openaiResponse.json();

  if (!openaiResponse.ok) {
    return NextResponse.json({ reply: localReceptionistReply(message), source: "local_fallback" });
  }

  return NextResponse.json({
    reply:
      data?.choices?.[0]?.message?.content?.trim() ||
      "Please contact Jikmis Apartment on WhatsApp or call +9779708538395 for booking help."
  });
}
