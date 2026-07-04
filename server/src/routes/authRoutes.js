const router = require("express").Router();
const validate = require("../middleware/validate");
const { login, loginSchema, register, registerSchema } = require("../controllers/authController");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
