const { z } = require("zod");
const prisma = require("../utils/prisma");
const { createBooking } = require("../services/bookingService");

const bookingSchema = z.object({
  body: z.object({
    roomId: z.string().min(1),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guestCount: z.coerce.number().int().positive().default(1),
    note: z.string().optional()
  }).refine((value) => value.checkOut > value.checkIn, {
    message: "Check-out must be after check-in.",
    path: ["checkOut"]
  })
});

const statusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"])
  })
});

async function listBookings(req, res) {
  const where = req.user.role === "ADMIN" ? {} : { userId: req.user.sub };
  const bookings = await prisma.booking.findMany({
    where,
    include: { room: true, user: { select: { id: true, name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ bookings });
}

async function bookRoom(req, res) {
  const booking = await createBooking({ userId: req.user.sub, ...req.validated.body });
  res.status(201).json({ booking });
}

async function updateBookingStatus(req, res) {
  const booking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: req.validated.body.status },
    include: { room: true, user: { select: { id: true, name: true, email: true, phone: true } } }
  });
  res.json({ booking });
}

async function deleteBooking(req, res) {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  if (req.user.role !== "ADMIN" && booking.userId !== req.user.sub) {
    return res.status(403).json({ message: "You cannot delete this booking." });
  }
  await prisma.booking.delete({ where: { id: req.params.id } });
  res.status(204).end();
}

module.exports = { bookingSchema, bookRoom, deleteBooking, listBookings, statusSchema, updateBookingStatus };
