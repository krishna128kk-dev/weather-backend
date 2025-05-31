const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const API_KEY = process.env.OPENWEATHER_API_KEY; // Make sure this is set in your .env or Render environment variables

// Get weather by city
app.get("/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Get forecast by city
app.get("/forecast", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url);
    const forecastList = response.data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    const forecast = forecastList.map((item) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    res.json({ forecast });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

// Get weather by coordinates
app.get("/weather-by-coords", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ error: "Latitude and longitude are required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather by coordinates" });
  }
});

// Get forecast by coordinates
app.get("/forecast-by-coords", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ error: "Latitude and longitude are required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url);
    const forecastList = response.data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    const forecast = forecastList.map((item) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    res.json({ forecast });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecast by coordinates" });
  }
});

// Fallback route
app.get("/", (req, res) => {
  res.send("🌦️ Weather API is running!");
});

// Listen on provided port for deployment (Render/Heroku/etc.)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
