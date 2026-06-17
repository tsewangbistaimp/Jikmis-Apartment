"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Code2,
  Coffee,
  Github,
  Globe2,
  GraduationCap,
  Hotel,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Mountain,
  PackageCheck,
  Rocket,
  Send,
  ShoppingBag,
  Sprout,
  Target,
  Zap
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const navItems = ["About", "Expertise", "Ventures", "Experience", "Orders", "Contact"];

const highlights = [
  { label: "Location", value: "Kathmandu, Nepal", icon: MapPin },
  { label: "Origin", value: "Mustang", icon: Mountain },
  { label: "Focus", value: "AI, Business & Technology", icon: Rocket }
];

const expertise = [
  {
    title: "Software & Web Development",
    icon: Code2,
    body: "React, Next.js, Node.js, JavaScript, HTML, CSS, Python, Java, SQL, MySQL, and PostgreSQL for fast digital products."
  },
  {
    title: "AI Marketing & Automation",
    icon: Bot,
    body: "AI-assisted content, campaign systems, marketing funnels, email automation, and smarter customer acquisition workflows."
  },
  {
    title: "Digital Growth",
    icon: Target,
    body: "Meta ads, Facebook and Instagram growth, performance marketing, e-commerce strategy, B2B sales, and B2C conversion."
  },
  {
    title: "UI/UX Design",
    icon: Zap,
    body: "Clean Figma-led interfaces, conversion-focused layouts, responsive design, and modern product presentation."
  }
];

const ventures = [
  {
    title: "Shoe Business",
    label: "Retail & Wholesale",
    icon: ShoppingBag,
    body: "Building B2B and B2C shoe commerce through sales, customer relationships, sourcing, and market development."
  },
  {
    title: "Mustang Apple Farming",
    label: "Agriculture",
    icon: Sprout,
    body: "Representing the quality of Mustang apples and the opportunity to connect local agriculture with broader markets."
  },
  {
    title: "Hospitality Operations",
    label: "Service Leadership",
    icon: Hotel,
    body: "Hotel management, co-management, supervision, housekeeping, guest service, barista work, and team coordination."
  }
];

const skills = [
  "React",
  "Next.js",
  "Node.js",
  "JavaScript",
  "Python",
  "Java",
  "SQL",
  "Figma",
  "AI Marketing",
  "Email Funnels",
  "Meta Ads",
  "E-commerce",
  "B2B Sales",
  "Hospitality",
  "Business Development"
];

const languages = ["Nepali", "Tibetan", "Lowa", "English", "Hindi"];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tsewang-bista-a62227310/",
    icon: Linkedin
  },
  {
    label: "GitHub",
    href: "https://github.com/tsewangbistaimp",
    icon: Github
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/wan_geh/",
    icon: Instagram
  }
];

type OrderStatus = "idle" | "sending" | "success" | "error";

