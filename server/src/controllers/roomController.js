const { z } = require("zod");
const prisma = require("../utils/prisma");

const roomBody = z.object({
  title: z.string().min(2),
  type: z.enum(["STUDIO", "SINGLE", "DOUBLE", "FAMILY"]),
  pricePerNight: z.coerce.number().int().positive(),
  pricePerMonth: z.coerce.number().int().positive(),
  description: z.string().min(10),
  facilities: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  isAvailable: z.boolean().default(true),
  maxGuests: z.coerce.number().int().positive().default(2)
});

const roomSchema = z.object({ body: roomBody });

async function listRooms(req, res) {
  const { type, maxPrice, available } = req.query;
  const rooms = await prisma.room.findMany({
    where: {
      type: type || undefined,
      pricePerNight: maxPrice ? { lte: Number(maxPrice) } : undefined,
      isAvailable: available === "true" ? true : undefined
    },
    orderBy: { pricePerNight: "asc" }
  });
  res.json({ rooms });
}

async function getRoom(req, res) {
  const room = await prisma.room.findUnique({
    where: { id: req.params.id },
    include: { bookings: { select: { checkIn: true, checkOut: true, status: true } } }
  });
  if (!room) return res.status(404).json({ message: "Room not found." });
  res.json({ room });
}

async function createRoom(req, res) {
  const room = await prisma.room.create({ data: req.validated.body });
  res.status(201).json({ room });
}

async function updateRoom(req, res) {
  const room = await prisma.room.update({ where: { id: req.params.id }, data: req.validated.body });
  res.json({ room });
}

async function deleteRoom(req, res) {
  await prisma.room.delete({ where: { id: req.params.id } });
  res.status(204).end();
}

module.exports = { createRoom, deleteRoom, getRoom, listRooms, roomSchema, updateRoom };
