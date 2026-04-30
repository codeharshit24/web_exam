const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/User");
const { ensureGuest } = require("../config/middleware");
const { registerSchema, loginSchema } = require("../config/validation");

const router = express.Router();

router.get("/register", ensureGuest, (req, res) => {
  res.render("auth/register", {
    title: "Register",
    formData: {}
  });
});

router.post("/register", ensureGuest, async (req, res) => {
  const formData = {
    name: req.body.name,
    username: req.body.username,
    gender: req.body.gender,
    ticketNumber: req.body.ticketNumber,
    row: req.body.row
  };

  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      convert: true
    });

    if (error) {
      throw new Error(error.details.map((detail) => detail.message).join(" "));
    }

    const existingUser = await User.findOne({ username: value.username });

    if (existingUser) {
      throw new Error("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    await User.create({
      ...value,
      password: hashedPassword
    });

    req.session.success = "Registration successful. Please login.";
    res.redirect("/login");
  } catch (error) {
    res.locals.error = error.message || "Unable to register user.";
    res.status(400).render("auth/register", {
      title: "Register",
      formData
    });
  }
});

router.get("/login", ensureGuest, (req, res) => {
  res.render("auth/login", {
    title: "Login",
    formData: {}
  });
});

router.post("/login", ensureGuest, (req, res, next) => {
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    res.locals.error = error.details.map((detail) => detail.message).join(" ");
    return res.status(400).render("auth/login", {
      title: "Login",
      formData: {
        username: req.body.username
      }
    });
  }

  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      return next(authError);
    }

    if (!user) {
      res.locals.error = info.message;
      return res.status(401).render("auth/login", {
        title: "Login",
        formData: {
          username: req.body.username
        }
      });
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      req.session.success = "Login successful.";
      return res.redirect("/movie");
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.success = "Logged out successfully.";
    return res.redirect("/login");
  });
});

module.exports = router;
