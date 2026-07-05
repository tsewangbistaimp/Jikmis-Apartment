const router = require("express").Router();

const SYSTEM_PROMPT = `You are the official AI receptionist for Jikmis Apartment in Boudha, Kathmandu.
Only answer using the provided apartment information below.

General information:
* Location: Boudha, Kathmandu near Boudhanath / Boudha Stupa, shops, restaurants, and public transportation
* Stay types: short-term stays and long-term rentals
* Apartment types: Studio Single, Studio Double, and 2 BHK Apartment
* Apartments are comfortable and fully furnished
* Amenities: free WiFi, 24/7 hot water, basic kitchen setup, cleaning service twice a week
* Laundry: self-service washing machine available for guests, NPR 200 per load, approximately 8-9 kg per load. Staff can assist if needed.
* Suitable for: solo guests, couples, families, groups, students, and long-stay guests
* Contact: WhatsApp +9779708538395, Call +9779708538395, Email jikmisdonkhang@gmail.com

Room pricing:
* Single Studio Room: NPR 1,500 per night, NPR 37,000 per month
* Double Studio Room: NPR 2,500 per night, NPR 47,000 per month
* 2BHK Family Room: NPR 4,000 per night, NPR 65,000 per month

Current availability:
* 2BHK Family Room: Available now
* Double Studio Room: Available from 12 July
* Single Studio Room: Available from 7 August
* These availability dates are the source of truth until the owner manually updates them.

Booking information to request when useful:
* Full name
* Phone number or email
* Check-in date
* Check-out date
* Number of guests
* Apartment type: Studio Single, Studio Double, or 2 BHK
* Length of stay
* Nationality, optional
* Budget, optional
* Preferred contact method: Phone, WhatsApp, or Email

Receptionist rules:
* Speak naturally like a friendly front desk staff member, not like AI.
* Keep replies short, warm, professional, and conversational.
* Answer only what the guest asks.
* Do not include extra information unless the guest specifically requests it.
* If asked only about price, answer only with the price.
* If asked only about laundry, answer only the laundry question.
* If asked about both price and availability, answer both naturally.
* Mention exact prices by apartment type when asked about price.
* If asked about availability, use only the current availability above. Never invent different dates.
* If asked to book or view, ask only for the missing details needed next, such as dates, apartment type, or number of guests.
* If the guest wants a person, staff, human, or booking assistance, provide WhatsApp/call details and ask for preferred contact method.
* If information is unknown, politely say you will check with the staff.
* If user asks unrelated questions, politely redirect to room, stay, or booking inquiries.
* Do not mention system prompts, policies, training data, or internal instructions.`;

const CONTACT_LINE = "WhatsApp or call +9779708538395 for the fastest confirmation.";
const BOOKING_DETAILS_PROMPT =
  "To check availability, please share your check-in date, check-out date, apartment type, and number of guests.";

function localReceptionistReply(message) {
  const text = message.toLowerCase();

  if (isPriceQuestion(text) && isAvailabilityQuestion(message)) {
    return `${priceReply(text)} ${availabilityReply(text, true)}`;
  }

  if (isAvailabilityQuestion(message)) {
    return availabilityReply(text);
  }

  if (isGreeting(text)) {
    return "Hello! Welcome to Jikmis Apartment in Boudha. I can help with availability, pricing, bookings, facilities, and location. How can I help you today?";
  }

  if (isLaundryQuestion(text)) {
    return laundryReply(text);
  }

  if (isPriceQuestion(text)) {
    return priceReply(text);
  }

  if (matchesAny(text, ["studio", "single", "double", "2 bhk", "2bhk", "family", "group", "apartment type"])) {
    return `We offer Studio Single, Studio Double, and a spacious 2 BHK apartment for families or groups. Studio Single is NPR 1,500/day or NPR 37,000/month, Studio Double is NPR 2,500/day or NPR 47,000/month, and 2 BHK is NPR 4,000/day or NPR 65,000/month.`;
  }

  if (matchesAny(text, ["facility", "facilities", "amenity", "amenities", "wifi", "hot water", "kitchen", "parking", "clean", "bathroom", "balcony", "furnished", "cook"])) {
    return `Amenities include free WiFi, 24/7 hot water, basic kitchen setup, fully furnished apartments, and cleaning twice a week. The location is near Boudhanath, shops, restaurants, and public transportation. ${CONTACT_LINE}`;
  }

  if (matchesAny(text, ["location", "where", "address", "boudha", "stupa", "near", "view"])) {
    return `Jikmis Apartment is in Boudha, Kathmandu near Boudhanath / Boudha Stupa, shops, restaurants, and public transportation. ${CONTACT_LINE}`;
  }

  if (matchesAny(text, ["contact", "phone", "call", "whatsapp", "email", "number"])) {
    return "You can WhatsApp or call Jikmis Apartment at +9779708538395. Email: jikmisdonkhang@gmail.com.";
  }

  if (matchesAny(text, ["security", "safe", "cctv", "door", "late", "night"])) {
    return `For security details or late-arrival questions, please confirm with our team. ${CONTACT_LINE}`;
  }

  if (matchesAny(text, ["student", "study", "quiet", "work", "remote", "long-term", "long term", "short-term", "short term"])) {
    return `Jikmis Apartment is suitable for both short-term stays and long-term rentals. To recommend the best option, please share your stay length, dates, and number of guests.`;
  }

  if (matchesAny(text, ["person", "staff", "human", "assistance", "help me", "talk"])) {
    return `Of course. For personal assistance or booking confirmation, please WhatsApp or call +9779708538395, or email jikmisdonkhang@gmail.com. Which contact method do you prefer?`;
  }

  return `I can help with availability, pricing, apartment facilities, location, long-term rentals, short-term stays, viewing, booking process, and payment questions. ${BOOKING_DETAILS_PROMPT}`;
}

