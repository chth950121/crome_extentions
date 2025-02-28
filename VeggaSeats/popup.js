document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("refreshBtn").addEventListener("click", fetchTicketData);
  fetchTicketData();
});

function fetchTicketData() {
  chrome.runtime.sendMessage({ action: "scrapeTickets" }, (response) => {
    if (response) {
      console.log("Scraping initiated:", response.message);
    }
  });
  chrome.storage.local.get("events", (data) => {
    displayTickets(data.events || []);
  });
}

function displayTickets(events) {
  let ticketList = document.getElementById("ticketList");
  ticketList.innerHTML = "";
  events.forEach(ticket => {
    let li = document.createElement("li");
    li.textContent = `${ticket.section}: ${ticket.available} available at ${ticket.price}`;
    ticketList.appendChild(li);
  });
}