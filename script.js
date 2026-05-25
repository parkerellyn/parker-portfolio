/* ═══════════════════════════════════════════
   PARKER ELLYN MADLOCK — Interactions
   ═══════════════════════════════════════════ */

// ─── PAGE FLIP SCROLL ───

const sheets = Array.from(document.querySelectorAll('.sheet'));
const nav    = document.querySelector('.nav');

// Fix all sheets in place, stacked by z-index (hero on top)
sheets.forEach((sheet, i) => {
  sheet.style.position      = 'fixed';
  sheet.style.top           = '0';
  sheet.style.left          = '0';
  sheet.style.width         = '100%';
  sheet.style.height        = '100vh';
  sheet.style.zIndex        = sheets.length - i;
  sheet.style.transformOrigin = 'top center';
  sheet.style.willChange    = 'transform';
});

// Set each sheet's hole backgrounds to the color of the sheet below,
// so the holes appear to see through to the next page.
sheets.forEach((sheet, i) => {
  const below  = sheets[i + 1] || sheet;
  const nextBg = getComputedStyle(below).backgroundColor;
  sheet.querySelectorAll('.hole').forEach(h => { h.style.background = nextBg; });
});

// Scroll spacer — gives the page something to scroll against
const spacer = document.createElement('div');
spacer.style.cssText = 'pointer-events: none; position: relative;';
document.body.appendChild(spacer);

function updateSpacerHeight() {
  spacer.style.height = (sheets.length * window.innerHeight) + 'px';
}
updateSpacerHeight();
window.addEventListener('resize', updateSpacerHeight, { passive: true });

// Nav links: override default anchor scroll — jump to the right scroll position
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    const id  = link.getAttribute('href').replace('#', '');
    const idx = sheets.findIndex(s => s.id === id);
    if (idx !== -1) {
      e.preventDefault();
      window.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' });
    }
  });
});

let scrollRaf = null;

function onScroll() {
  const progress = window.scrollY / window.innerHeight;

  sheets.forEach((sheet, i) => {
    const p = Math.min(Math.max(progress - i, 0), 1);

    if (p === 0) {
      sheet.style.transform = 'none';
      sheet.style.setProperty('--peel', '0');
    } else if (p >= 1) {
      // Fully exited — drift 4% right so it clears the stack visually
      sheet.style.transform = 'translateY(-100vh) translateX(4%)';
      sheet.style.setProperty('--peel', '0');
    } else {
      // Page lifts from top edge, drifts slightly right as it goes
      sheet.style.transform =
        `perspective(1200px) translateY(${-p * 100}vh) translateX(${p * 4}%) rotateX(${-p * 5}deg)`;
      // Drive the bottom-edge shadow via CSS custom property
      sheet.style.setProperty('--peel', p.toFixed(3));
    }
  });

  scrollRaf = null;
}

window.addEventListener('scroll', () => {
  if (!scrollRaf) scrollRaf = requestAnimationFrame(onScroll);
}, { passive: true });

onScroll(); // initialize on load


// ─── MOUSE-ONLY FEATURES ───
// Cursor, atmospheric glow, and row glow are all mouse-driven.
// Skip entirely on touch devices.

if (!('ontouchstart' in window)) {

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ─── ATMOSPHERIC GLOW ───
  // Two overlapping glow divs — blue and red. Cross-fading their opacity
  // is the only reliable way to smoothly transition between gradient colors.

  const glowBase = `
    position: fixed;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 5;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.8s ease;
    will-change: left, top;
  `;

  const glowBlue = document.createElement('div');
  glowBlue.style.cssText = glowBase +
    'background: radial-gradient(circle, rgba(0,53,169,0.25) 0%, transparent 70%);';
  document.body.appendChild(glowBlue);

  const glowRed = document.createElement('div');
  glowRed.style.cssText = glowBase +
    'background: radial-gradient(circle, rgba(227,18,11,0.18) 0%, transparent 70%);';
  document.body.appendChild(glowRed);

  let glowX = window.innerWidth  / 2;
  let glowY = window.innerHeight / 2;
  glowBlue.style.left = glowRed.style.left = glowX + 'px';
  glowBlue.style.top  = glowRed.style.top  = glowY + 'px';

  let glowActive = false;

  function updateGlowColor() {
    if (!glowActive) return;
    const progress  = window.scrollY / window.innerHeight;
    const activeIdx = Math.min(Math.round(progress), sheets.length - 1);
    // About sheet (index 1) → red; everything else → blue
    if (activeIdx === 1) {
      glowBlue.style.opacity = '0';
      glowRed.style.opacity  = '1';
    } else {
      glowBlue.style.opacity = '1';
      glowRed.style.opacity  = '0';
    }
  }

  // Activate on first mouse movement, then keep synced with scroll
  document.addEventListener('mousemove', () => {
    glowActive = true;
    updateGlowColor();
  }, { once: true });

  window.addEventListener('scroll', updateGlowColor, { passive: true });

  (function animateGlow() {
    glowX += (mouseX - glowX) * 0.04;
    glowY += (mouseY - glowY) * 0.04;
    glowBlue.style.left = glowRed.style.left = glowX + 'px';
    glowBlue.style.top  = glowRed.style.top  = glowY + 'px';
    requestAnimationFrame(animateGlow);
  })();


  // ─── PROJECT ROW RADIAL GLOW ───

  document.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('mousemove', e => {
      const rect = row.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      row.style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(0,53,169,0.13) 0%, transparent 65%)`;
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });

  // ─── EXPERIENCE ROW RADIAL GLOW ───

  document.querySelectorAll('.exp-row').forEach(row => {
    row.addEventListener('mousemove', e => {
      const rect = row.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      row.style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(0,53,169,0.13) 0%, transparent 65%)`;
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });

} // end mouse-only features

// ─── EXPERIENCE ROW CLICK-TO-EXPAND ───

document.querySelectorAll('.exp-row').forEach(row => {
  row.addEventListener('click', () => {
    row.classList.toggle('open');
  });
});
