// Shared behaviour for every page: menu, footer year, greeting, rotating tagline

document.addEventListener("DOMContentLoaded", function () {
  setupMenu();
  setYear();
  setGreeting();
  startTagline();
});

function setupMenu() {
  var toggle = document.getElementById("navToggle");
  var list = document.getElementById("siteNav");
  if (!toggle || !list) return;

  toggle.addEventListener("click", function () {
    var open = list.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
}

function setYear() {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

// Dynamic content: greeting changes with the time of day
function getGreeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function setGreeting() {
  var el = document.getElementById("greeting");
  if (el) el.textContent = getGreeting(new Date().getHours()) + ", and welcome.";
}

// Dynamic content: the tagline cycles through an array of phrases
var taglines = [
  "Aspiring cyberspace engineer",
  "Python learner",
  "Football and gaming fan",
  "Building my first portfolio"
];

function startTagline() {
  var el = document.getElementById("tagline");
  if (!el) return;
  var index = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  setInterval(function () {
    index = (index + 1) % taglines.length;
    el.style.opacity = 0;
    setTimeout(function () {
      el.textContent = taglines[index];
      el.style.opacity = 1;
    }, 250);
  }, 3500);
  el.style.transition = "opacity .25s";
}
