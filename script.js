document.documentElement.classList.add("js");

// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setNav(open) {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNav(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

// Reveal-on-scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Highlight the current section in the nav
const navLinks = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

const donateForm = document.getElementById("donate-form");
if (donateForm) {
  // Donation amount picker — submits to PayPal's donate page
  const donateTotal = document.getElementById("donate-total");
  const donateNote = document.getElementById("donate-note");
  const donateOther = document.getElementById("donate-other");
  const donateAmount = document.getElementById("donate-amount");
  const presets = donateForm.querySelectorAll('input[name="preset"]');

  function currentAmount() {
    const other = parseFloat(donateOther.value);
    if (other > 0) return Math.round(other * 100) / 100;
    const picked = donateForm.querySelector('input[name="preset"]:checked');
    return picked ? parseInt(picked.value, 10) : 0;
  }

  function updateTotal() {
    const amount = currentAmount();
    donateTotal.textContent = amount ? "$" + amount.toLocaleString() : "";
  }

  presets.forEach((r) => r.addEventListener("change", () => { donateOther.value = ""; updateTotal(); }));
  donateOther.addEventListener("input", () => {
    if (donateOther.value) presets.forEach((r) => (r.checked = false));
    updateTotal();
  });

  donateForm.addEventListener("submit", (e) => {
    const amount = currentAmount();
    if (!amount) {
      e.preventDefault();
      donateNote.textContent = "Please choose or enter an amount.";
      donateNote.className = "form-note error";
      return;
    }
    donateAmount.value = amount.toFixed(2);
    donateNote.textContent = "Opening PayPal in a new tab… Thank you for your support!";
    donateNote.className = "form-note success";
  });
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  // Contact form (client-side validation; opens the visitor's email app)
  const contactNote = document.getElementById("contact-note");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll("[required]").forEach((input) => {
      const ok = input.checkValidity() && input.value.trim() !== "";
      input.closest(".field").classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      contactNote.textContent = "Please fill in your name, a valid email and a message.";
      contactNote.className = "form-note error";
      return;
    }

    const { name, email, interest, message } = contactForm;
    const subject = encodeURIComponent(`${interest.value} — ${name.value}`);
    const body = encodeURIComponent(`${message.value}\n\nFrom: ${name.value} <${email.value}>`);
    window.location.href = `mailto:thepersistfoundation@gmail.com?subject=${subject}&body=${body}`;

    contactNote.textContent = "Thanks! Your email app should open to send the message.";
    contactNote.className = "form-note success";
    contactForm.reset();
  });

  // "Get Involved" links preselect the matching topic in the contact form
  document.querySelectorAll("[data-interest]").forEach((link) => {
    link.addEventListener("click", () => {
      contactForm.interest.value = link.dataset.interest;
    });
  });
}

// Scholarship application
const appForm = document.getElementById("scholarship-form");
if (appForm) {
  // Only show the form between the opening date and the deadline (Indiana time).
  // Add ?preview to the page address to see the form at any time (e.g. for testing).
  const applySection = document.getElementById("apply");
  const opens = new Date(applySection.dataset.open);
  const closes = new Date(applySection.dataset.close);
  const now = new Date();
  const preview = new URLSearchParams(location.search).has("preview");
  if (!preview && (now < opens || now >= closes)) {
    const status = document.getElementById("app-status");
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Indiana/Indianapolis" });
    const lastDay = new Date(closes.getTime() - 1);
    if (now < opens) {
      document.getElementById("app-status-title").textContent = `Applications open ${fmt(opens)}`;
      document.getElementById("app-status-text").textContent =
        `The application will appear here on ${fmt(opens)} and stay open until ${fmt(lastDay)} at 11:59 p.m. Eastern. Come back then — and start thinking about your essay!`;
    } else {
      document.getElementById("app-status-title").textContent = "Applications are closed";
      document.getElementById("app-status-text").textContent =
        `The deadline was ${fmt(lastDay)}. Thank you to everyone who applied. Email us to hear when the next cycle opens.`;
      document.getElementById("app-status-link").textContent = "Email us";
    }
    status.hidden = false;
    appForm.hidden = true;
    applySection.querySelector(".section-head p:last-child").hidden = true;
  }

  const appNote = document.getElementById("app-note");
  const guardian = document.getElementById("guardian");
  const guardianInputs = guardian.querySelectorAll("input");
  const essay = document.getElementById("essay");
  const essayCount = document.getElementById("essay-count");
  const minWords = Number(essay.dataset.minWords);
  const maxWords = Number(essay.dataset.maxWords);

  // Ask for a parent/guardian only when the applicant is under 18
  appForm.querySelectorAll('input[name="18 or older"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const minor = radio.value === "No" && radio.checked;
      guardian.hidden = !minor;
      guardianInputs.forEach((input) => {
        input.disabled = !minor;
        input.required = minor;
      });
    });
  });

  const wordCount = () => (essay.value.trim().match(/\S+/g) || []).length;
  function updateCount() {
    const n = wordCount();
    essayCount.textContent = `${n} word${n === 1 ? "" : "s"} · ${minWords}–${maxWords} words`;
    const ok = n >= minWords && n <= maxWords;
    essayCount.classList.toggle("bad", n > 0 && !ok);
    essay.setCustomValidity(n === 0 || ok ? "" : `Your essay should be ${minWords}–${maxWords} words (currently ${n}).`);
  }
  essay.addEventListener("input", updateCount);

  appForm.addEventListener("submit", (e) => {
    updateCount();
    let firstBad = null;
    appForm.querySelectorAll("input, select, textarea").forEach((input) => {
      if (input.disabled || input.type === "hidden" || input.classList.contains("hp")) return;
      const ok = input.checkValidity() && !(input.required && input.value.trim() === "");
      const field = input.closest(".field");
      if (field) field.classList.toggle("invalid", !ok);
      if (!ok && !firstBad) firstBad = input;
    });

    if (firstBad) {
      e.preventDefault();
      appNote.textContent = firstBad.validationMessage || "Please complete all required fields.";
      appNote.className = "form-note error";
      firstBad.focus();
      return;
    }
    appNote.textContent = "Submitting your application…";
    appNote.className = "form-note success";
    appForm.querySelector('button[type="submit"]').disabled = true;
  });

  // Re-enable the button if the visitor comes back with the browser's Back button
  window.addEventListener("pageshow", () => {
    appForm.querySelector('button[type="submit"]').disabled = false;
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
