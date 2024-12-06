const COHORT = "2409-GHP-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// === State ===

const state = {
  events: [],
};

/** Updates state with events from API */
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

/** Asks the API to create a new event based on the given `artist` */
async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// === Render ===

/** Renders events from state */
function renderEvents() {
  const ul = document.getElementById("events");
  // ul.innerHTML = ""; // Clear existing list

  if (!state.events.length) {
    ul.innerHTML = "<li>No events.</li>";
    return;
  }
  
  const eventCards = state.events.map((event) => { 
    const card = document.createElement("li");
  
    const heading = document.createElement("h2");
    heading.textContent = event.name;
  
    const description = document.createElement("p");
    description.textContent = event.description;

    const date = document.createElement("p");
    date.textContent = event.date;

    const location = document.createElement("p");
    location.textContent = event.location;
  
    // Append the elements to the card
    card.appendChild(heading);
    card.appendChild(description);
    card.appendChild(date);
    card.appendChild(location);
  
    return card;
  });

  // Append all event cards to the `ul` element
  eventCards.forEach((card) => ul.appendChild(card));
}

/** Syncs state with the API and rerender */
async function render() {
  await getEvents();
  renderEvents();
}

// === Script ===

// TODO: Add event with form data when the form is submitted

const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const rawDate = form.date.value; // Gets the datetime-local string
  const isoDate = new Date(rawDate).toISOString(); // Converts to ISO-8601 format


  const  eventObject = {
    name: form.eventName.value,
    description: form.description.value,
    date: isoDate,
    location: form.location.value,
  };

  await addEvent(eventObject);
  form.reset(); // Reset form
  render(); // Refresh event list
});

// Initial render
render();