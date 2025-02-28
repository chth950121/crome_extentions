chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeTickets") {
    setTimeout(() => {
      let tickets = scrapeTicketData();
      sendResponse({ tickets: tickets });
    }, 2000);
    return true;
  }
});

function scrapeTicketData() {
  let ticketElements = document.querySelectorAll(".ticket-row, .event-ticket");
  let tickets = [];
  ticketElements.forEach(ticket => {
    let section = ticket.querySelector(".section-name")?.innerText;
    let price = ticket.querySelector(".ticket-price")?.innerText;
    let available = ticket.querySelector(".availability")?.innerText;
    if (section && price && available) {
      tickets.push({ section, price, available });
    }
  });
  return tickets;
}