"use client";

import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Code2,
  Github,
  Globe2,
  Hotel,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

const navItems = ["About", "Skills", "Work", "Services", "Orders", "Contact"];

const metrics = [
  ["10+", "Skill Domains"],
  ["7", "Industries"],
  ["5", "Languages"]
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
  "Meta Ads",
  "Email Funnels",
  "E-commerce",
  "B2B Sales",
  "Hospitality"
];

const services = [
  {
    icon: Code2,
    title: "Web Development",
    body: "Modern websites, portfolio systems, landing pages, dashboards, and scalable web apps with clean code."
  },
  {
    icon: Bot,
    title: "AI Marketing Systems",
    body: "AI content workflows, lead funnels, automations, campaign ideas, and smarter growth operations."
  },
  {
    icon: Target,
    title: "Performance Marketing",
    body: "Meta ads, social growth, email marketing, customer acquisition, and conversion-focused strategy."
  },
  {
    icon: Layers3,
    title: "UI/UX Design",
    body: "Premium interfaces, product flows, Figma design, responsive layouts, and brand-first digital experiences."
  }
];

const ventures = [
  {
    icon: ShoppingBag,
    title: "TsewangBista Shoes",
    tag: "B2B / B2C commerce",
    body: "Retail and wholesale shoe business focused on sales, sourcing, customer trust, and market growth."
  },
  {
    icon: Sprout,
    title: "Mustang Apple Farming",
    tag: "Agriculture business",
    body: "A Mustang-rooted venture connecting premium local apples with stronger branding and distribution."
  },
  {
    icon: Hotel,
    title: "Hospitality Leadership",
    tag: "Operations & service",
    body: "Hotel management, supervision, housekeeping, barista service, and reliable guest experience."
  }
];

const portfolio = [
  {
    title: "AI Growth Engine",
    type: "Marketing Automation",
    body: "A modern lead and content workflow for faster campaign execution."
  },
  {
    title: "Shoe Commerce System",
    type: "Business Operations",
    body: "Order collection, customer communication, and business pipeline structure."
  },
  {
    title: "Luxury Portfolio UI",
    type: "Web / UI Design",
    body: "Premium personal brand presentation for clients, partners, investors, and employers."
  }
];

const experiences = [
  "Entrepreneur and business development operator",
  "Software and web developer with React, Next.js, Node.js, and SQL",
  "AI marketing specialist for content, funnels, and automation",
  "Hospitality professional across hotel operations and service",
  "Sales-focused operator across retail, wholesale, and customer growth"
];

const testimonials = [
  {
    quote: "A rare mix of technical skill, business thinking, and hands-on execution.",
    name: "Business Partner"
  },
  {
    quote: "Tsewang understands both digital presence and real-world customer experience.",
    name: "Client Perspective"
  }
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tsewang-bista-a62227310/", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/tsewangbistaimp", icon: Github },
  { label: "Instagram", href: "https://www.instagram.com/wan_geh/", icon: Instagram }
];

type OrderStatus = "idle" | "sending" | "success" | "error";

