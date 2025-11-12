/* script.js - interactions: mobile menu, smooth nav, recommendations (localStorage) */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* Mobile menu toggle */
const menuBtn = $('#menuBtn');
menuBtn && menuBtn.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
});

/* Close mobile menu when link clicked */
$$('a[data-nav]').forEach(a => a.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
}));

/* Year in footer */
$('#year') && ($('#year').textContent = new Date().getFullYear());

/* Active nav link on scroll - IntersectionObserver */
const navLinks = $$('a[data-nav]');
const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const id = e.target.id;
    const link = document.querySelector(`a[href="#${id}"]`);
    if (e.isIntersecting) {
      navLinks.forEach(n => n.classList.remove('active'));
      link && link.classList.add('active');
    }
  });
}, { root: null, threshold: 0.35 });

sections.forEach(s => io.observe(s));

/* Recommendation form */
const RECS_KEY = 'jane_portfolio_recs_v1';
const recsEl = $('#recs');
const form = $('#recForm');
const nameField = $('#recName');
const msgField = $('#recMessage');
const feedbackEl = $('#feedback');

// --- Thank You Popup Logic ---
const thankPopup = document.getElementById('thankPopup');
const popupClose = document.getElementById('popupClose');

// Function to show popup
function showThankPopup() {
  thankPopup.classList.add('active');
}

// Function to close popup
function closeThankPopup() {
  thankPopup.classList.remove('active');
}

// Close popup when clicking "OK"
popupClose.addEventListener('click', closeThankPopup);

// --- Recommendation Form Submit Handler ---
recForm.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const nameVal = recName.value.trim();
  const messageVal = recMessage.value.trim();
  if (!messageVal) return;

  const recObj = { name: nameVal, message: messageVal };

  const el = makeRec(recObj);
  recsEl.insertBefore(el, recsEl.firstChild);
  saveRec(recObj);
  recForm.reset();

  // Show Thank You Popup
  showThankPopup();
});


/* Helper to create rec element */
function makeRec({ name = '', message }) {
  const block = document.createElement('blockquote');
  block.className = 'rec';
  const p = document.createElement('p');
  p.textContent = `"${message}"`;
  const f = document.createElement('footer');
  f.textContent = name ? `- ${name}` : '- Anonymous';
  block.append(p, f);
  return block;
}

/* Load saved recs */
function loadRecs() {
  try {
    const raw = localStorage.getItem(RECS_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    // newest first
    arr.reverse().forEach(r => recsEl.insertBefore(makeRec(r), recsEl.firstChild));
  } catch (e) {
    console.warn('Could not load recommendations', e);
  }
}

/* Save rec */
function saveRec(obj) {
  try {
    const raw = localStorage.getItem(RECS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(obj);
    localStorage.setItem(RECS_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn('Could not save recommendation', e);
  }
}



/* Load on DOM ready */
document.addEventListener('DOMContentLoaded', loadRecs);

// Home button scroll-to-top functionality
const homeBtn = document.getElementById('homeBtn');
if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // smooth scrolling effect
    });
  });
}


/* Focus targets on anchor click for accessibility */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    const id = a.getAttribute('href').slice(1);
    const t = document.getElementById(id);
    if (t) {
      t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
      setTimeout(() => t.removeAttribute('tabindex'), 1000);
    }
  });
});
