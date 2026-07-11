const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../utils/prisma");
const { signToken } = require("../middleware/auth");

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

async function register(req, res) {
  const { name, email, phone, password } = req.validated.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email is already registered." });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash: await bcrypt.hash(password, 12)
    },
    select: { id: true, name: true, email: true, phone: true, role: true }
  });

  res.status(201).json({ user, token: signToken(user) });
}

async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const safeUser = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
  res.json({ user: safeUser, token: signToken(user) });
}

module.exports = { login, loginSchema, register, registerSchema };
