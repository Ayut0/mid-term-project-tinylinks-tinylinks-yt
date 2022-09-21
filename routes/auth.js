const express = require("express");
const router = express.Router();
const {
  showLogin,
  showRegister,
  loginUser,
  newUser,
  logout,
} = require("../controllers/auth.js");

router.get("/login", showLogin);

router.post("/login", loginUser);

router.get("/register", showRegister);

router.post("/register", newUser);

router.post("/logout", logout);

module.exports = router;
