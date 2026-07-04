"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  Building2,
  Car,
  Check,
  ChefHat,
  Coffee,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wifi
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
  "/images/jikmis/family-room-sunroom.jpeg"
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

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

  const heroImage = useMemo(() => roomShowcase[2].images[activePhoto % roomShowcase[2].images.length], [activePhoto]);

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
          <a href="#amenities">Amenities</a>
          <a href="#nearby">Nearby</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Book</a>
        </nav>
      </header>

      <section className="luxury-hero">
        <img className="luxury-hero-image" src={heroImage} alt="Luxury serviced apartment at Jikmis Apartment" />
        <div className="luxury-hero-overlay" />
        <div className="luxury-hero-content">
          <p className="eyebrow"><MapPin size={16} /> Boudha, Kathmandu</p>
          <h1>Jikmis Apartment near Boudhanath.</h1>
          <p>
            Boutique studios and family apartments with warm interiors, private kitchens, hot water, and direct booking
            assistance in the heart of Boudha.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="https://wa.me/9779708538395" target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> Book on WhatsApp
            </a>
            <a className="button secondary hero-secondary" href="#rooms">
              Explore rooms
            </a>
          </div>
        </div>
        <div className="hero-booking-card">
          <span>From</span>
          <strong>NPR 1,500</strong>
          <p>Daily stays and monthly rentals available.</p>
        </div>
      </section>

      <section className="section-shell luxury-about" id="about">
        <div>
          <p className="eyebrow">About Jikmis</p>
          <h2>A quiet boutique stay designed for comfort in Boudha.</h2>
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
          <a className="button primary" href="https://wa.me/9779708538395" target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> WhatsApp +9779708538395
          </a>
          <a className="button secondary" href="tel:+9779708538395">
            <Phone size={18} /> Call +9779708538395
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
        <span><Users size={16} /> Boutique serviced apartments in Boudha</span>
      </footer>

      <ApartmentChatbot />
    </main>
  );
}
