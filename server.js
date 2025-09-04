import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Statische Dateien (deine index.html usw.)
app.use(express.static("public"));

// Proxy-Route für Steam API
app.get("/price", async (req, res) => {
  const item = req.query.item;
  const url = `https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=${item}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Abrufen" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server läuft auf http://localhost:${PORT}`)
);