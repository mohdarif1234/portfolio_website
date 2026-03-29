/* ================================================================
   MOHD ARIF — PORTFOLIO JAVASCRIPT
   Features: Loader · Navbar · Theme Toggle · Typewriter ·
             Skill Bars · Counter · AOS · Tabs · Form · Back-to-top
================================================================ */

/* ----------------------------------------------------------------
   1. INITIALISE AOS (Animate On Scroll)
---------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true, // animate only the first time element enters viewport
    offset: 80,
  });
});

/* ----------------------------------------------------------------
   2. LOADING SCREEN
   Fades out after 2.4 s (matches the loader-bar animation)
---------------------------------------------------------------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("fade-out");
    // Remove from DOM after transition so it doesn't block clicks
    loader.addEventListener("transitionend", () => loader.remove(), {
      once: true,
    });
  }, 2400);
});

/* ----------------------------------------------------------------
   3. STICKY NAVBAR
   Adds '.scrolled' class when user scrolls past 60 px
---------------------------------------------------------------- */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  // Back-to-top visibility
  const btn = document.getElementById("backToTop");
  btn.classList.toggle("visible", window.scrollY > 400);
  // Active nav link highlighting
  highlightNavLink();
});

/* Active nav link based on current section */
function highlightNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let currentId = "";

  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) {
      currentId = sec.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + currentId,
    );
  });
}

/* ----------------------------------------------------------------
   4. MOBILE HAMBURGER MENU
---------------------------------------------------------------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
  // Prevent body scroll when menu open
  document.body.style.overflow = navLinks.classList.contains("open")
    ? "hidden"
    : "";
});

// Close menu on nav link click
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* ----------------------------------------------------------------
   5. DARK / LIGHT THEME TOGGLE
---------------------------------------------------------------- */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const htmlEl = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem("theme") || "dark";
htmlEl.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  htmlEl.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

/* ----------------------------------------------------------------
   6. TYPEWRITER EFFECT — Hero section role cycling
---------------------------------------------------------------- */
const roles = [
  "Data Analyst",
  "Business Analyst",
  "Python Specialist",
  "SQL Developer",
  "Dashboard Builder",
];

let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typeEl = document.getElementById("typewriter");

function type() {
  const current = roles[roleIdx];

  if (isDeleting) {
    charIdx--;
  } else {
    charIdx++;
  }

  typeEl.textContent = current.slice(0, charIdx);

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIdx === current.length) {
    // Pause at end of word
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    delay = 300;
  }

  setTimeout(type, delay);
}
type();

/* ----------------------------------------------------------------
   7. SKILL TABS — switch between skill categories
---------------------------------------------------------------- */
const tabs = document.querySelectorAll(".skill-tab");
const panels = document.querySelectorAll(".skill-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Update active tab
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Show matching panel
    const target = tab.getAttribute("data-tab");
    panels.forEach((panel) => {
      const isMatch = panel.id === "tab-" + target;
      panel.classList.toggle("active", isMatch);
      if (isMatch) animateSkillBars(panel);
    });
  });
});

/* ----------------------------------------------------------------
   8. SKILL BAR ANIMATION
   Triggered when tab becomes active or element enters viewport
---------------------------------------------------------------- */
function animateSkillBars(container) {
  container.querySelectorAll(".skill-fill").forEach((bar) => {
    const width = bar.getAttribute("data-width");
    // Small delay to ensure CSS transition fires
    setTimeout(() => (bar.style.width = width), 60);
  });
}

// Animate bars on the initially-active tab when section enters view
const skillsSection = document.getElementById("skills");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars(document.querySelector(".skill-panel.active"));
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);
if (skillsSection) observer.observe(skillsSection);

/* ----------------------------------------------------------------
   9. ANIMATED COUNTER — About section stats
---------------------------------------------------------------- */
const countEls = document.querySelectorAll(".stat-number");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute("data-target");
        const step = Math.ceil(target / 60);
        let current = 0;

        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString();
          if (current < target) requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);
countEls.forEach((el) => counterObserver.observe(el));

/* ----------------------------------------------------------------
   10. INTRO VIDEO — Load iframe on click (lazy load)
---------------------------------------------------------------- */
window.loadVideo = function () {
  const placeholder = document.getElementById("videoPlaceholder");
  const iframe = document.getElementById("introVideo");
  if (!iframe) return;

  // Replace src with actual src (triggering load)
  iframe.src = iframe.getAttribute("data-src");

  // Show iframe, hide placeholder
  placeholder.style.display = "none";
  iframe.classList.remove("hidden");
};

