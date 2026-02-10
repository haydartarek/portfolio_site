(() => {
  // ===== Mobile Menu Toggle =====
  const btn = document.querySelector('.menuBtn');
  const nav = document.querySelector('.nav');

  const setExpanded = (v) => btn?.setAttribute('aria-expanded', String(v));

  btn?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    setExpanded(open);
  });

  // ===== Anchor Navigation (use native smooth scroll + scroll-margin-top) =====
  nav?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    // Do NOT prevent default.
    // Browser will handle anchor navigation smoothly via CSS:
    // html { scroll-behavior: smooth; }
    // and offset via scroll-margin-top on sections.

    // Close mobile menu after click
    nav.classList.remove('open');
    setExpanded(false);
  });

  // ===== Scroll Spy: Highlight Active Section =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const topbar = document.querySelector('.topbar');
  const navbarHeight = topbar?.offsetHeight || 64;

  function highlightActiveSection() {
    const scrollPosition = window.scrollY + navbarHeight + 100;

    // Add shadow to topbar when scrolled
    if (window.scrollY > 50) {
      topbar?.classList.add('scrolled');
    } else {
      topbar?.classList.remove('scrolled');
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section link
        const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
        activeLink?.classList.add('active');
      }
    });
  }

  // Run on scroll with throttling for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        highlightActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run on page load
  highlightActiveSection();

  // ===== Close Mobile Menu on Outside Click =====
  document.addEventListener('click', (e) => {
    if (!nav?.contains(e.target) && !btn?.contains(e.target)) {
      nav?.classList.remove('open');
      setExpanded(false);
    }
  });

  // ===== Prevent Layout Shift on Load =====
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // ===== Fade-in Sections on Scroll =====
  const revealSections = document.querySelectorAll(
    'section.section, section.section-alt'
  );

  // Add base reveal class
  revealSections.forEach(sec => sec.classList.add('reveal'));

  // Skip animation if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // run once
        });
      },
      {
        threshold: 0.15
      }
    );

    revealSections.forEach(sec => observer.observe(sec));
  } else {
    // Fallback: show everything immediately
    revealSections.forEach(sec => sec.classList.add('is-visible'));
  }
})();
