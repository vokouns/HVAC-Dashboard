document.addEventListener("DOMContentLoaded", () => {
  drawRevenueChart();
});

async function drawRevenueChart() {
  const serviceCalls = await fetch("service_calls.json").then(res => res.json());

  // We'll chart only 2025 data for clarity
  const thisYear = 2025;

  const monthlyRevenue = {};

  // Initialize revenue buckets
  for (let month = 1; month <= 12; month++) {
    monthlyRevenue[month] = {
      repair: 0,
      maintenance: 0
    };
  }

  serviceCalls.forEach(call => {
    if (call.type === "Free Quote") return; // skip quotes

    const date = parseDate(call.service_date);
    if (!date) return;

    if (date.getFullYear() !== thisYear) return;

    const month = date.getMonth() + 1; // 1-based month

    let priceStr = call.quoted_price.replace(/[^0-9.]/g, "");
    let price = parseFloat(priceStr);
    if (isNaN(price)) price = 0;

    if (call.type === "Service Call") {
      monthlyRevenue[month].repair += price;
    } else if (call.type === "Maintenance") {
      monthlyRevenue[month].maintenance += price;
    }
  });

  // Prepare chart labels and datasets
  const labels = Object.keys(monthlyRevenue).map(m => monthName(m));
  const repairData = Object.values(monthlyRevenue).map(m => m.repair);
  const maintenanceData = Object.values(monthlyRevenue).map(m => m.maintenance);

  renderAreaChart(labels, repairData, maintenanceData);
}

function renderAreaChart(labels, repairData, maintenanceData) {
  const ctx = document.getElementById('revenue-area-chart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Repair Revenue',
          data: repairData,
          fill: true,
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: 'rgba(0, 123, 255, 1)',
          tension: 0.3
        },
        {
          label: 'Maintenance Revenue',
          data: maintenanceData,
          fill: true,
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          borderColor: 'rgba(40, 167, 69, 1)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue ($)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        }
      }
    }
  });
}

function parseDate(dateStr) {
  if (!dateStr) return null;

  const parts = dateStr.split(/[\/\-]/);
  if (parts[0].length === 4) {
    // YYYY-MM-DD
    return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  } else {
    // MM/DD/YYYY
    return new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
  }
}

function monthName(num) {
  return [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ][num];
}
