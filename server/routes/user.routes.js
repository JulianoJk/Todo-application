const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  testRoute
} = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

router.get("/test", testRoute);
router.get("/profile", auth, getProfile);
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
