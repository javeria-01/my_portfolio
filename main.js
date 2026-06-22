// ============================================
// Theme toggle (dark / light)
// ============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme from localStorage, default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ============================================
// Mobile nav toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================
// Scroll reveal
// ============================================
const revealTargets = document.querySelectorAll(
  '.section__title, .skill-card, .project-card, .timeline__item, .about__text, .about__visual'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// ============================================
// Contact form — validation + Formspree submit
// ============================================
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function showError(input, message) {
  clearError(input);
  input.style.borderColor = '#F87171';
  const err = document.createElement('span');
  err.className = 'field-error';
  err.style.cssText = 'color:#F87171;font-size:0.78rem;font-family:var(--font-mono);margin-top:4px;display:block;';
  err.textContent = message;
  input.parentNode.appendChild(err);
}

function clearError(input) {
  input.style.borderColor = '';
  const existing = input.parentNode.querySelector('.field-error');
  if (existing) existing.remove();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput    = form.querySelector('#name');
    const emailInput   = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    let hasError = false;

    if (!name) {
      showError(nameInput, 'Please enter your name.');
      hasError = true;
    } else if (name.length < 2) {
      showError(nameInput, 'Name must be at least 2 characters.');
      hasError = true;
    }

    if (!email) {
      showError(emailInput, 'Please enter your email address.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError(emailInput, 'Please enter a valid email (e.g. name@example.com).');
      hasError = true;
    }

    if (!message) {
      showError(messageInput, 'Please write a message before sending.');
      hasError = true;
    } else if (message.length < 10) {
      showError(messageInput, 'Message is too short — please write at least 10 characters.');
      hasError = true;
    }

    if (hasError) return;

    status.textContent = 'Sending...';
    status.style.color = 'var(--accent)';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = 'Message sent — thanks for reaching out! I will get back to you soon.';
        form.reset();
        setTimeout(() => { status.textContent = ''; }, 3000);
      } else {
        status.style.color = '#F87171';
        status.textContent = 'Something went wrong. Please email me directly at javedjaveria076@gmail.com';
      }
    } catch (error) {
      status.style.color = '#F87171';
      status.textContent = 'No internet connection. Please email me directly at javedjaveria076@gmail.com';
    }
  });
}

// ============================================
// Footer year
// ============================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();