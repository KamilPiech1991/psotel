/* Domi Ventura FCI — minimal vanilla JS */

document.addEventListener('DOMContentLoaded', function () {
  /* ── Hamburger menu ── */
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  const overlay = document.getElementById('nav-overlay');

  function closeMenu() {
    nav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      if (overlay) overlay.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    if (overlay) overlay.addEventListener('click', closeMenu);
  }

  /* ── Aktywny link w menu ── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-list a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && (path === href || path.startsWith(href + '/') || (href !== '/' && href !== '/index.html' && path.includes(href.replace('/index.html', '').replace('.html', ''))))) {
      link.setAttribute('aria-current', 'page');
    }
    if ((href === '/' || href === '/index.html') && (path === '/' || path === '/index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Formularz kontaktowy ── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Wysłano!';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }
});
