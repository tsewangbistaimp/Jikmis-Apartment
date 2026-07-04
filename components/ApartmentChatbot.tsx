"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Mail, MessageCircle, Phone, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  content: string;
};

const quickReplies = ["Pricing", "Availability", "Book or viewing", "Facilities", "Laundry"];

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Hello! Welcome to Jikmis Apartment in Boudha. I can help with availability, pricing, bookings, and apartment questions. How can I help you today?"
  }
];

const chatEndpoint = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/chat` : "/api/chat";

export default function ApartmentChatbot() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

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

    try {
      const chatHistory = [...messages, userMessage]
        .filter((message) => message.id !== "welcome")
        .slice(-8)
        .map((message) => ({
          role: message.role === "bot" ? "assistant" : "user",
          content: message.content
        }));

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, messages: chatHistory })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as { reply?: string };
      setMessages((current) => [
        ...current,
        {
          id: `bot-${messageIdRef.current}`,
          role: "bot",
          content:
            data.reply ||
            "Please contact us on WhatsApp or call +9779708538395 for the fastest booking help."
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `bot-${messageIdRef.current}`,
          role: "bot",
          content:
            "Sorry, I cannot connect right now. Please WhatsApp or call +9779708538395 for room inquiries."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="chatbot-shell">
      {isOpen && (
        <section className="chatbot-panel" aria-label="Jikmis Apartment AI receptionist">
          <header className="chatbot-header">
            <div>
              <span className="chatbot-kicker">AI receptionist</span>
              <strong>Jikmis Apartment</strong>
            </div>
            <button className="icon-button" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </header>

          <div className="chatbot-history" ref={historyRef}>
            {messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                {message.content}
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
            <a href="https://wa.me/9779708538395" target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href="tel:+9779708538395">
              <Phone size={16} /> Call
            </a>
            <a href="mailto:jikmisdonkhang@gmail.com">
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
        onClick={() => {
          setIsOpen(true);
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <Bot size={22} />
        <span>Ask JK</span>
      </button>
    </div>
  );
}
