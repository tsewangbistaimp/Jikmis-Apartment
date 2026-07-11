require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const roomRoutes = require("./routes/roomRoutes");
const { errorHandler, notFound } = require("./middleware/error");

const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || "127.0.0.1";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, service: "jikmis-apartment-api" }));
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, host, () => {
  console.log(`Jikmis Apartment API running on http://${host}:${port}`);
});
