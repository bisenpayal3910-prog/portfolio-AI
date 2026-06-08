/* =============================================
   PORTFOLIO SCRIPT — Pure JavaScript
   ============================================= */

'use strict';

// =============================================
// THEME TOGGLE (Dark / Light)
// =============================================
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function getStoredTheme() {
  return localStorage.getItem('theme') || 'dark';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

applyTheme(getStoredTheme());

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// =============================================
// NAVBAR — scroll + mobile hamburger
// =============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = navLinks.querySelectorAll('a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// =============================================
// ACTIVE NAV LINK on scroll
// =============================================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// =============================================
// TYPED TEXT ANIMATION
// =============================================
const typedEl = document.getElementById('typedText');
const phrases = [
  'Full Stack Developer',
  'Open Source Contributor',
  'Problem Solver',
  'UI/UX Enthusiast',
  'Java Programmer',
];

let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
  const current = phrases[phraseIdx];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    typingSpeed = 50;
  } else {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    typingSpeed = 100;
  }

  if (!isDeleting && charIdx === current.length) {
    isDeleting = true;
    typingSpeed = 1500; // pause before deleting
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typingSpeed = 400;
  }

  setTimeout(type, typingSpeed);
}

setTimeout(type, 800);

// =============================================
// SCROLL REVEAL
// =============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

revealElements.forEach(el => revealObserver.observe(el));

// =============================================
// SKILL BARS — animate on scroll
// =============================================
const skillBars = document.querySelectorAll('.skill-bar');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const level = entry.target.getAttribute('data-level');
      entry.target.style.width = level + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// =============================================
// GALLERY LIGHTBOX
// =============================================
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGalleryIdx = 0;
const galleryData = Array.from(galleryItems).map(item => ({
  src: item.getAttribute('data-src') || item.querySelector('img').src,
  caption: item.getAttribute('data-caption') || '',
}));

function openLightbox(idx) {
  currentGalleryIdx = idx;
  updateLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const data = galleryData[currentGalleryIdx];
  lightboxImg.src = data.src;
  lightboxImg.alt = data.caption;
  lightboxCaption.textContent = data.caption;
}

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});

lightboxClose.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx - 1 + galleryData.length) % galleryData.length;
  updateLightboxImage();
});

lightboxNext.addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx + 1) % galleryData.length;
  updateLightboxImage();
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

// =============================================
// CONTACT FORM
// =============================================
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ['nameError', 'emailError', 'messageError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let valid = true;

  if (!name) {
    showError('nameError', 'Name is required');
    valid = false;
  }

  if (!email) {
    showError('emailError', 'Email is required');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('emailError', 'Enter a valid email address');
    valid = false;
  }

  if (!message) {
    showError('messageError', 'Message cannot be empty');
    valid = false;
  }

  if (!valid) return;

  // Simulate submission (no backend)
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  setTimeout(() => {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    formSuccess.style.display = 'block';
    contactForm.reset();

    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 5000);
  }, 1500);
});

// =============================================
// COUNTER ANIMATION (stat numbers)
// =============================================
const statNums = document.querySelectorAll('.stat-num, .exp-num');

function animateCounter(el, end) {
  const duration = 1500;
  const start = 0;
  const startTime = performance.now();
  const suffix = el.textContent.replace(/[0-9]/g, '');

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (end - start) * eased) + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const text = entry.target.textContent;
      const num = parseInt(text.replace(/\D/g, ''), 10);
      animateCounter(entry.target, num);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

// =============================================
// SMOOTH SCROLL for anchor links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
