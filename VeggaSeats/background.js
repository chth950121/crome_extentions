chrome.alarms.create("checkTickets", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkTickets") {
    checkForTicketUpdates();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeTickets") {
    checkForTicketUpdates();  // Trigger scraping process
    sendResponse({ message: "Scraping triggered." });
  }
});

function checkForTicketUpdates() {
  chrome.storage.local.get("events", (data) => {
    let events = data.events || {};
    
    for (let eventID in events) {
      fetchUpdatedTicketData(eventID, events[eventID]);
    }
  });
}

function fetchUpdatedTicketData(eventID, eventData) {
  fetch(eventData.source) // Simulated fetch, actual implementation requires proper API or scraping
    .then(response => response.json())
    .then(newData => {
      let updatedSections = compareTicketData(eventData.sections, newData.sections);
      if (updatedSections.length > 0) {
        sendNotification(eventData.name, updatedSections);
        chrome.storage.local.set({ [eventID]: newData });
      }
    })
    .catch(error => console.error("Error fetching ticket data:", error));
}

function sendNotification(eventName, updatedSections) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "Ticket Update",
    message: `Tickets updated in sections: ${updatedSections.join(", ")}`
  });
}