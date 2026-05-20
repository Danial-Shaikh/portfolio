/* ============================================
   PROJECT FILTER
   Wires up the all / web / ai / desktop / mobile
   filter buttons to show/hide project cards.
   ============================================ */

(function () {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    cards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('filtered-out');
      } else {
        card.classList.add('filtered-out');
      }
    });

    // Hide any row that has no visible cards (keeps layout tidy)
    document.querySelectorAll('.projects-row').forEach((row) => {
      const visible = row.querySelectorAll('.project-card:not(.filtered-out)');
      row.style.display = visible.length ? '' : 'none';
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });
})();
