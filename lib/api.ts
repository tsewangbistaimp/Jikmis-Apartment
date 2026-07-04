export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Room = {
  id: string;
  title: string;
  type: "STUDIO" | "SINGLE" | "DOUBLE" | "FAMILY";
  pricePerNight: number;
  pricePerMonth: number;
  description: string;
  facilities: string[];
  rules: string[];
  images: string[];
  isAvailable: boolean;
  maxGuests: number;
};

export type Booking = {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  guestCount: number;
  room: Room;
  user?: { name: string; email: string; phone?: string };
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("jikmis_token") : null;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    cache: "no-store"
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

export function currency(value: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0
  }).format(value);
}
