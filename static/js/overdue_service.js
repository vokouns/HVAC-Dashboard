document.addEventListener("DOMContentLoaded", () => {
  loadOverdueCustomers();
});

async function loadOverdueCustomers() {
  const customers = await fetch("customers.json").then(res => res.json());

  const overdue = findOverdueCustomers(customers);
  renderOverdueCustomers(overdue);
}

function findOverdueCustomers(data) {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const overdue = [];

  data.forEach(c => {
    if (!c.last_service_date) return;

    const serviceDate = parseDate(c.last_service_date);

    if (serviceDate && serviceDate <= sixMonthsAgo) {
      overdue.push({
        customerName: `${c.first_name} ${c.last_name}`,
        phone: c.phone,
        email: c.email,
        lastServiceDate: serviceDate.toISOString().split('T')[0]
      });
    }
  });

  // sort by oldest service date
  overdue.sort((a, b) => new Date(a.lastServiceDate) - new Date(b.lastServiceDate));

  return overdue;
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

function renderOverdueCustomers(customers) {
  const container = document.getElementById("overdue-customers-table-body");
  if (!container) return;

  container.innerHTML = "";

  customers.forEach(c => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.customerName}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td>${c.lastServiceDate}</td>
    `;
    container.appendChild(row);
  });
}
