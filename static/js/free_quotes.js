document.addEventListener("DOMContentLoaded", () => {
  loadFreeQuotes();
});

async function loadFreeQuotes() {
  const serviceCalls = await fetch("service_calls.json").then(res => res.json());

  const freeQuoteKPIs = calculateFreeQuoteKPIs(serviceCalls);
  renderFreeQuoteKPIs(freeQuoteKPIs);
}

function calculateFreeQuoteKPIs(data) {
  let completedRevenue = 0;
  let scheduledRevenue = 0;
  let canceledRevenue = 0;

  const today = new Date();
  const thisYear = today.getFullYear();

  data.forEach(call => {
    // only look at Free Quotes
    if (call.type === "Free Quote") {
      const callDate = parseDate(call.service_date);

      if (callDate && callDate.getFullYear() === thisYear && callDate <= today) {
        let priceStr = call.quoted_price.replace(/[^0-9.]/g, "");
        let price = parseFloat(priceStr);
        if (isNaN(price)) price = 0;

        if (call.status === "Completed") {
          completedRevenue += price;
        } else if (call.status === "Scheduled") {
          scheduledRevenue += price;
        } else if (call.status === "Canceled") {
          canceledRevenue += price;
        }
      }
    }
  });

  return {
    completedRevenue,
    scheduledRevenue,
    canceledRevenue,
  };
}

function parseDate(dateStr) {
  if (!dateStr) return null;

  // Handle MM/DD/YYYY or YYYY-MM-DD
  const parts = dateStr.split(/[\/\-]/);
  if (parts[0].length === 4) {
    // YYYY-MM-DD
    return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  } else {
    // MM/DD/YYYY
    return new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
  }
}

function renderFreeQuoteKPIs(kpis) {
  const container = document.getElementById("free-quote-summary");

  if (!container) return;

  container.innerHTML = `
    <div class="kpi-card completed">
      <h3>Revenue from Completed Quotes (YTD)</h3>
      <p>$${kpis.completedRevenue.toLocaleString()}</p>
    </div>
    <div class="kpi-card scheduled">
      <h3>Estimated Revenue from Scheduled Quotes (YTD)</h3>
      <p>$${kpis.scheduledRevenue.toLocaleString()}</p>
    </div>
    <div class="kpi-card canceled">
      <h3>Lost Revenue from Canceled Quotes (YTD)</h3>
      <p>$${kpis.canceledRevenue.toLocaleString()}</p>
    </div>
  `;
}
