const router = require("express").Router();
const validate = require("../middleware/validate");
const { requireAdmin, requireAuth } = require("../middleware/auth");
const { bookingSchema, bookRoom, deleteBooking, listBookings, statusSchema, updateBookingStatus } = require("../controllers/bookingController");

router.get("/", requireAuth, listBookings);
router.post("/", requireAuth, validate(bookingSchema), bookRoom);
router.patch("/:id/status", requireAuth, requireAdmin, validate(statusSchema), updateBookingStatus);
router.delete("/:id", requireAuth, deleteBooking);

module.exports = router;