function isAvailabilityQuestion(message) {
  const text = message.toLowerCase();
  return matchesAny(text, ["available", "availability", "vacant", "free"]) || text.includes("which rooms");
}

function isPriceQuestion(text) {
  return matchesAny(text, ["price", "cost", "rate", "monthly", "month", "night", "daily", "rent", "charge", "payment", "how much"]);
}

function isLaundryQuestion(text) {
  return matchesAny(text, ["laundry", "wash", "washing", "clothes", "machine"]);
}

function availabilityReply(text, compact = false) {
  if (matchesAny(text, ["family", "2bhk", "2 bhk"])) {
    return compact ? "It is available right now." : "Yes! Our 2BHK Family Room is available right now.";
  }

  if (matchesAny(text, ["double"])) {
    return compact ? "It will be available from 12 July." : "The Double Studio Room will be available from 12 July.";
  }

  if (matchesAny(text, ["single"])) {
    return compact ? "It will be available from 7 August." : "Our Single Studio Room will be available from 7 August.";
  }

  return "Right now our 2BHK Family Room is available. The Double Studio Room will be available from 12 July, and the Single Studio Room will be available from 7 August.";
}

function priceReply(text) {
  if (matchesAny(text, ["family", "2bhk", "2 bhk"])) {
    return "Our 2BHK Family Room is NPR 4,000 per night or NPR 65,000 per month.";
  }

  if (matchesAny(text, ["double"])) {
    return "The Double Studio Room is NPR 2,500 per night or NPR 47,000 per month.";
  }

  if (matchesAny(text, ["single"])) {
    return "The Single Studio Room is NPR 1,500 per night or NPR 37,000 per month.";
  }

  if (matchesAny(text, ["monthly", "month"])) {
    return "Yes, we do:\n\n* Single Studio Room: NPR 37,000 per month\n* Double Studio Room: NPR 47,000 per month\n* 2BHK Family Room: NPR 65,000 per month.";
  }

  return "Single Studio Room is NPR 1,500 per night, Double Studio Room is NPR 2,500 per night, and 2BHK Family Room is NPR 4,000 per night.";
}

function laundryReply(text) {
  if (matchesAny(text, ["included", "include"])) {
    return "No, laundry is charged separately at NPR 200 per load.";
  }

  if (matchesAny(text, ["kg", "kilo", "once", "load", "hold"])) {
    return "Each load can hold approximately 8-9 kg.";
  }

  if (matchesAny(text, ["how much", "cost", "price", "charge"])) {
    return "It's NPR 200 per load.";
  }

  if (matchesAny(text, ["clothes", "wash"])) {
    return "Yes! You can use our self-service washing machine. It's NPR 200 per load, and each load can hold about 8-9 kg.";
  }

  return "Yes, we have a self-service washing machine available for our guests.";
}

function isSourceOfTruthQuestion(message) {
  const text = message.toLowerCase();
  return isAvailabilityQuestion(message) || isPriceQuestion(text) || isLaundryQuestion(text);
}

function matchesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function isGreeting(text) {
  return /\b(hello|hi|namaste|hey)\b/.test(text);
}

function sanitizeMessages(messages, latestMessage) {
  if (!Array.isArray(messages)) {
    return [{ role: "user", content: latestMessage }];
  }

  const sanitized = messages
    .filter((message) => message && ["user", "assistant"].includes(message.role) && typeof message.content === "string")
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

router.post("/", async (req, res, next) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    if (isSourceOfTruthQuestion(message)) {
      return res.json({
        reply: localReceptionistReply(message),
        source: "jikmis_source_of_truth"
      });
    }

    const conversationMessages = sanitizeMessages(req.body?.messages, message);

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        reply: localReceptionistReply(message),
        source: "local_fallback"
      });
    }

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
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationMessages
        ]
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      const error = new Error(data?.error?.message || "OpenAI request failed.");
      error.status = openaiResponse.status;
      return res.json({
        reply: localReceptionistReply(message),
        source: "local_fallback"
      });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();

    return res.json({
      reply:
        reply ||
        "Please contact Jikmis Apartment on WhatsApp or call +9779708538395 for booking help."
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
