const express = require("express");
const axios = require("axios");
const cors = require("cors");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = "41e1be9067906078a5376f1461823e5d";

// Current weather by city
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// Current weather by coordinates
app.get("/weather-by-coords", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "Latitude and Longitude required" });

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
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// 5-day forecast by city
app.get("/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const dailyData = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });

    const forecast = Object.values(dailyData).slice(0, 5).map((item) => ({
      date: item.dt_txt.split(" ")[0],
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    res.json({ city: data.city.name, forecast });
  } catch (error) {
    res.status(500).json({ error: "Error fetching forecast data" });
  }
});

// ✅ NEW: 5-day forecast by coordinates
app.get("/forecast-by-coords", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "Latitude and Longitude required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const dailyData = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });

    const forecast = Object.values(dailyData).slice(0, 5).map((item) => ({
      date: item.dt_txt.split(" ")[0],
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    res.json({ city: data.city.name, forecast });
  } catch (error) {
    res.status(500).json({ error: "Error fetching forecast data by coords" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});