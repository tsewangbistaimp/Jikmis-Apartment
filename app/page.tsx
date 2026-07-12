"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  Building2,
  Car,
  Check,
  ChefHat,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Heart,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wifi,
  X
} from "lucide-react";
import ApartmentChatbot from "@/components/ApartmentChatbot";

const roomShowcase = [
  {
    title: "Single Studio",
    price: "NPR 1,500 / day",
    monthly: "NPR 37,000 / month",
    guests: "1-2 guests",
    description: "A calm furnished studio with warm wooden floors, private bathroom, and a compact kitchen setup.",
    images: ["/images/jikmis/single-studio-bedroom.jpeg", "/images/jikmis/single-studio-kitchen.jpeg"],
    amenities: ["Queen bed", "Kitchen setup", "Private bathroom", "Free WiFi"]
  },
  {
    title: "Double Studio",
    price: "NPR 2,500 / day",
    monthly: "NPR 47,000 / month",
    guests: "2-3 guests",
    description: "A bright double studio with generous sleeping space, seating, kitchen area, and hot-water bathroom.",
    images: [
      "/images/jikmis/double-studio-bedroom.jpeg",
      "/images/jikmis/double-studio-lounge.jpeg",
      "/images/jikmis/double-studio-bathroom.jpeg"
    ],
    amenities: ["Twin beds", "Seating area", "Kitchen setup", "24/7 hot water"]
  },
  {
    title: "Family Room",
    price: "NPR 4,000 / day",
    monthly: "NPR 65,000 / month",
    guests: "Families or groups",
    description: "A spacious family apartment with separate bedroom areas, lounge space, dining corner, and Boudha light.",
    images: [
      "/images/jikmis/family-room-bedroom.jpeg",
      "/images/jikmis/family-room-living.jpeg",
      "/images/jikmis/family-room-second-bedroom.jpeg",
      "/images/jikmis/family-room-sunroom.jpeg"
    ],
    amenities: ["Family layout", "Living area", "Kitchen setup", "Large windows"]
  }
];

const amenities = [
  { icon: Wifi, title: "Free WiFi", text: "Reliable internet included for every stay." },
  { icon: Bath, title: "24/7 Hot Water", text: "Comfortable bathrooms with hot water access." },
  { icon: ChefHat, title: "Kitchen Setup", text: "Basic kitchen essentials for easy daily living." },
  { icon: Sparkles, title: "Cleaning Service", text: "Housekeeping support twice a week." },
  { icon: ShieldCheck, title: "Secure Stay", text: "Comfort-focused serviced apartment environment." },
  { icon: Car, title: "Motorbike Parking", text: "Convenient parking for guests with bikes." }
];

const attractions = [
  { icon: MapPin, title: "Boudhanath Stupa", text: "A short walk to one of Kathmandu's most loved landmarks." },
  { icon: Coffee, title: "Cafes & Restaurants", text: "Easy access to local cafes, shops, and dining." },
  { icon: Plane, title: "Airport Access", text: "Convenient route to Tribhuvan International Airport." },
  { icon: Building2, title: "Daily Essentials", text: "Public transport, markets, and daily needs nearby." }
];

const reviews = [
  {
    quote: "The room was peaceful, clean, and close to Boudha. Perfect for a longer Kathmandu stay.",
    name: "Guest from Nepal"
  },
  {
    quote: "Loved the warm wooden rooms and kitchen setup. The location made everything simple.",
    name: "Monthly guest"
  },
  {
    quote: "A comfortable family space with helpful contact and easy access to restaurants.",
    name: "Family traveler"
  }
];

const galleryImages = [
  "/images/jikmis/single-studio-bedroom.jpeg",
  "/images/jikmis/single-studio-kitchen.jpeg",
  "/images/jikmis/double-studio-bedroom.jpeg",
  "/images/jikmis/double-studio-lounge.jpeg",
  "/images/jikmis/family-room-bedroom.jpeg",
  "/images/jikmis/family-room-living.jpeg",
  "/images/jikmis/family-room-second-bedroom.jpeg",
  "/images/jikmis/family-room-sunroom.jpeg",
  "/images/jikmis/gallery/jikmis-gallery-1736.jpg",
  "/images/jikmis/gallery/jikmis-gallery-1737.jpg",
  "/images/jikmis/gallery/jikmis-gallery-1738.jpg",
  "/images/jikmis/gallery/jikmis-rooftop-stupa-sunset.jpg",
  "/images/jikmis/gallery/jikmis-rooftop-yoga-view.jpg",
  "/images/jikmis/gallery/jikmis-rooftop-terrace-view.jpg"
];

