# HVAC Demo Dashboard

This project is a demo dashboard designed to showcase how an HVAC service business might visualize and track operational data such as service calls, revenue, customer memberships, and geographic service coverage.

The dashboard presents synthetic data and offers interactive visualizations to explore business trends.

---

## 📊 Features

✅ **KPIs**
- Total revenue (YTD)
- Count of service calls (quotes vs. non-quotes)
- Free quote revenue pipeline breakdown

✅ **Visualizations**
- Area chart of revenue by month for repair vs. maintenance calls
- Interactive map showing service calls by city, shaded in gold tones to indicate call volume
- Lists of customers overdue for service
- Tables of membership expirations:
  - Recently expired
  - Expiring soon

✅ **Collapsible sections**
- Overdue service lists
- Membership expiration tables

---

## ⚙️ Tools & Technologies

- **HTML/CSS/JavaScript** → Front-end structure and styling
- **Chart.js** → For rendering charts (area chart)
- **Leaflet.js** → For rendering interactive maps
- **Faker (Python)** → To generate synthetic customer and service call data
- **Pandas (Python)** → To format data and export as JSON
- **GeoJSON** → To store and visualize real geographic city boundaries
- **Mapshaper** → Used to filter TIGER/Line shapefiles and produce custom GeoJSON boundaries for selected cities

---

## 🛠️ How the Data Was Generated

All data in this dashboard is synthetic.

- Customer data was created using Python’s **Faker** library:
  - Names, emails, phone numbers, addresses
  - HVAC system types, brands, installation dates
  - Membership expiration dates
- Service call data was randomly generated:
  - Tied to customer IDs
  - Includes dates, service types, descriptions, status, and quoted prices
- The data was saved into:
  - `customers.json`
  - `service_calls.json`

GeoJSON boundaries were created by downloading official U.S. Census Bureau TIGER/Line shapefiles and filtering for specific cities in Southwest Washington using **Mapshaper**.

---

## 🚀 How to Run

1. Clone or download this repository.
2. Place all JSON data files into the root or `static/` folder as referenced by the HTML scripts.
3. Open `index.html` in a web browser.
4. The dashboard should load automatically, displaying:
    - KPIs
    - Charts
    - Maps
    - Interactive tables

---

## 🎨 Notes

- All data is fictional and intended for demonstration purposes only.
- Colors, layout, and data structure can be easily customized for a real-world application.

---
