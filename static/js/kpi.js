document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {
  const serviceCalls = await fetch("service_calls.json").then(res => res.json());

  // Calculate KPIs
  const revenue = calculateRevenue(serviceCalls);
  const nonQuoteCount = countNonQuoteCalls(serviceCalls);
  const quoteCount = countQuoteCalls(serviceCalls);

  // Display KPIs
  renderKPIs(revenue, nonQuoteCount, quoteCount);
}

function calculateRevenue(data) {
  let total = 0;

  data.forEach(call => {
    // Parse date
    const dateParts = call.service_date.split(/[\/\-]/);
    let year;
    if (dateParts[0].length === 4) {
      // Format: YYYY-MM-DD
      year = parseInt(dateParts[0]);
    } else {
      // Format: MM/DD/YYYY
      year = parseInt(dateParts[2]);
    }

    if (year === 2025 && call.type !== "Free Quote") {
      let priceStr = call.quoted_price.replace(/[^0-9.]/g, "");
      let price = parseFloat(priceStr);
      if (!isNaN(price)) {
        total += price;
      }
    }
  });

  return total;
}

function countNonQuoteCalls(data) {
  return data.filter(call => call.type !== "Free Quote").length;
}

function countQuoteCalls(data) {
  return data.filter(call => call.type === "Free Quote").length;
}

function renderKPIs(revenue, nonQuoteCount, quoteCount) {
  const container = document.getElementById("service-summary");

  container.innerHTML = `
    <div class="kpi-card">
      <h3>Total Revenue (YTD)</h3>
      <p>$${revenue.toLocaleString()}</p>
    </div>
    <div class="kpi-card">
      <h3>Non-Quote Service Calls</h3>
      <p>${nonQuoteCount}</p>
    </div>
    <div class="kpi-card">
      <h3>Free Quote Calls</h3>
      <p>${quoteCount}</p>
    </div>
  `;
}
