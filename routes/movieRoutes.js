const express = require("express");

const Movie = require("../models/Movie");
const { ensureAuthenticated } = require("../config/middleware");
const { movieSchema, movieUpdateSchema } = require("../config/validation");

const router = express.Router();

function getTotalMinutes(durationHours, durationMinutes) {
  return durationHours * 60 + durationMinutes;
}

router.get("/", ensureAuthenticated, async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render("movies/index", {
      title: "Movies",
      movies,
      formData: {}
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { error, value } = movieSchema.validate(req.body, {
      abortEarly: false,
      convert: true
    });

    if (error) {
      throw new Error(error.details.map((detail) => detail.message).join(" "));
    }

    await Movie.create({
      movieName: value.movieName,
      duration: getTotalMinutes(value.durationHours, value.durationMinutes),
      isAdult: value.isAdult
    });
    req.session.success = "Movie created successfully.";
    res.redirect("/movie");
  } catch (error) {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.locals.error = error.message || "Unable to create movie.";
    res.status(400).render("movies/index", {
      title: "Movies",
      movies,
      formData: req.body
    });
  }
});

router.get("/:id/edit", ensureAuthenticated, async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      req.session.error = "Movie not found.";
      return res.redirect("/movie");
    }

    res.render("movies/edit", {
      title: "Edit Movie",
      movie
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { error, value } = movieUpdateSchema.validate(req.body, {
      abortEarly: false,
      convert: true
    });

    if (error) {
      throw new Error(error.details.map((detail) => detail.message).join(" "));
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      req.session.error = "Movie not found.";
      return res.redirect("/movie");
    }

    movie.duration = getTotalMinutes(value.durationHours, value.durationMinutes);
    movie.isAdult = value.isAdult;
    await movie.save();

    req.session.success = "Movie updated successfully.";
    res.redirect("/movie");
  } catch (error) {
    const movie = await Movie.findById(req.params.id);
    res.locals.error = error.message || "Unable to update movie.";

    if (!movie) {
      return res.redirect("/movie");
    }

    movie.duration =
      getTotalMinutes(Number(req.body.durationHours || 0), Number(req.body.durationMinutes || 0));
    movie.isAdult = req.body.isAdult === "true";

    res.status(400).render("movies/edit", {
      title: "Edit Movie",
      movie
    });
  }
});

router.post("/:id/delete", ensureAuthenticated, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    req.session.success = "Movie deleted successfully.";
    res.redirect("/movie");
  } catch (error) {
    req.session.error = "Unable to delete movie.";
    res.redirect("/movie");
  }
});

module.exports = router;
