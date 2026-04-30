const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

connectDB();
configurePassport(passport);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "exam-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.error = req.session.error || null;
  res.locals.success = req.session.success || null;
  delete req.session.error;
  delete req.session.success;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/movie");
});

app.use("/", authRoutes);
app.use("/movie", movieRoutes);

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
