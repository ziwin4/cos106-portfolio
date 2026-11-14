// Contact form validation

var validators = {
  name: function (v) {
    return v.trim() === "" ? "Enter your name." : "";
  },
  email: function (v) {
    if (v.trim() === "") return "Enter your email address.";
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return pattern.test(v.trim()) ? "" : "Enter a valid email address, like name@example.com.";
  },
  phone: function (v) {
    if (v.trim() === "") return "Enter your phone number.";
    return /^\d+$/.test(v.trim()) ? "" : "Use digits only: no spaces, dashes or plus sign.";
  },
  message: function (v) {
    return v.trim() === "" ? "Write a message." : "";
  }
};

function showError(field, message) {
  var box = document.getElementById(field + "Error");
  var wrapper = document.getElementById(field).closest(".field");
  box.textContent = message;
  wrapper.classList.toggle("invalid", message !== "");
  document.getElementById(field).setAttribute("aria-invalid", String(message !== ""));
}

function validateField(field) {
  var message = validators[field](document.getElementById(field).value);
  showError(field, message);
  return message === "";
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var fields = Object.keys(validators);

  // Check each field when the person leaves it, and clear errors as they fix them
  fields.forEach(function (field) {
    var el = document.getElementById(field);
    el.addEventListener("blur", function () { validateField(field); });
    el.addEventListener("input", function () {
      if (el.closest(".field").classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var allValid = true;
    var firstBad = null;

    fields.forEach(function (field) {
      if (!validateField(field)) {
        allValid = false;
        if (!firstBad) firstBad = field;
      }
    });

    status.hidden = false;
    if (!allValid) {
      status.className = "form-status bad";
      status.textContent = "Fix the highlighted fields and try again.";
      document.getElementById(firstBad).focus();
      return;
    }

    var name = document.getElementById("name").value.trim();
    status.className = "form-status ok";
    status.textContent = "Thanks, " + name + ". Your details are valid and your message is ready. This demo form does not send email, so use the email link beside it to reach me.";
    form.reset();
    fields.forEach(function (f) { showError(f, ""); });
  });
});
