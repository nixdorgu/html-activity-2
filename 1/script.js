let offset = [8, 9];

window.onload = startClock;

// HELPERS
function getUTCTime() {
  const local = new Date();
  const utcDifference = local.getTimezoneOffset();
  const gmt = new Date().setUTCMinutes(utcDifference);
  return new Date(gmt);
}

function getNewTimezone(offset) {
  const utc = getUTCTime();
  const hours = utc.getUTCHours();
  const dateInMS = new Date().setUTCHours(hours + Number(offset));
  const timezone = new Date(dateInMS);

  return timezone;
}

function clearForms() {
  const timezone = document.querySelector("#timezone-name");
  const offset = document.querySelector("#timezone-offset");

  timezone.value = "";
  offset.value = "";
}

function getTime(index) {
  const timezone = getNewTimezone(offset[index]);
  clock(timezone, index);
}

const formatUnit = unit => unit < 10 ? `0${unit}`: unit;

function clock(date, index) {
  let hour = formatUnit(date.getHours());
  let minute = formatUnit(date.getMinutes());
  let second = formatUnit(date.getSeconds());

  const hours = document.querySelectorAll(".hours")[index];
  const minutes = document.querySelectorAll(".minutes")[index];
  const seconds = document.querySelectorAll(".seconds")[index];

  hours.innerHTML = hour + ":";
  minutes.innerHTML = minute + ":";
  seconds.innerHTML = second;
}

function handleClick() {
  const timezone = document.querySelector("#timezone-name").value;
  const zone = document.querySelector("#timezone-offset").value;

  if (!timezone) return;
  offset.push(zone);
  const main = document.querySelector("main");

  const div = document.createElement("div");
  div.id = timezone;
  div.classList.add('timezone');
  div.innerHTML = `
  <div class="clock">
    <span class="hours"></span>
    <span class="minutes"></span>
    <span class="seconds"></span>
  </div>
  <div class="county">${timezone}</div>
  `;

  main.appendChild(div);
  clearForms();
}

function updateClock() {
  const main = document.querySelector("main");
  const length = main.children.length;

  for (let index = 0; index < length; index++) {
    getTime(index);
  }
}

function startClock() {
  setInterval(updateClock, 1000);
}