const cafeImages = [
  {
    src: "/images/jikmis/cafe/jikmis-cafe-main.jpg",
    alt: "Warm seating area inside Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-window.jpg",
    alt: "Window seating and wooden tables at Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-cozy-seating.jpg",
    alt: "Cozy Jikmis Cafe seating with warm wooden furniture"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-counter.jpg",
    alt: "Coffee counter and pastry display at Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-iced-coffee.jpg",
    alt: "Iced coffee on a wooden table at Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-orange-coffee.jpg",
    alt: "Cold coffee with orange garnish at Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-mango-drink.jpg",
    alt: "Colorful mango iced drink at Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-berry-drink.jpg",
    alt: "Berry iced drink served at Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-table-corner.jpg",
    alt: "Wooden table corner inside Jikmis Cafe"
  },
  {
    src: "/images/jikmis/cafe/jikmis-cafe-lounge.jpg",
    alt: "Bright lounge seating at Jikmis Cafe"
  }
];

const popularCafeMenu = [
  "☕ Cappuccino",
  "☕ Café Latte",
  "🧊 Iced Latte",
  "🥤 Fresh Lemon Soda",
  "🥐 Bakery Items",
  "🍰 Cheesecake"
];

const cafeMenu = [
  { category: "Coffee", items: ["Espresso", "Americano", "Cappuccino", "Café Latte", "Mocha"] },
  { category: "Tea", items: ["Masala Tea", "Green Tea", "Lemon Tea", "Tibetan Butter Tea"] },
  { category: "Cold Drinks", items: ["Iced Latte", "Fresh Lemon Soda", "Mango Smoothie", "Seasonal Cooler"] },
  { category: "Bakery", items: ["Butter Croissant", "Cheesecake", "Chocolate Cake", "Brownie", "Fresh Bakery Items"] }
];

