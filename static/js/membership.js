let customers = [];
let serviceCalls = [];

Promise.all([
  fetch('./customers.json').then(res => res.json()),
  fetch('./service_calls.json').then(res => res.json())
])
.then(([customerData, serviceData]) => {
  customers = customerData;
  serviceCalls = serviceData;
  populateCustomerDropdown(customers);
})
.catch(error => console.error('Error loading data:', error));

function populateCustomerDropdown(customers) {
  const selectEl = document.getElementById("member-select");

  customers
  .slice() // clone array so original isn’t modified
  .sort((a, b) => a.last_name.localeCompare(b.last_name))
  .forEach(member => {
    const option = document.createElement("option");
    option.value = member.customer_id;
    option.textContent = `${member.last_name}, ${member.first_name}`;
    selectEl.appendChild(option);
  });


  selectEl.addEventListener("change", () => {
    const selectedId = parseInt(selectEl.value);
    const member = customers.find(m => m.customer_id === selectedId);
    const memberCalls = serviceCalls.filter(call => call.customer_id === selectedId);

    renderCustomerDashboard(member);
    renderServiceHistory(memberCalls);
  });
}

function renderCustomerDashboard(member) {
  if (!member) return;

  document.getElementById("member-name").textContent = `${member.first_name} ${member.last_name}`;
  document.getElementById("member-address").textContent = `${member.address}, ${member.city}, ${member.state} ${member.zipcode}`;
  document.getElementById("member-contact").textContent = `${member.phone} | ${member.email}`;
  document.getElementById("member-last-service").textContent = member.last_service_date || "N/A";
  document.getElementById("member-expiration").textContent = member.membership_expire_date || "N/A";

  document.getElementById("system-type").textContent = member.system_type || "N/A";
  document.getElementById("system-brand").textContent = member.system_brand || "N/A";
  document.getElementById("system-model").textContent = member.system_model || "N/A";
  document.getElementById("install-date").textContent = member.install_date || "N/A";
  document.getElementById("system-notes").textContent = member.system_notes || "N/A";

  // Optional dynamic map (will only work with real addresses)
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    `${member.address}, ${member.city}, ${member.state} ${member.zipcode}`
  )}&output=embed`;

  document.getElementById("map-frame").src = googleMapsUrl;

  document.getElementById("member-dashboard").style.display = "block";
}

function renderServiceHistory(calls) {
  const container = document.getElementById("service-history");
  container.innerHTML = "";

  if (calls.length === 0) {
    container.innerHTML = "<p>No service calls found for this customer.</p>";
    return;
  }

  calls.forEach(call => {
    const div = document.createElement("div");
    div.className = "service-call-card";
    div.innerHTML = `
      <p><strong>Service Call ID:</strong> ${call.service_call_id}</p>
      <p><strong>Date:</strong> ${call.service_date}</p>
      <p><strong>Type:</strong> ${call.type}</p>
      <p><strong>Quoted Price:</strong> ${call.quoted_price.trim()}</p>
      <p><strong>Description:</strong> ${call.description}</p>
    `;
    container.appendChild(div);
  });
}