export default function Home() {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    const moveGlow = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

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
      { threshold: 0.14 }
    );

    window.addEventListener("pointermove", moveGlow);
    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      window.removeEventListener("pointermove", moveGlow);
      observer.disconnect();
    };
  }, []);

  async function handleOrderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderStatus("sending");
    setOrderMessage("Submitting your order...");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <main className="portfolio-shell">
      <div className="cursor-glow" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="TsewangBistaX home">
          <Image src="/images/tsewangbistax-logo.png" alt="TsewangBistaX logo" width={86} height={44} priority />
          <span>TsewangBistaX</span>
        </a>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          <Mail size={16} />
          Contact
        </a>
      </header>

      <section id="top" className="hero section-shell">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Hello, I&apos;m</p>
          <h1>
            Tsewang
            <span>Bista.</span>
          </h1>
          <p className="hero-role">Senior-spirited developer, AI marketer & multi-business entrepreneur.</p>
          <p className="hero-text">
            I build premium digital experiences, practical growth systems, and business ventures across technology,
            AI marketing, shoes, Mustang apples, and hospitality.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#work">
              View My Work
              <ArrowUpRight size={18} />
            </a>
            <a className="button secondary" href="https://wa.me/9779862568506" target="_blank" rel="noreferrer">
              WhatsApp
              <MessageCircle size={18} />
            </a>
          </div>
          <div className="availability">
            <span />
            Available for clients, partners, investors, and opportunities
          </div>
        </div>

        <div className="hero-visual" data-reveal>
          <div className="portrait-halo" />
          <div className="portrait-card">
            <Image
              src="/images/tsewang-bista-profile.jpeg"
              alt="Portrait of Tsewang Bista"
              width={900}
              height={1180}
              className="portrait"
              priority
            />
          </div>
          <div className="floating-stats glass-card">
            {metrics.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-shell about-grid">
        <div data-reveal>
          <p className="eyebrow">About Me</p>
          <h2>I turn ambition into digital products, growth systems, and real business momentum.</h2>
          <p>
            I am based in Kathmandu, Nepal and rooted in Mustang. My work connects modern software, AI marketing,
            design, sales, hospitality, and entrepreneurship into one practical personal brand.
          </p>
        </div>
        <div className="about-cards" data-reveal>
          <article className="glass-card about-card">
            <Globe2 size={24} />
            <strong>Kathmandu, Nepal</strong>
            <span>Mustang origin with a global digital mindset.</span>
          </article>
          <article className="glass-card about-card">
            <TrendingUp size={24} />
            <strong>Business Builder</strong>
            <span>Sales, e-commerce, operations, and customer growth.</span>
          </article>
          <article className="glass-card about-card">
            <Sparkles size={24} />
            <strong>AI + Creativity</strong>
            <span>Marketing systems, content workflows, and automation.</span>
          </article>
        </div>
      </section>

      <section id="skills" className="section-shell skills-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Core Stack</p>
          <h2>Skills built for modern execution.</h2>
        </div>
        <div className="skill-cloud" data-reveal>
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="work" className="section-shell work-layout">
        <div className="services-panel glass-card" data-reveal>
          <p className="eyebrow">What I Do</p>
          <h2>Services</h2>
          <div className="service-list">
            {services.map(({ icon: Icon, title, body }) => (
              <article key={title}>
                <Icon size={20} />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <ArrowUpRight size={18} />
              </article>
            ))}
          </div>
        </div>
        <div className="portfolio-panel glass-card" data-reveal>
          <p className="eyebrow">Selected Work</p>
          <h2>Featured Projects</h2>
          <div className="portfolio-grid">
            {portfolio.map((item) => (
              <article className="portfolio-card" key={item.title}>
                <div className="project-art">
                  <span>{item.type}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell venture-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Business Ventures</p>
          <h2>Technology meets real-world business.</h2>
        </div>
        <div className="venture-grid">
          {ventures.map(({ icon: Icon, title, tag, body }) => (
            <article className="glass-card venture-card" key={title} data-reveal>
              <Icon size={28} />
              <span>{tag}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="section-shell experience-section">
        <div data-reveal>
          <p className="eyebrow">Experience</p>
          <h2>Professional range with hands-on execution.</h2>
        </div>
        <div className="experience-list glass-card" data-reveal>
          {experiences.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell testimonial-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Testimonials</p>
          <h2>Trusted for sharp thinking and reliable execution.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="glass-card testimonial-card" key={testimonial.name} data-reveal>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>
              <p>&quot;{testimonial.quote}&quot;</p>
              <strong>{testimonial.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section id="orders" className="section-shell order-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Order Inquiry</p>
          <h2>Place a shoe, apple, or business inquiry order.</h2>
          <p>
            Orders are designed to go to Google Sheets, notify me by email, and send the customer an order received
            confirmation when valid environment credentials are configured.
          </p>
        </div>
        <form className="glass-card order-form" onSubmit={handleOrderSubmit} data-reveal>
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
            <textarea name="notes" placeholder="Delivery address, size, product details, deadline, or notes" rows={5} required />
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
        <div data-reveal>
          <p className="eyebrow">Contact Me</p>
          <h2>Let&apos;s build something premium together.</h2>
          <p>
            Available for web development, UI/UX design, AI marketing, business partnerships, and serious growth
            conversations.
          </p>
        </div>
        <div className="contact-card glass-card" data-reveal>
          <a href="mailto:tsewangbistaimp@gmail.com">
            <Mail size={18} />
            tsewangbistaimp@gmail.com
          </a>
          <a href="https://wa.me/9779862568506" target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            +977 9862568506
          </a>
          <span>
            <MapPin size={18} />
            Kathmandu, Nepal
          </span>
          <div className="social-row">
            {socials.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>TsewangBistaX</span>
        <p>Technology, Business & Innovation.</p>
        <a href="#top" aria-label="Back to top">
          <ArrowUpRight size={18} />
        </a>
      </footer>
    </main>
  );
}
