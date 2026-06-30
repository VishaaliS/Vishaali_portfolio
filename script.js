/* ================================================================
   VISHAALI PORTFOLIO — Interactive Features
   Typing animation, theme toggle, scroll effects, mobile nav
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // 1. TYPING ANIMATION
  // ============================================
  const typingPhrases = [
    'Aspiring Remote Developer',
    'Full Stack Engineer',
    'AI Enthusiast',
    'Problem Solver',
    'Building in Public',
    'Day 8 of 180 🚀',
  ];

  const typingElement = document.getElementById('typing-text');
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeWriter() {
    if (!typingElement) return;

    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause before deleting
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeWriter, typingSpeed);
  }

  typeWriter();

  // ============================================
  // 2. THEME TOGGLE (Dark / Light)
  // ============================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  // Check for saved preference or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    localStorage.setItem('portfolio-theme', theme);

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#0a0f1c' : '#f8fafc';
    }
  }

  // Apply saved theme on load
  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ============================================
  // 3. MOBILE NAVIGATION
  // ============================================
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const mobileOverlay = document.getElementById('nav-mobile-overlay');

  function openMobileMenu() {
    if (!hamburger || !mobileMenu || !mobileOverlay) return;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.style.display = 'flex';
    mobileOverlay.style.display = 'block';

    // Force reflow for transition
    requestAnimationFrame(() => {
      mobileMenu.classList.add('visible');
      mobileOverlay.classList.add('visible');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu || !mobileOverlay) return;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('visible');
    mobileOverlay.classList.remove('visible');
    document.body.style.overflow = '';

    // Hide after transition
    setTimeout(() => {
      if (!mobileMenu.classList.contains('visible')) {
        mobileMenu.style.display = '';
        mobileOverlay.style.display = '';
      }
    }, 300);
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('active');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking a link
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // ============================================
  // 4. SCROLL PROGRESS BAR
  // ============================================
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }

  // ============================================
  // 5. NAVBAR HIDE/SHOW ON SCROLL
  // ============================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let ticking = false;

  function handleNavbarScroll() {
    if (!navbar) return;
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Scrolling down — hide
        navbar.classList.add('hidden');
      } else {
        // Scrolling up — show
        navbar.classList.remove('hidden');
      }
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  // ============================================
  // 6. ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightActiveSection() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ============================================
  // 7. BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 8. SCROLL EVENT HANDLER (Combined, throttled)
  // ============================================
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleBackToTop();

    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        highlightActiveSection();
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateScrollProgress();
  handleBackToTop();

  // ============================================
  // 9. SCROLL REVEAL (Intersection Observer)
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all elements
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // 10. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // Skip empty anchors

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ============================================
  // 11. CONTACT FORM HANDLER
  // ============================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        return;
      }

      // Show success feedback
      const submitBtn = document.getElementById('form-submit-btn');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = 'var(--gradient-primary)';
        submitBtn.style.color = '#ffffff';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }

      // In production, you'd send this to a backend or service like Formspree
      console.log('Form submitted:', { name, email, message });
    });
  }

  // ============================================
  // 12. JOURNEY PROGRESS ANIMATION
  // ============================================
  const progressBar = document.querySelector('.progress-bar-fill');

  if (progressBar && 'IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const targetWidth = progressBar.style.width;
            progressBar.style.width = '0%';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                progressBar.style.width = targetWidth;
              });
            });
            progressObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    progressObserver.observe(progressBar);
  }

  // ============================================
  // 13. SCROLL REVEAL
  // ============================================
  if ('IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll('.reveal');

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealEls.forEach(el => revealObs.observe(el));
  }

  // ============================================
  // DONE
  // ============================================
  console.log('✨ Vishaali Portfolio loaded — Day 8/180 🚀');
});
