/* ============================================
   CUSTOM CURSOR
   - Small dot follows cursor exactly
   - Larger ring lags behind with easing
   - Morphs/scales on interactive elements
   - Disabled on touch devices
   ============================================ */

(function () {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 1;
    ringY += (mouseY - ringY) * 1;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  const interactiveSelector = 'a, button, input, textarea, .project-card, .timeline-card, .filter-btn, .tag, .channel-card, .stat-card';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add('cursor-ring-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove('cursor-ring-hover');
    }
  });

  document.addEventListener('mousedown', () => ring.classList.add('cursor-ring-click'));
  document.addEventListener('mouseup', () => ring.classList.remove('cursor-ring-click'));
})();
