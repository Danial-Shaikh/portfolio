/* ============================================
   SHARED NAV — injected into every page
   Edit this file to update nav across all pages
   ============================================ */

(function () {
  // Detect which page we're on for active state
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  const activeMap = {
    'index': 'home',
    '': 'home',
    'about': 'about',
    'experience': 'experience',
    'projects': 'projects',
    'contact': 'contact'
  };
  const active = activeMap[page] || 'home';

  const navHTML = `
    <nav class="nav">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">DS<span class="dot">.</span></a>
        <ul class="nav-links">
          <li><a href="index.html" data-page="home"><span class="path-prefix">./</span>home</a></li>
          <li><a href="about.html" data-page="about"><span class="path-prefix">./</span>about</a></li>
          <li><a href="experience.html" data-page="experience"><span class="path-prefix">./</span>experience</a></li>
          <li><a href="projects.html" data-page="projects"><span class="path-prefix">./</span>projects</a></li>
          <li><a href="contact.html" data-page="contact"><span class="path-prefix">./</span>contact</a></li>
        </ul>
        <div class="nav-right">
          <div class="nav-status">available for hire</div>
          <a href="assets/danial-shaikh-resume.pdf" download class="nav-resume"><span class="path-prefix">./</span>resume<span class="resume-icon">↓</span></a>
        </div>
      </div>
    </nav>
  `;

  // Inject into placeholder
  const slot = document.getElementById('nav-slot');
  if (slot) {
    slot.outerHTML = navHTML;
    // Mark active link
    const activeLink = document.querySelector(`.nav-links a[data-page="${active}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
})();
