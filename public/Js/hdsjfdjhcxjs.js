"use strict";
const eventName = document.getElementsByClassName("event-name")[0];
const eventStart = document.getElementsByClassName("event-start")[0];
const eventEnd = document.getElementsByClassName("event-end")[0];
const eventEmoji = document.getElementsByClassName("event-emoji")[0];
const eventRequired = document.getElementsByClassName("event-required")[0];
const submitBtn = document.getElementsByClassName("lp-23sp-2")[0];
const errorMessage = document.getElementsByClassName("lp-errmd")[0];
const eventContainer = document.getElementsByClassName("lp-e2-4djs")[0];
const loader = document.getElementsByClassName("lp-l34cs-0l")[0];

setTime();
Post();
fetchEvents();

function setTime() {
  var date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  var today = date.toISOString().slice(0, 16);

  eventStart.value = today;
  eventEnd.value = today;
}

function Post() {
  submitBtn.addEventListener("click", async () => {
    if (
      eventName.value == "" ||
      eventEnd.value == eventStart.value ||
      eventName.value == ""
    ) {
      errorMessage.style.display = "block";
      return (errorMessage.innerText = "Please fill the fields out!");
    }

    loader.style.display = "block";

    const data = {
      name: eventName.value,
      start: eventStart.value,
      end: eventEnd.value,
      emoji: eventEmoji.value,
      required: eventRequired.value,
    };

    const response = await fetch("/api/staff/get/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.message == "Added Successfully") {
      window.location.reload();
    } else {
      errorMessage.innerText = responseData.message;
      loader.style.display = "none";
    }
  });
}

async function fetchEvents() {
  fetch("/api/staff/cards/give/events", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((events) => {
      events.data.forEach((event) => {
        createEvent(event);
      });
      loader.style.display = "none";
    });
}

function createEvent(event) {
  const mainDiv = document.createElement("div");
  mainDiv.className = "lp-2vlxc3";
  mainDiv.tabIndex = "0";

  const eventNameDiv = document.createElement("div");
  eventNameDiv.className = "lp-4vlxc5";
  eventNameDiv.innerHTML = `<p class="lp-5vlxc6 root-p">
  ${event?.name}
  <img
    src="https://cdn.discordapp.com/emojis/${event?.emoji.slice(
      event?.emoji.lastIndexOf(":") + 1,
      event?.emoji.lastIndexOf(">")
    )}.webp?size=96&quality=lossless"
    alt="${event?.name} Event"
    style="width: 1.875rem"
  />
</p>
<svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  role="img"
  width="1em"
  height="1em"
  preserveAspectRatio="xMidYMid meet"
  viewBox="0 0 1024 1024"
  class="lp-9xlvc0"
  height="20"
  width="20"
>
  <path
    fill="white"
    d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001c13.2-13.2 34.8-13.2 48 0l451.8 451.8l445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199z"
  />
  </svg>`;

  const eventInfoDiv = document.createElement("div");
  eventInfoDiv.className = "lp-7vlxc8";
  eventInfoDiv.innerHTML = `<p class="root-p lp-43cklx-2">
  Name: <span class="lp-43cklx-1">${event?.name}</span>
</p>
<p class="root-p lp-43cklx-2">
  Start: <span class="lp-43cklx-1">${event?.start}</span>
</p>
<p class="root-p lp-43cklx-2">
  End: <span class="lp-43cklx-1">${event?.end}</span>
</p>
<p class="root-p lp-43cklx-2">
  Emoji:
  <span class="lp-43cklx-1"
    >${event?.emoji}</span
  >
</p>
<p class="root-p lp-43cklx-2">
  Required: <span class="lp-43cklx-1">${event?.required}%</span>
  </p>`;

  mainDiv.append(eventNameDiv, eventInfoDiv);
  eventContainer.appendChild(mainDiv);
}
