document.addEventListener("DOMContentLoaded", () => {
  drawServiceMap();
});

async function drawServiceMap() {
  // Load your data
  const calls = await fetch("service_calls.json").then(r => r.json());
  const customers = await fetch("customers.json").then(r => r.json());

  // Count calls per city
  const cityCounts = {};

  calls.forEach(call => {
    const customer = customers.find(c => c.customer_id === call.customer_id);
    if (!customer) return;

    const city = customer.city;
    if (!city) return;

    if (!cityCounts[city]) {
      cityCounts[city] = 0;
    }
    cityCounts[city]++;
  });

  // Initialize the map
  const map = L.map("service-map").setView([45.7, -122.6], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);

  // Load your GeoJSON polygons
  const geojson = await fetch("static/geojson/wa_cities.geojson").then(r => r.json());

  L.geoJSON(geojson, {
    style: feature => {
      const city = feature.properties.name;
      const calls = cityCounts[city] || 0;

      return {
        fillColor: getGoldColor(calls),
        color: "#333",
        weight: 1,
        fillOpacity: 0.7
      };
    },
    onEachFeature: (feature, layer) => {
      const city = feature.properties.name;
      const calls = cityCounts[city] || 0;
      layer.bindPopup(`<strong>${city}</strong><br>${calls} service calls`);
    }
  }).addTo(map);
}

// Function to determine fill color
function getGoldColor(count) {
  return count > 200 ? '#b8860b' :
         count > 100 ? '#daa520' :
         count > 50  ? '#ffd700' :
         count > 10  ? '#ffec8b' :
                       '#fff8dc';
}
