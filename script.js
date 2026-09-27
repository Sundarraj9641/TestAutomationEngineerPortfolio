/* ==========================================================================
   Sundarraj Mahalingam — Portfolio
   Vanilla JS, no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTerminalTyping();
  initAccordion();
  initSkillFilters();
  initGallery();
  initFooterYear();
});

/* ---- Mobile nav toggle -------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- Terminal typing effect ---------------------------------------------
   Respects prefers-reduced-motion: renders the final text immediately
   for users who've asked for less motion.
---------------------------------------------------------------------------*/
function initTerminalTyping() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { text: '> Initializing Tricentis Tosca Automation Workspace...', pause: 400 },
    { text: '> Loading Module Libraries, Reusable TestStep Blocks (RTBs) & TCD Sheets...', pause: 400 },
    { text: '> Executing Automated End-to-End Regression Test Suite...', pause: 400 },
    { text: '> Steering Dynamic Parameters & Validating Module Execution Lists...', pause: 500 },
    { html: '> Pipeline Status: <span class="status-pass">PASSED</span> (100% Coverage)', pause: 0 },
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    body.innerHTML = lines
      .map((l) => `<div class="terminal-line">${l.html || l.text}</div>`)
      .join('');
    return;
  }

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) return;

    const current = lines[lineIndex];
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    body.appendChild(lineEl);

    if (current.html) {
      lineEl.innerHTML = current.html;
      lineIndex++;
      setTimeout(typeLine, current.pause);
      return;
    }

    const text = current.text;
    let charIndex = 0;
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';

    (function typeChar() {
      if (charIndex < text.length) {
        lineEl.textContent = text.slice(0, charIndex + 1);
        lineEl.appendChild(cursor);
        charIndex++;
        setTimeout(typeChar, 18);
      } else {
        cursor.remove();
        lineIndex++;
        setTimeout(typeLine, current.pause);
      }
    })();
  }

  typeLine();
}

/* ---- Experience accordion ------------------------------------------------ */
function initAccordion() {
  const triggers = document.querySelectorAll('.timeline-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.timeline-item');
      const isOpen = item.classList.contains('is-open');

      // Allow multiple open at once — each toggles independently.
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ---- Skill category filters ---------------------------------------------- */
function initSkillFilters() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.skill-card');
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');

      const filter = chip.dataset.filter;

      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });
}

/* ---- Photography lightbox -------------------------------------------------
   Click a gallery item to preview a larger version. Closes on the close
   button, backdrop click, or Escape.
---------------------------------------------------------------------------*/
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  if (!items.length || !lightbox) return;

  let lastFocused = null;

  function openLightbox(item) {
    lastFocused = document.activeElement;
    lightboxImg.src = item.dataset.full || item.querySelector('img').src;
    lightboxImg.alt = item.dataset.title || '';
    lightboxCaption.textContent = item.dataset.title || '';
    lightbox.hidden = false;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

/* ---- Dynamic copyright year ------------------------------------------------ */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
