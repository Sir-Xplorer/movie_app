// server/routes/movies.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const User = require("../models/User");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// === PUBLIC ROUTES ===

// @desc    Search for movies
// @route   GET /api/movies/search?query=batman
router.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
      },
    });

    res.json(response.data.results);
  } catch (err) {
    console.error("TMDB search error:", err.message);
    res.status(500).json({ error: "TMDB search failed" });
  }
});

// @desc    Get popular movies
// @route   GET /api/movies/popular
router.get("/popular", async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    res.json(response.data.results);
  } catch (err) {
    console.error("TMDB popular fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch popular movies" });
  }
});

// @desc    Get movie details
// @route   GET /api/movies/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("TMDB movie details error:", err.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});


// === AUTHENTICATED ROUTES ===

// @desc    Save movie to favorites
// @route   POST /api/movies/favorite
// @access  Private
router.post("/favorite", auth, async (req, res) => {
  const { movie } = req.body;

  if (!movie || !movie.id) return res.status(400).json({ error: "Movie data required" });

  try {
    const user = await User.findById(req.user.id);

    const alreadyFavorited = user.favorites.find((m) => m.id === movie.id);
    if (alreadyFavorited) return res.status(400).json({ error: "Movie already in favorites" });

    user.favorites.push(movie);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    console.error("Favorite movie error:", err.message);
    res.status(500).json({ error: "Failed to save favorite" });
  }
});

// @desc    Get user's favorite movies
// @route   GET /api/movies/favorites
// @access  Private
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (err) {
    console.error("Get favorites error:", err.message);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// @desc    Remove movie from favorites
// @route   DELETE /api/movies/favorite/:id
// @access  Private
router.delete("/favorite/:id", auth, async (req, res) => {
  const movieId = parseInt(req.params.id);

  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter((m) => m.id !== movieId);
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error("Remove favorite error:", err.message);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

module.exports = router;
