// server/controllers/movieController.js

const axios = require("axios");
const TMDB_API_KEY = process.env.TMDB_API_KEY;

exports.searchMovies = async (req, res) => {
  const { query } = req.query;
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
    res.status(500).json({ error: "Search failed" });
  }
};
