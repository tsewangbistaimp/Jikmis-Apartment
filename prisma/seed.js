const { PrismaClient, Role, RoomType } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@jikmis.com" },
    update: {},
    create: {
      name: "Jikmis Admin",
      email: "admin@jikmis.com",
      phone: "+9779800000000",
      passwordHash,
      role: Role.ADMIN
    }
  });

  const rooms = [
    {
      title: "Boudha View Studio",
      type: RoomType.STUDIO,
      pricePerNight: 3200,
      pricePerMonth: 52000,
      maxGuests: 2,
      description: "A bright studio apartment near Boudha with a compact kitchen, work desk, and calm natural light.",
      facilities: ["Hot shower", "Kitchen access", "WiFi", "Parking"],
      rules: ["No smoking", "Quiet hours after 10 PM"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      title: "Single Room Retreat",
      type: RoomType.SINGLE,
      pricePerNight: 2200,
      pricePerMonth: 36000,
      maxGuests: 1,
      description: "A clean private single room for students, professionals, and short Kathmandu stays.",
      facilities: ["Hot shower", "WiFi", "Parking"],
      rules: ["No smoking", "Quiet hours after 10 PM"],
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      title: "Double Comfort Apartment",
      type: RoomType.DOUBLE,
      pricePerNight: 4200,
      pricePerMonth: 68000,
      maxGuests: 3,
      description: "A practical double room with shared kitchen access, parking, and fast WiFi.",
      facilities: ["Hot shower", "Kitchen access", "WiFi", "Parking"],
      rules: ["No smoking", "Quiet hours after 10 PM"],
      images: [
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      title: "Family Stay Suite",
      type: RoomType.FAMILY,
      pricePerNight: 6200,
      pricePerMonth: 98000,
      maxGuests: 5,
      description: "A larger family apartment with flexible sleeping space and easy access to Boudha services.",
      facilities: ["Hot shower", "Kitchen access", "WiFi", "Parking"],
      rules: ["No smoking", "Quiet hours after 10 PM"],
      images: [
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80"
      ]
    }
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: room.title.toLowerCase().replaceAll(" ", "-") },
      update: room,
      create: { id: room.title.toLowerCase().replaceAll(" ", "-"), ...room }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
