const express = require("express");
const {
  loginUser,
  signupUser,
  getUser,
} = require("../controllers/userController");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/auth", loginUser);
router.post("/", signupUser);
router.get("/profile", requireAuth, getUser);

module.exports = router;