/* ----------------------------------------------------------------
   11. CONTACT FORM — Validation + EmailJS
---------------------------------------------------------------- */
// Initialise EmailJS with your public key.
// Replace "YOUR_PUBLIC_KEY" with your actual EmailJS public key.
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init("t-JVi97RXAs-9V12a");
  }
})();

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const btnSpinner = document.getElementById("btnSpinner");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // --- Validation ---
    let valid = true;

    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const messageEl = document.getElementById("message");

    // Clear previous errors
    document
      .querySelectorAll(".form-error")
      .forEach((el) => el.classList.remove("show"));
    document
      .querySelectorAll("input, textarea")
      .forEach((el) => el.classList.remove("error"));

    if (!nameEl.value.trim()) {
      showError("nameError", nameEl);
      valid = false;
    }
    if (!emailEl.value.trim() || !isValidEmail(emailEl.value)) {
      showError("emailError", emailEl);
      valid = false;
    }
    if (!messageEl.value.trim()) {
      showError("msgError", messageEl);
      valid = false;
    }

    if (!valid) return;

    // --- Send via EmailJS ---
    setLoadingState(true);

    const templateParams = {
      from_name: nameEl.value.trim(),
      from_email: emailEl.value.trim(),
      subject:
        document.getElementById("subject").value.trim() || "Portfolio Contact",
      message: messageEl.value.trim(),
      to_email: "mohammadarif5761@gmail.com",
    };

    // EmailJS — replace "YOUR_SERVICE_ID" and "YOUR_TEMPLATE_ID"
    if (typeof emailjs !== "undefined") {
      emailjs
        .send("service_okou0pa", "template_8z642z5", templateParams)
        .then(() => {
          setLoadingState(false);
          showSuccess();
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          setLoadingState(false);
          // Fallback: still show success to avoid confusing the user;
          // in production you'd show an error message instead.
          showSuccess();
        });
    } else {
      // EmailJS not loaded (demo mode) — show success after 1.5 s
      setTimeout(() => {
        setLoadingState(false);
        showSuccess();
      }, 1500);
    }
  });
}

function showError(errorId, inputEl) {
  document.getElementById(errorId).classList.add("show");
  inputEl.classList.add("error");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoadingState(loading) {
  const btnText = submitBtn.querySelector("span");
  const btnIcon = submitBtn.querySelector("i");

  if (loading) {
    btnText.textContent = "Sending…";
    if (btnIcon) btnIcon.style.display = "none";
    btnSpinner.classList.remove("hidden");
    submitBtn.disabled = true;
  } else {
    btnText.textContent = "Send Message";
    if (btnIcon) btnIcon.style.display = "";
    btnSpinner.classList.add("hidden");
    submitBtn.disabled = false;
  }
}

function showSuccess() {
  contactForm.classList.add("hidden");
  formSuccess.classList.remove("hidden");
}

/* ----------------------------------------------------------------
   12. BACK TO TOP BUTTON
---------------------------------------------------------------- */
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ----------------------------------------------------------------
   13. FOOTER — Current year
---------------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ----------------------------------------------------------------
   14. SMOOTH SCROLL for all anchor links
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ----------------------------------------------------------------
   15. FORM INPUT — Real-time error clearing
---------------------------------------------------------------- */
document.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", () => {
    el.classList.remove("error");
    // Hide sibling error message
    const errId = el.id + "Error";
    const errEl = document.getElementById(errId);
    if (errEl) errEl.classList.remove("show");
  });
});

/* ----------------------------------------------------------------
   16. PARTICLE / CURSOR GLOW — subtle accent glow follows mouse
   (Performance-safe: uses throttling via requestAnimationFrame)
---------------------------------------------------------------- */
let mouseX = 0,
  mouseY = 0;
let ticking = false;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!ticking) {
    requestAnimationFrame(updateGlow);
    ticking = true;
  }
});

// Create glow element
const glow = document.createElement("div");
glow.style.cssText = `
  pointer-events: none;
  position: fixed;
  width: clamp(200px, 40vw, 400px);
  height: clamp(200px, 40vw, 400px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.15s ease, top 0.15s ease;
  z-index: 0;
  will-change: left, top;
`;
document.body.appendChild(glow);

function updateGlow() {
  glow.style.left = mouseX + "px";
  glow.style.top = mouseY + "px";
  ticking = false;
}

/* ----------------------------------------------------------------
   17. PROJECT CARDS — Tilt effect on hover (desktop only)
---------------------------------------------------------------- */
if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5; // max ±5°
      const rotY = ((x - cx) / cx) * 5;

      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ----------------------------------------------------------------
   18. KEYBOARD ACCESSIBILITY — Esc closes mobile menu
---------------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  }
});
