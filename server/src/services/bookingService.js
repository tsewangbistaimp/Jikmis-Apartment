const prisma = require("../utils/prisma");
const { calculatePrice } = require("../utils/pricing");

async function hasBookingConflict(roomId, checkIn, checkOut, excludeBookingId) {
  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { in: ["PENDING", "APPROVED"] },
      checkIn: { lt: new Date(checkOut) },
      checkOut: { gt: new Date(checkIn) }
    }
  });
  return Boolean(conflict);
}

async function createBooking({ userId, roomId, checkIn, checkOut, guestCount, note }) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room || !room.isAvailable) {
    const error = new Error("Room is not available.");
    error.status = 404;
    throw error;
  }

  if (await hasBookingConflict(roomId, checkIn, checkOut)) {
    const error = new Error("This room is already booked for the selected dates.");
    error.status = 409;
    throw error;
  }

  return prisma.booking.create({
    data: {
      userId,
      roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guestCount,
      note,
      totalPrice: calculatePrice(room, checkIn, checkOut)
    },
    include: { room: true, user: { select: { id: true, name: true, email: true, phone: true } } }
  });
}

module.exports = { createBooking, hasBookingConflict };