export default function Home() {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    const revealTargets = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  async function handleOrderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderStatus("sending");
    setOrderMessage("Submitting your order...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Order could not be submitted.");
      }

      setOrderStatus("success");
      setOrderMessage(result.message || "Order received. Confirmation email sent.");
      form.reset();
    } catch (error) {
      setOrderStatus("error");
      setOrderMessage(error instanceof Error ? error.message : "Order could not be submitted.");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="TsewangBistaX home">
          <Image
            src="/images/tsewangbistax-logo.png"
            width={92}
            height={48}
            alt="TsewangBistaX logo"
            priority
          />
          <span>TsewangBistaX</span>
        </a>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section id="top" className="hero section-shell">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Entrepreneur | Developer | AI Marketer</p>
          <h1>Tsewang Bista</h1>
          <p className="tagline">Where Technology, Business & Innovation Meet.</p>
          <p className="hero-text">
            I build digital products, growth systems, and real-world businesses across
            software, AI marketing, e-commerce, agriculture, and hospitality.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#contact">
              <Send size={18} />
              Start a Conversation
            </a>
            <a className="button secondary" href="https://wa.me/9779862568506">
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
          <div className="hero-stats" aria-label="Professional highlights">
            <div>
              <strong>10+</strong>
              <span>Skill Domains</span>
            </div>
            <div>
              <strong>7</strong>
              <span>Industries</span>
            </div>
            <div>
              <strong>5</strong>
              <span>Languages</span>
            </div>
          </div>
        </div>

        <div className="portrait-wrap" data-reveal>
          <div className="portrait-card">
            <Image
              src="/images/tsewang-bista-profile.jpeg"
              width={900}
              height={1180}
              alt="Portrait of Tsewang Bista"
              className="portrait"
              priority
            />
          </div>
          <div className="signal-card">
            <Globe2 size={18} />
            <span>Kathmandu based, Mustang rooted, globally minded.</span>
          </div>
        </div>
      </section>

      <section id="about" className="section-shell split-section">
        <div data-reveal>
          <p className="eyebrow">About Me</p>
          <h2>A multi-skilled builder connecting ideas, markets, and people.</h2>
        </div>
        <div className="about-panel" data-reveal>
          <p>
            I am Tsewang Bista, a Kathmandu-based entrepreneur from Mustang with
            experience across technology, digital marketing, AI content, sales,
            hospitality, shoe commerce, and apple farming. My work sits at the point
            where practical business execution meets modern digital systems.
          </p>
          <div className="highlight-grid">
            {highlights.map(({ label, value, icon: Icon }) => (
              <div className="highlight" key={label}>
                <Icon size={20} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="section-shell">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Expertise</p>
          <h2>Digital skills built for real business outcomes.</h2>
        </div>
        <div className="cards-grid">
          {expertise.map(({ title, body, icon: Icon }) => (
            <article className="feature-card" key={title} data-reveal>
              <Icon size={26} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="skill-cloud" data-reveal>
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="ventures" className="section-shell">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Business Ventures</p>
          <h2>Entrepreneurship across commerce, farming, and service.</h2>
        </div>
        <div className="venture-grid">
          {ventures.map(({ title, label, body, icon: Icon }) => (
            <article className="venture-card" key={title} data-reveal>
              <div className="venture-top">
                <Icon size={28} />
                <span>{label}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="section-shell experience">
        <div data-reveal>
          <p className="eyebrow">Experience</p>
          <h2>Professional range with hands-on execution.</h2>
        </div>
        <div className="timeline" data-reveal>
          <div>
            <BriefcaseBusiness size={22} />
            <h3>Entrepreneur & Business Developer</h3>
            <p>
              Sales strategy, customer development, retail and wholesale growth,
              operations, and partner-ready business presentation.
            </p>
          </div>
          <div>
            <Code2 size={22} />
            <h3>Developer & Designer</h3>
            <p>
              Frontend and backend development, UI/UX design, data-aware systems,
              and SEO-ready web experiences for modern brands.
            </p>
          </div>
          <div>
            <Coffee size={22} />
            <h3>Hospitality Professional</h3>
            <p>
              Hotel management support, supervision, housekeeping, barista service,
              guest experience, and reliable daily operations.
            </p>
          </div>
          <div>
            <GraduationCap size={22} />
            <h3>Languages & Communication</h3>
            <p>{languages.join(", ")} for cross-cultural work, sales, hospitality, and client communication.</p>
          </div>
        </div>
      </section>

      <section id="orders" className="section-shell order-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Orders</p>
          <h2>Place a shoe, apple, or business inquiry order.</h2>
          <p>
            Every submitted order is saved to Google Sheets, sends me an email
            notification, and sends the customer an order received confirmation.
          </p>
        </div>
        <form className="order-form" onSubmit={handleOrderSubmit} data-reveal>
          <div className="form-grid">
            <label>
              Customer Name
              <input name="customerName" type="text" placeholder="Full name" required />
            </label>
            <label>
              Customer Email
              <input name="customerEmail" type="email" placeholder="customer@example.com" required />
            </label>
            <label>
              Phone / WhatsApp
              <input name="customerPhone" type="tel" placeholder="+977..." required />
            </label>
            <label>
              Order Type
              <select name="orderType" required defaultValue="">
                <option value="" disabled>
                  Select order type
                </option>
                <option value="Shoe Order">Shoe Order</option>
                <option value="Mustang Apple Order">Mustang Apple Order</option>
                <option value="B2B / Wholesale Inquiry">B2B / Wholesale Inquiry</option>
                <option value="AI Marketing / Website Inquiry">AI Marketing / Website Inquiry</option>
                <option value="Other Business Inquiry">Other Business Inquiry</option>
              </select>
            </label>
            <label>
              Product / Service
              <input name="product" type="text" placeholder="Shoes, apples, website, ads..." required />
            </label>
            <label>
              Quantity / Budget
              <input name="quantity" type="text" placeholder="Example: 10 pairs or NPR 50,000" required />
            </label>
          </div>
          <label>
            Delivery Address / Notes
            <textarea
              name="notes"
              placeholder="Delivery address, preferred size, product details, deadline, or special notes"
              rows={5}
              required
            />
          </label>
          <button className="button primary" type="submit" disabled={orderStatus === "sending"}>
            <PackageCheck size={18} />
            {orderStatus === "sending" ? "Submitting..." : "Submit Order"}
          </button>
          {orderMessage ? (
            <p className={`form-status ${orderStatus === "error" ? "error" : "success"}`} role="status">
              {orderMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section id="contact" className="section-shell contact-section">
        <div className="contact-copy" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2>Let&apos;s build, grow, or partner on something ambitious.</h2>
          <p>
            Reach out for software projects, AI marketing, business partnerships,
            hospitality opportunities, investment conversations, or collaborations.
          </p>
          <div className="contact-links">
            <a href="mailto:tsewangbistaimp@gmail.com">
              <Mail size={18} />
              tsewangbistaimp@gmail.com
            </a>
            <a href="https://wa.me/9779862568506">
              <MessageCircle size={18} />
              +977 9862568506
            </a>
          </div>
          <div className="social-row">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
        <form
          className="contact-form"
          action="mailto:tsewangbistaimp@gmail.com"
          method="post"
          encType="text/plain"
          data-reveal
        >
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="Tell me about your project or opportunity" rows={5} required />
          </label>
          <button className="button primary" type="submit">
            <Mail size={18} />
            Send Email
          </button>
        </form>
      </section>

      <footer>
        <span>TsewangBistaX</span>
        <p>Technology, Business & Innovation from Kathmandu and Mustang.</p>
        <a href="#top" aria-label="Back to top">
          <ArrowUpRight size={18} />
        </a>
      </footer>
    </main>
  );
}
