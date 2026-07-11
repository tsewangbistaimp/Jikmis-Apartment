"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Booking, currency, Room } from "@/lib/api";

type Stats = { totalBookings: number; pendingBookings: number; approvedBookings: number; rejectedBookings: number; rooms: number; users: number; approvedRevenue: number };
type RoomForm = {
  title: string;
  type: Room["type"];
  pricePerNight: string;
  pricePerMonth: string;
  maxGuests: string;
  description: string;
  facilities: string;
  rules: string;
  images: string;
  isAvailable: boolean;
};

const emptyRoomForm: RoomForm = {
  title: "",
  type: "STUDIO",
  pricePerNight: "3000",
  pricePerMonth: "50000",
  maxGuests: "2",
  description: "",
  facilities: "Hot shower, Kitchen access, WiFi, Parking",
  rules: "No smoking, Quiet hours after 10 PM",
  images: "",
  isAvailable: true
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [roomForm, setRoomForm] = useState<RoomForm>(emptyRoomForm);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  async function load() {
    try {
      const [dashboard, bookingData, roomData] = await Promise.all([
        api<{ stats: Stats }>("/admin/dashboard"),
        api<{ bookings: Booking[] }>("/bookings"),
        api<{ rooms: Room[] }>("/rooms")
      ]);
      setStats(dashboard.stats);
      setBookings(bookingData.bookings);
      setRooms(roomData.rooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin data failed to load.");
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [dashboard, bookingData, roomData] = await Promise.all([
          api<{ stats: Stats }>("/admin/dashboard"),
          api<{ bookings: Booking[] }>("/bookings"),
          api<{ rooms: Room[] }>("/rooms")
        ]);
        setStats(dashboard.stats);
        setBookings(bookingData.bookings);
        setRooms(roomData.rooms);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Admin data failed to load.");
      }
    }

    void loadInitialData();
  }, []);

  async function setStatus(id: string, status: "APPROVED" | "REJECTED") {
    await api(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  function editRoom(room: Room) {
    setEditingRoomId(room.id);
    setRoomForm({
      title: room.title,
      type: room.type,
      pricePerNight: String(room.pricePerNight),
      pricePerMonth: String(room.pricePerMonth),
      maxGuests: String(room.maxGuests),
      description: room.description,
      facilities: room.facilities.join(", "),
      rules: room.rules.join(", "),
      images: room.images.join("\n"),
      isAvailable: room.isAvailable
    });
  }

  async function saveRoom(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      ...roomForm,
      pricePerNight: Number(roomForm.pricePerNight),
      pricePerMonth: Number(roomForm.pricePerMonth),
      maxGuests: Number(roomForm.maxGuests),
      facilities: roomForm.facilities.split(",").map((item) => item.trim()).filter(Boolean),
      rules: roomForm.rules.split(",").map((item) => item.trim()).filter(Boolean),
      images: roomForm.images.split("\n").map((item) => item.trim()).filter(Boolean)
    };
    await api(editingRoomId ? `/rooms/${editingRoomId}` : "/rooms", {
      method: editingRoomId ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    setRoomForm(emptyRoomForm);
    setEditingRoomId(null);
    load();
  }

  async function deleteRoom(id: string) {
    await api(`/rooms/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main>
      <Header />
      <section className="section-shell">
        <p className="eyebrow">Admin Dashboard</p>
        <h1>Manage rooms and bookings.</h1>
        {error && <p className="message error">{error}</p>}
        {stats && <div className="stat-grid">{Object.entries(stats).map(([key, value]) => <div className="stat" key={key}><span>{key}</span><strong>{key === "approvedRevenue" ? currency(value) : value}</strong></div>)}</div>}
      </section>
      <section className="section-shell admin-grid">
        <div className="dashboard-panel">
          <h2>Bookings</h2>
          <div className="table">{bookings.map((booking) => <div className="row" key={booking.id}><div><strong>{booking.room.title}</strong><p className="muted">{booking.user?.name} - {booking.user?.email}</p></div><span className={`status ${booking.status}`}>{booking.status}</span><div className="status-actions"><button className="small-button" onClick={() => setStatus(booking.id, "APPROVED")}>Approve</button><button className="small-button" onClick={() => setStatus(booking.id, "REJECTED")}>Reject</button></div></div>)}</div>
        </div>
        <div className="dashboard-panel">
          <h2>Room management</h2>
          <form className="form-grid" onSubmit={saveRoom}>
            <label>Title<input value={roomForm.title} onChange={(event) => setRoomForm({ ...roomForm, title: event.target.value })} required /></label>
            <label>Type<select value={roomForm.type} onChange={(event) => setRoomForm({ ...roomForm, type: event.target.value as Room["type"] })}><option value="STUDIO">Studio</option><option value="SINGLE">Single</option><option value="DOUBLE">Double</option><option value="FAMILY">Family</option></select></label>
            <label>Price per night<input type="number" value={roomForm.pricePerNight} onChange={(event) => setRoomForm({ ...roomForm, pricePerNight: event.target.value })} required /></label>
            <label>Price per month<input type="number" value={roomForm.pricePerMonth} onChange={(event) => setRoomForm({ ...roomForm, pricePerMonth: event.target.value })} required /></label>
            <label>Max guests<input type="number" value={roomForm.maxGuests} onChange={(event) => setRoomForm({ ...roomForm, maxGuests: event.target.value })} required /></label>
            <label>Description<textarea rows={3} value={roomForm.description} onChange={(event) => setRoomForm({ ...roomForm, description: event.target.value })} required /></label>
            <label>Facilities<input value={roomForm.facilities} onChange={(event) => setRoomForm({ ...roomForm, facilities: event.target.value })} /></label>
            <label>Rules<input value={roomForm.rules} onChange={(event) => setRoomForm({ ...roomForm, rules: event.target.value })} /></label>
            <label>Image URLs<textarea rows={3} value={roomForm.images} onChange={(event) => setRoomForm({ ...roomForm, images: event.target.value })} required /></label>
            <label className="check-row"><input type="checkbox" checked={roomForm.isAvailable} onChange={(event) => setRoomForm({ ...roomForm, isAvailable: event.target.checked })} /> Available</label>
            <div className="status-actions">
              <button className="button primary" type="submit">{editingRoomId ? "Update room" : "Add room"}</button>
              {editingRoomId && <button className="button secondary" type="button" onClick={() => { setEditingRoomId(null); setRoomForm(emptyRoomForm); }}>Cancel</button>}
            </div>
          </form>
          <div className="table room-admin-list">{rooms.map((room) => <div className="row" key={room.id}><strong>{room.title}</strong><span>{room.type}</span><div className="status-actions"><button className="small-button" onClick={() => editRoom(room)}>Edit</button><button className="small-button" onClick={() => deleteRoom(room.id)}>Delete</button></div></div>)}</div>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return <header className="site-header"><Link className="brand" href="/"><span className="brand-mark">JA</span><span>Jikmis Apartment</span></Link><nav><Link href="/rooms">Rooms</Link><Link href="/dashboard">User dashboard</Link><Link href="/login">Login</Link></nav></header>;
}
