/*
  script.js
  Lab03 enhancements for Namgay Pem's portfolio
  - DOM selection and manipulation
  - Event handling (click, submit, scroll, mouseover)
  - Basic JS usage: functions, control flow, localStorage
  - Comments included for documentation (Lab requirement)
*/

/* -------------------------
   Helper / Utility Functions
   ------------------------- */
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

/* -------------------------
   Mobile Nav Toggle
   ------------------------- */
/* Add a small mobile menu toggle behavior. Requires adding a button in the HTML (#nav-toggle) */
const navToggle = qs('#nav-toggle');
const navUL = qs('nav ul');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navUL.classList.toggle('open'); // CSS will control display when `.open` is present
    navToggle.setAttribute('aria-expanded', navUL.classList.contains('open'));
  });
}

/* Close mobile nav when any link is clicked (for small screens) */
qsa('nav ul li a').forEach(a =>
  a.addEventListener('click', () => {
    if (navUL.classList.contains('open')) navUL.classList.remove('open');
  })
);

/* -------------------------
   Smooth scrolling + active link highlight on scroll
   ------------------------- */
const sections = Array.from(qsa('section[id]'));
const navLinks = Array.from(qsa('nav ul li a'));

function onScrollHighlight() {
  const scrollPos = window.scrollY + 120; // offset for fixed header
  for (const sec of sections) {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = qs(`nav ul li a[href="#${id}"]`);
    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  }
}
window.addEventListener('scroll', onScrollHighlight);
window.addEventListener('load', onScrollHighlight);

/* Smooth scroll behavior for nav links (extra safety for older browsers) */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // default anchor already smooth because of CSS scroll-behavior, but keep robust fallback
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = qs(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', href); // update url hash without page jump
      }
    }
  });
});

/* -------------------------
   Contact Form Validation & Submission (DOM + Events)
   -------------------------
   Requires: <form id="contact-form"> and inputs: name(#name), email(#email), message(#message)
*/
const contactForm = qs('#contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // don't actually submit (client-side handling for demo)
    const name = qs('#name').value.trim();
    const email = qs('#email').value.trim();
    const message = qs('#message').value.trim();

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = [];
    if (!name) errors.push('Please enter your name.');
    if (!email || !emailRegex.test(email)) errors.push('Please enter a valid email.');
    if (!message) errors.push('Please add a message.');

    // Feedback area
    const feedback = qs('#form-feedback');
    if (!feedback) {
      console.warn('Missing #form-feedback element for showing messages.');
    }

    if (errors.length > 0) {
      if (feedback) {
        feedback.textContent = errors.join(' ');
        feedback.classList.remove('success');
        feedback.classList.add('error');
      } else {
        alert(errors.join('\n'));
      }
      return;
    }

    // If validation passes, show success message and clear form
    if (feedback) {
      feedback.textContent = 'Message sent successfully! Thank you 😊';
      feedback.classList.remove('error');
      feedback.classList.add('success');
    } else {
      alert('Message sent successfully! Thank you 😊');
    }

    // Reset form fields
    contactForm.reset();

    // Simulate sending: we could push to an API here if required later.
  });
}

/* -------------------------
   Project Card Modal / Lightbox
   -------------------------
   - Clicking a .project-card opens a modal with larger image & details
   - Requires each project-card to have data-title & data-desc attributes, and an <img>
*/
const modal = qs('#project-modal');
const modalTitle = qs('#project-modal .modal-title');
const modalBody = qs('#project-modal .modal-body');
const modalImage = qs('#project-modal .modal-img');
const modalClose = qs('#project-modal .modal-close');

qsa('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Project';
    const desc = card.dataset.desc || card.querySelector('p')?.textContent || '';
    const imgSrc = card.querySelector('img')?.src || '';

    if (modal) {
      modal.classList.add('open');
      if (modalTitle) modalTitle.textContent = title;
      if (modalBody) modalBody.textContent = desc;
      if (modalImage) {
        modalImage.src = imgSrc;
        modalImage.alt = title;
      }
      document.body.style.overflow = 'hidden'; // prevent background scroll
    }
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Click outside modal content closes it
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* -------------------------
   Back-to-Top Button
   ------------------------- */
const backTop = qs('#back-to-top');

if (backTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backTop.classList.add('visible');
    else backTop.classList.remove('visible');
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------
   Theme Toggle (Light / Dark) — simple enhancement with localStorage
   ------------------------- */
/* Requires a button with id="theme-toggle" in the header */
const themeToggle = qs('#theme-toggle');
const root = document.documentElement;
const THEME_KEY = 'portfolio-theme';

function applyTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark-theme');
    themeToggle && themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('dark-theme');
    themeToggle && themeToggle.setAttribute('aria-pressed', 'false');
  }
}

// initialize theme
const saved = localStorage.getItem(THEME_KEY) || 'light';
applyTheme(saved);

// toggle action
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const cur = root.classList.contains('dark-theme') ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

/* -------------------------
   Accessibility: keyboard close for modal & esc handlers
   ------------------------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

/* -------------------------
  DOMContentLoaded: small initialization
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // lazy-add `loading="lazy"` to images if not present (improves performance)
  qsa('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });
});
