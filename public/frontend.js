const items = [
  "Snakebite Case",
  "Revolver Case",
  "Paris 2023 Challengers Sticker Capsule",
  "Paris 2023 Legends Sticker Capsule",
  "Paris 2023 Contenders Sticker Capsule",
];

const inventory = {
  "Snakebite Case": 146,
  "Revolver Case": 49,
  "Paris 2023 Challengers Sticker Capsule": 336,
  "Paris 2023 Legends Sticker Capsule": 380,
  "Paris 2023 Contenders Sticker Capsule": 439,
};


async function fetchPrice(item) {
  const url = `/price?item=${encodeURIComponent(item)}`;
  const res = await fetch(url);
  return res.json();
}

async function fetchPriceWithRetry(item, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const data = await fetchPrice(item);
      if (data && data.success) return data;
    } catch (err) {
      console.error("Fehler bei", item, err);
    }
    // kleine Pause zwischen den Versuchen
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return { lowest_price: null, median_price: null, volume: null };
}

async function loadItems() {
  const container = document.getElementById("items");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const data = await fetchPriceWithRetry(item);

    // Anzahl aus deinem Inventar
    const count = inventory[item] || 0;

    // Preis als Zahl extrahieren (Steam liefert oft "0,03€" oder "$0.03")
    let priceNumber = 0;
    if (data.lowest_price) {
      // Beispiel: "0,03€" → 0.03
      priceNumber = parseFloat(
        data.lowest_price.replace(/[^\d,.-]/g, "").replace(",", ".")
      );
    }

    const totalValue = count > 0 ? (priceNumber * count).toFixed(2) : null;

  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <h2>${item.replace("Paris 2023", "Paris 2023<br>")}</h2>
    <div id="itembox">
      <p><strong>Lowest:</strong> ${data.lowest_price || "Keine Daten"}</p>
      <p><strong>Median:</strong> ${data.median_price || "Keine Daten"}</p>
      <p><strong>Verkauft letzte 24H:</strong> ${data.volume || "Keine Daten"}</p>
    </div>
    <p id="item-count"><strong>Anzahl Items:</strong> ${count}</p>
    <p><strong>Gesamtwert:</strong> ${
      totalValue ? totalValue + "€" : "Keine Daten"
    }</p>
  `;
  container.appendChild(div);

    // kleine Pause zwischen Items, damit Steam nicht blockt
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

loadItems();