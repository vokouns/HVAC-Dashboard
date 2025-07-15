document.addEventListener("DOMContentLoaded", () => {
  loadMembershipExpirations();
});

async function loadMembershipExpirations() {
  const customers = await fetch("customers.json").then(res => res.json());

  const {
    recentlyExpired,
    upcomingExpirations
  } = splitMemberships(customers);

  renderMembershipTable(recentlyExpired, "expired-memberships-table-body");
  renderMembershipTable(upcomingExpirations, "upcoming-memberships-table-body");
}

function splitMemberships(data) {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const sixMonthsAhead = new Date();
  sixMonthsAhead.setMonth(today.getMonth() + 6);

  const recentlyExpired = [];
  const upcomingExpirations = [];

  data.forEach(c => {
    if (!c.membership_expire_date) return;

    const expireDate = parseDate(c.membership_expire_date);
    if (!expireDate) return;

    if (expireDate < today && expireDate >= sixMonthsAgo) {
      recentlyExpired.push(createRowData(c, expireDate));
    } else if (expireDate > today && expireDate <= sixMonthsAhead) {
      upcomingExpirations.push(createRowData(c, expireDate));
    }
  });

  // sort each list by expiration date
  recentlyExpired.sort((a, b) => new Date(a.membership_expire_date) - new Date(b.membership_expire_date));
  upcomingExpirations.sort((a, b) => new Date(a.membership_expire_date) - new Date(b.membership_expire_date));

  return {
    recentlyExpired,
    upcomingExpirations
  };
}

function createRowData(c, expireDate) {
  return {
    customerName: `${c.first_name} ${c.last_name}`,
    phone: c.phone,
    email: c.email,
    membership_expire_date: expireDate.toISOString().split('T')[0]
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

function renderMembershipTable(data, tableBodyId) {
  const container = document.getElementById(tableBodyId);
  if (!container) return;

  container.innerHTML = "";

  data.forEach(c => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.customerName}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td>${c.membership_expire_date}</td>
    `;
    container.appendChild(row);
  });
}
