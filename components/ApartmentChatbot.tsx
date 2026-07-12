"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Mail, MessageCircle, Phone, Send, X } from "lucide-react";
import { FORMSPREE_ENDPOINT, INQUIRY_EMAIL, WHATSAPP_NUMBER } from "@/lib/site";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  content: string;
};

const quickReplies = ["Pricing", "Availability", "Booking", "Room details", "Facilities", "Rules", "Location"];

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Hello! Namaste, Tashi delek, Namaskar. Welcome to Jikmis Apartment in Boudha. Ask me about rooms, pricing, availability, booking, facilities, location, or house rules."
  }
];

const chatEndpoint = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/chat` : "/api/chat";
const helperNoteStorageKey = "jikmis-chat-helper-note-dismissed";
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?977[-\s]?)?9\d{9}|\+?\d[\d\-\s]{7,14}\d/;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderMessageContent(content: string) {
  const parts = content.split(URL_REGEX);
  return parts.map((part, index) =>
    /^https?:\/\//.test(part) ? (
      <a key={index} href={part} target="_blank" rel="noreferrer">
        {part}
      </a>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export default function ApartmentChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelperNoteHidden, setIsHelperNoteHidden] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef(0);
  const hasSentBookingInfoRef = useRef(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsHelperNoteHidden(sessionStorage.getItem(helperNoteStorageKey) === "true");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function openChat() {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function dismissHelperNote() {
    sessionStorage.setItem(helperNoteStorageKey, "true");
    setIsHelperNoteHidden(true);
  }

  async function fetchBotReply(trimmed: string, chatHistory: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, messages: chatHistory })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as { reply?: string };
      return data.reply || "Please contact us on WhatsApp or call 9708538395 / 9869035191 for the fastest booking help.";
    } catch {
      return "Sorry, I cannot connect right now. Please WhatsApp or call 9708538395 / 9869035191 for room inquiries.";
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    messageIdRef.current += 1;
    const userMessage: ChatMessage = {
      id: `user-${messageIdRef.current}`,
      role: "user",
      content: trimmed
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    const chatHistory = [...messages, userMessage]
      .filter((message) => message.id !== "welcome")
      .slice(-8)
      .map((message) => ({
        role: message.role === "bot" ? "assistant" : "user",
        content: message.content
      }));

    const botReplyContent = await fetchBotReply(trimmed, chatHistory);

    setMessages((current) => [
      ...current,
      {
        id: `bot-${messageIdRef.current}`,
        role: "bot",
        content: botReplyContent
      }
    ]);
    setIsTyping(false);

    if (!hasSentBookingInfoRef.current) {
      const transcript = [...messages, userMessage, { id: "pending-bot", role: "bot" as const, content: botReplyContent }]
        .map((entry) => `${entry.role === "user" ? "Guest" : "JK Assistant"}: ${entry.content}`)
        .join("\n");
      const emailMatch = transcript.match(EMAIL_REGEX);
      const phoneMatch = transcript.match(PHONE_REGEX);

      if (emailMatch && phoneMatch) {
        hasSentBookingInfoRef.current = true;
        void sendBookingInfoFromChat(transcript, emailMatch[0], phoneMatch[0].replace(/[\s-]/g, ""));
      }
    }
  }

  async function sendBookingInfoFromChat(transcript: string, email: string, phone: string) {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `New chat booking inquiry from the Jikmis Apartment website.\nGuest email: ${email}\nGuest phone: ${phone}\n\nConversation:\n${transcript}`
    )}`;

    let emailSent = true;
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: "New Jikmis Apartment chat booking inquiry",
          email,
          phone,
          transcript,
          _replyto: email
        })
      });
      emailSent = response.ok;
    } catch {
      emailSent = false;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    messageIdRef.current += 1;
    setMessages((current) => [
      ...current,
      {
        id: `bot-info-${messageIdRef.current}`,
        role: "bot",
        content: emailSent
          ? `Thanks! I've sent your details to our team (${INQUIRY_EMAIL}) and opened WhatsApp so we can confirm your booking quickly. If WhatsApp didn't open, tap here: ${whatsappUrl}`
          : `Thanks! I've opened WhatsApp so our team can confirm your booking. If it didn't open, tap here: ${whatsappUrl}`
      }
    ]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="chatbot-shell">
      {!isOpen && !isHelperNoteHidden && (
        <div
          className="chat-helper-note"
          role="button"
          tabIndex={0}
          onClick={openChat}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            openChat();
          }}
          aria-label="Open Jikmis Apartment chat"
        >
          <span>💬 Have a question? Ask me about our apartment!</span>
          <button
            className="chat-helper-close"
            type="button"
            aria-label="Hide chat helper note"
            onClick={(event) => {
              event.stopPropagation();
              dismissHelperNote();
            }}
          >
            ×
          </button>
        </div>
      )}

      {isOpen && (
        <section className="chatbot-panel" aria-label="Jikmis Apartment chat">
          <header className="chatbot-header">
            <div>
              <span className="chatbot-kicker">Ask JK</span>
              <strong>Jikmis Apartment</strong>
            </div>
            <button className="icon-button" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </header>

          <div className="chatbot-history" ref={historyRef}>
            {messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                {renderMessageContent(message.content)}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator" aria-label="Receptionist is typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <div className="quick-replies" aria-label="Quick replies">
            {quickReplies.map((reply) => (
              <button key={reply} type="button" onClick={() => void sendMessage(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <div className="chat-actions">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href={`tel:+${WHATSAPP_NUMBER}`}>
              <Phone size={16} /> Call
            </a>
            <a href={`mailto:${INQUIRY_EMAIL}`}>
              <Mail size={16} /> Email
            </a>
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              aria-label="Ask Jikmis Apartment"
              placeholder="Ask about rooms, price, location..."
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="icon-button send-button" type="submit" aria-label="Send message" disabled={isTyping}>
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        className="chatbot-launcher"
        type="button"
        onClick={openChat}
      >
        <Bot size={22} />
        <span>Ask JK</span>
      </button>
    </div>
  );
}