const WHATSAPP_NUMBER = "9779708538395";
const INQUIRY_EMAIL = "jikmisdonkhang@gmail.com";
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/xvzepwkw";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isCafeMenuOpen, setIsCafeMenuOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    roomType: roomShowcase[0].title,
    checkIn: "",
    checkOut: "",
    guests: ""
  });
  const [bookingStatus, setBookingStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [contactDetails, setContactDetails] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState);
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhoto((current) => current + 1);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isCafeMenuOpen) return;

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    const getFocusableElements = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          ".cafe-modal button, .cafe-modal [href], .cafe-modal input, .cafe-modal select, .cafe-modal textarea, .cafe-modal [tabindex]:not([tabindex='-1'])"
        )
      ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCafeMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => document.querySelector<HTMLElement>(".cafe-modal-close")?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isCafeMenuOpen]);

  useEffect(() => {
    if (!isBookingModalOpen) return;

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    const getFocusableElements = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          ".booking-modal button, .booking-modal [href], .booking-modal input, .booking-modal select, .booking-modal textarea, .booking-modal [tabindex]:not([tabindex='-1'])"
        )
      ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsBookingModalOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => document.querySelector<HTMLElement>(".booking-modal-close")?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isBookingModalOpen]);

  const heroImage = useMemo(() => roomShowcase[2].images[activePhoto % roomShowcase[2].images.length], [activePhoto]);

  function handleBookingSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingStatus("idle");
    setBookingMessage("");
    setIsBookingModalOpen(true);
  }

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { roomType, checkIn, checkOut, guests } = bookingForm;
    const { name, email, phone } = contactDetails;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hello Jikmis Apartment, I would like to check availability.\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nRoom type: ${roomType}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}`
    )}`;

    setBookingStatus("sending");
    setBookingMessage("Sending your request...");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: "New Jikmis Apartment availability request",
          name,
          email,
          phone,
          roomType,
          checkIn,
          checkOut,
          guests,
          _replyto: email
        })
      });
      if (!response.ok) throw new Error("Email could not be sent.");
      setBookingStatus("success");
      setBookingMessage("Request emailed to our team and opened in WhatsApp.");
    } catch {
      setBookingStatus("error");
      setBookingMessage("Opened WhatsApp, but the email could not be sent. Please also message us directly.");
    } finally {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <main className="apartment-site luxury-site">
      <header className={`site-header luxury-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <Link className="brand" href="/">
          <span className="brand-mark">JK</span>
          <span>Jikmis Apartment</span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#rooms">Rooms</a>
          <a href="#cafe">Café</a>
          <a href="#amenities">Amenities</a>
          <a href="#nearby">Nearby</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Book</a>
        </nav>
      </header>

      <section className="luxury-hero airbnb-hero">
        <img className="luxury-hero-image" src={heroImage} alt="Luxury serviced apartment at Jikmis Apartment" />
        <div className="luxury-hero-overlay airbnb-hero-overlay" />

        <div className="airbnb-topbar">
          <form className="airbnb-searchbar" onSubmit={handleBookingSearch}>
            <label className="search-field">
              <span>Room Type</span>
              <select
                value={bookingForm.roomType}
                onChange={(event) => setBookingForm((current) => ({ ...current, roomType: event.target.value }))}
                required
              >
                {roomShowcase.map((room) => (
                  <option key={room.title} value={room.title}>
                    {room.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="search-field">
              <span>Check in</span>
              <input
                type="date"
                value={bookingForm.checkIn}
                onChange={(event) => setBookingForm((current) => ({ ...current, checkIn: event.target.value }))}
                required
              />
            </label>
            <label className="search-field">
              <span>Check out</span>
              <input
                type="date"
                value={bookingForm.checkOut}
                onChange={(event) => setBookingForm((current) => ({ ...current, checkOut: event.target.value }))}
                required
              />
            </label>
            <label className="search-field">
              <span>Guests</span>
              <input
                type="number"
                min="1"
                placeholder="Add guests"
                value={bookingForm.guests}
                onChange={(event) => setBookingForm((current) => ({ ...current, guests: event.target.value }))}
                required
              />
            </label>
            <button className="search-button" type="submit" aria-label="Send availability request" disabled={bookingStatus === "sending"}>
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className="luxury-hero-content airbnb-hero-content">
          <p className="eyebrow"><MapPin size={16} /> Boudha, Kathmandu</p>
          <h1>Jikmis Apartment.</h1>
          <p>
            Serviced studios and family apartments with warm interiors, private kitchens, hot water, and direct booking
            assistance in the heart of Boudha.
          </p>
          <div className="hero-actions airbnb-hero-actions">
            <a className="button airbnb-explore" href="#rooms">
              Explore <ArrowRight size={18} />
            </a>
            <a className="button secondary hero-secondary" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="airbnb-card-row" aria-label="Featured room types">
          {roomShowcase.map((room, index) => (
            <div className="airbnb-card" key={room.title}>
              <div className="airbnb-card-media">
                <img src={room.images[activePhoto % room.images.length]} alt={`${room.title} at Jikmis Apartment`} />
                {index < 2 ? <Heart size={16} className="airbnb-card-heart" /> : null}
              </div>
              <span className="airbnb-card-caption">{room.title}, Boudha</span>
            </div>
          ))}
        </div>

        <div className="airbnb-hero-footer">
          <span className="airbnb-location"><MapPin size={16} /> Boudha, Kathmandu, Nepal</span>
          <div className="airbnb-dots">
            {roomShowcase.map((room, index) => (
              <span key={room.title} className={index === activePhoto % roomShowcase.length ? "is-active" : ""} />
            ))}
          </div>
          <div className="airbnb-arrows">
            <button type="button" aria-label="Previous room">
              <ChevronLeft size={18} />
            </button>
            <button type="button" aria-label="Next room">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="section-shell luxury-about" id="about">
        <div>
          <p className="eyebrow">About Jikmis</p>
          <h2>A quiet serviced apartment designed for comfort in Boudha.</h2>
        </div>
        <div className="about-copy">
          <p>
            Jikmis Apartment offers fully furnished serviced apartments for short stays, long stays, families,
            students, and guests who want a calm base near Boudhanath Stupa.
          </p>
          <div className="about-stat-row">
            <span><BedDouble size={18} /> Studio & family rooms</span>
            <span><Bath size={18} /> 24/7 hot water</span>
            <span><HeartHandshake size={18} /> Direct booking help</span>
          </div>
        </div>
      </section>

      <section className="section-shell" id="rooms">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Apartment Showcase</p>
          <h2>Choose your space in Boudha.</h2>
          <p>Clean, warm, and practical rooms with premium simplicity and direct monthly pricing.</p>
        </div>
        <div className="luxury-room-grid">
          {roomShowcase.map((room, index) => {
            const image = room.images[activePhoto % room.images.length];
            return (
              <article className="luxury-room-card" key={room.title}>
                <div className="room-image-frame">
                  <img src={image} alt={`${room.title} at Jikmis Apartment`} />
                  <span className="room-chip">{room.guests}</span>
                </div>
                <div className="luxury-room-body">
                  <div className="room-title-row">
                    <h3>{room.title}</h3>
                    <span>{index === 2 ? "Family" : "Studio"}</span>
                  </div>
                  <p>{room.description}</p>
                  <div className="room-price-row">
                    <strong>{room.price}</strong>
                    <span>{room.monthly}</span>
                  </div>
                  <ul className="room-amenity-list">
                    {room.amenities.map((amenity) => (
                      <li key={amenity}><Check size={15} /> {amenity}</li>
                    ))}
                  </ul>
                  <a className="text-link room-detail-link" href="#contact">View Details</a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell cafe-section" id="cafe">
        <div className="cafe-grid">
          <div className="cafe-media">
            <div className="cafe-main-frame">
              <img src={cafeImages[0].src} alt={cafeImages[0].alt} loading="lazy" />
            </div>
            <div className="cafe-photo-strip" aria-label="Jikmis Café photo preview">
              {cafeImages.slice(1).map((image) => (
                <div className="cafe-thumb" key={image.src}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="cafe-content">
            <div className="cafe-topline">
              <p className="eyebrow"><Coffee size={16} /> Jikmis Café</p>
              <span className="cafe-badge">Open Daily</span>
            </div>
            <h2>☕ Jikmis Café</h2>
            <p className="cafe-subtitle">Fresh Coffee • Cold Drinks • Bakery Items</p>
            <p>
              Take a break and enjoy freshly brewed coffee, refreshing cold drinks, and fresh bakery items at Jikmis
              Café. Whether you are starting your morning, working remotely, or relaxing after exploring Boudha, our
              cozy café offers a warm and peaceful atmosphere for every guest.
            </p>

            <div className="cafe-menu-card">
              <span>Popular Menu</span>
              <div className="cafe-popular-list">
                {popularCafeMenu.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="cafe-footer-row">
              <strong>Available for Apartment Guests & Visitors</strong>
              <button className="button primary" type="button" onClick={() => setIsCafeMenuOpen(true)}>
                View Full Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band luxury-band" id="amenities">
        <div className="section-shell">
          <div className="section-heading centered-heading">
            <p className="eyebrow">Amenities</p>
            <h2>Everything needed for an easy stay.</h2>
          </div>
          <div className="facility-grid">
            {amenities.map((item) => {
              const Icon = item.icon;
              return (
                <article className="facility-card premium-card" key={item.title}>
                  <Icon size={24} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell nearby-section" id="nearby">
        <div className="section-heading">
          <p className="eyebrow">Nearby Attractions</p>
          <h2>Stay close to the best of Boudha.</h2>
          <p>Walk to the stupa, find cafes easily, and keep airport access simple.</p>
        </div>
        <div className="nearby-grid">
          {attractions.map((item) => {
            const Icon = item.icon;
            return (
              <article className="nearby-card" key={item.title}>
                <Icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-shell review-section">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Guest Reviews</p>
          <h2>Warm stays, simple bookings, trusted comfort.</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="star-row">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}</div>
              <p>{review.quote}</p>
              <strong>{review.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell" id="gallery">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Gallery</p>
          <h2>Real rooms, real warmth.</h2>
        </div>
        <div className="luxury-gallery">
          {galleryImages.map((image, index) => (
            <img key={image} src={image} alt={`Jikmis Apartment gallery image ${index + 1}`} />
          ))}
        </div>
      </section>

      <section className="contact-section luxury-contact" id="contact">
        <div>
          <p className="eyebrow">Direct Booking</p>
          <h2>Ready to check availability?</h2>
          <p>
            Share your dates, apartment type, number of guests, and preferred contact method. Our AI assistant and team
            can help guide the next step.
          </p>
        </div>
        <div className="contact-actions">
          <a className="button primary" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> WhatsApp +{WHATSAPP_NUMBER}
          </a>
          <a className="button secondary" href={`tel:+${WHATSAPP_NUMBER}`}>
            <Phone size={18} /> Call +{WHATSAPP_NUMBER}
          </a>
        </div>
      </section>

      <section className="section-shell map-section" id="map">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Find Us</p>
          <h2>Jikmis Apartment near Boudhanath.</h2>
          <p>Open the map for directions to our serviced apartments in Boudha, Kathmandu.</p>
        </div>
        <div className="map-card">
          <iframe
            title="Jikmis Apartment Google Map"
            src="https://www.google.com/maps?q=Jikmis%20Apartment%20Boudha%20Kathmandu&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className="button primary map-button" href="https://maps.app.goo.gl/aRgUNak3RATee21c8" target="_blank" rel="noreferrer">
            <MapPin size={18} /> Open Google Maps
          </a>
        </div>
      </section>

      <footer className="site-footer luxury-footer">
        <span><Building2 size={16} /> Jikmis Apartment</span>
        <span><Users size={16} /> Serviced apartments in Boudha</span>
      </footer>

      {isCafeMenuOpen && (
        <div className="cafe-modal-backdrop" role="presentation" onClick={() => setIsCafeMenuOpen(false)}>
          <div
            className="cafe-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cafe-menu-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="cafe-modal-close"
              type="button"
              aria-label="Close Jikmis Café menu"
              onClick={() => setIsCafeMenuOpen(false)}
            >
              <X size={18} />
            </button>
            <p className="eyebrow"><Coffee size={16} /> Open Daily</p>
            <h2 id="cafe-menu-title">Jikmis Café Menu</h2>
            <div className="cafe-menu-grid">
              {cafeMenu.map((group) => (
                <section className="cafe-menu-group" key={group.category}>
                  <h3>{group.category}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {isBookingModalOpen && (
        <div className="cafe-modal-backdrop" role="presentation" onClick={() => setIsBookingModalOpen(false)}>
          <div
            className="cafe-modal booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="cafe-modal-close booking-modal-close"
              type="button"
              aria-label="Close booking form"
              onClick={() => setIsBookingModalOpen(false)}
            >
              <X size={18} />
            </button>
            <p className="eyebrow"><MessageCircle size={16} /> Almost done</p>
            <h2 id="booking-modal-title">Share your details to confirm</h2>
            <p>
              Requesting {bookingForm.roomType} from {bookingForm.checkIn || "—"} to {bookingForm.checkOut || "—"} for{" "}
              {bookingForm.guests || "—"} guest(s). We&apos;ll send this to our WhatsApp and to {INQUIRY_EMAIL} at the same
              time.
            </p>
            <form className="form-grid booking-modal-form" onSubmit={handleBookingSubmit}>
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Your name"
                  value={contactDetails.name}
                  onChange={(event) => setContactDetails((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={contactDetails.email}
                  onChange={(event) => setContactDetails((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                Phone Number
                <input
                  type="tel"
                  placeholder="+977..."
                  value={contactDetails.phone}
                  onChange={(event) => setContactDetails((current) => ({ ...current, phone: event.target.value }))}
                  required
                />
              </label>
              <button className="button primary" type="submit" disabled={bookingStatus === "sending"}>
                <Send size={18} /> {bookingStatus === "sending" ? "Sending..." : "Send to WhatsApp & Email"}
              </button>
              {bookingMessage ? (
                <p className={`message ${bookingStatus === "error" ? "error" : "success"}`} role="status">
                  {bookingMessage}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      )}

      <ApartmentChatbot />
    </main>
  );
}
