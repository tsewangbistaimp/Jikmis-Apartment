const prisma = require("../utils/prisma");

async function dashboard(req, res) {
  const [totalBookings, pendingBookings, approvedBookings, rejectedBookings, rooms, users, revenue] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "APPROVED" } }),
    prisma.booking.count({ where: { status: "REJECTED" } }),
    prisma.room.count(),
    prisma.user.count(),
    prisma.booking.aggregate({ where: { status: "APPROVED" }, _sum: { totalPrice: true } })
  ]);

  res.json({
    stats: {
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      rooms,
      users,
      approvedRevenue: revenue._sum.totalPrice || 0
    }
  });
}

async function users(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ users });
}

module.exports = { dashboard, users };
