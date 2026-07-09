const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    const useCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

    if (useCustomCursor) {
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      });

      function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
      }
      animateRing();

      document.querySelectorAll('a,button,.service-card,.project-card,.t-card,.exp-card,.hl-card,.photo-frame,.about-photo-wrap').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
      });
    } else {
      cursor.style.display = 'none';
      cursorRing.style.display = 'none';
      document.body.style.cursor = 'auto';
    }

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(el => revealObs.observe(el));

    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
            skillObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      skillFills.forEach(el => skillObs.observe(el));

    // Active nav highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinkAnchors = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
      let currentSection = '';

      sections.forEach(section => {
        const top = section.offsetTop - 140;
        const height = section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinkAnchors.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    // Animated hero counters
    const statNumbers = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    function animateCount(el, endValue, suffix = '') {
      const duration = 1400;
      const startTime = performance.now();

      function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(endValue * eased);
        el.innerHTML = `${current}<span class="stat-unit">${suffix}</span>`;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    function runHeroStats() {
      if (statsAnimated) return;

      const heroSection = document.getElementById('hero');
      const rect = heroSection.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.8) {
        statNumbers.forEach((el, index) => {
          if (index === 0) animateCount(el, 60, '%');
          if (index === 1) animateCount(el, 20, 'h');
          if (index === 2) animateCount(el, 6, '+');
        });
        statsAnimated = true;
      }
    }

    window.addEventListener('scroll', runHeroStats);
    window.addEventListener('load', runHeroStats);



    const stickyCta = document.getElementById('stickyCta');

    function toggleStickyCta() {
      if (!stickyCta) return;
      if (window.scrollY > 420) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleStickyCta);
    window.addEventListener('load', toggleStickyCta);

    // Formspree form
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const errorBox = document.getElementById('formError');
    const submitBtn = document.getElementById('formSubmitBtn');
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjoaypg';

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        errorBox.style.display = 'none';

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();
        const gotcha = form._gotcha.value;

        if (!name || !email || !subject || !message) {
          alert('Please fill in all fields.');
          return;
        }

        if (gotcha) {
          return;
        }

        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              subject,
              message
            })
          });

          if (response.ok) {
            form.reset();
            form.style.display = 'none';
            success.style.display = 'block';
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          errorBox.style.display = 'block';
          submitBtn.innerHTML = 'Request Free Audit';
          submitBtn.disabled = false;
        }
      });
    }

    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const navCloseBtn = document.getElementById('navCloseBtn');

    function closeMenu() {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
      navBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function openMenu() {
      menuToggle.classList.add('open');
      navLinks.classList.add('open');
      navBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    menuToggle.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    navBackdrop.addEventListener('click', closeMenu);

    if (navCloseBtn) {
      navCloseBtn.addEventListener('click', closeMenu);
    }

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

const freeAuditBtn = document.getElementById('freeAuditBtn');
    const navFreeAuditBtn = document.getElementById('navFreeAuditBtn');
    const calendlyUrl = 'https://calendly.com/work-rajkumarkhatua/30min';
    let calendlyLoaderPromise;

    function ensureCalendly() {
      if (typeof Calendly !== 'undefined' && typeof Calendly.initPopupWidget === 'function') {
        return Promise.resolve(Calendly);
      }

      if (calendlyLoaderPromise) {
        return calendlyLoaderPromise;
      }

      calendlyLoaderPromise = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-calendly-widget]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://assets.calendly.com/assets/external/widget.css';
          link.dataset.calendlyWidget = 'true';
          document.head.appendChild(link);
        }

        const existingScript = document.querySelector('script[data-calendly-widget]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve(window.Calendly), { once: true });
          existingScript.addEventListener('error', reject, { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.dataset.calendlyWidget = 'true';
        script.onload = () => resolve(window.Calendly);
        script.onerror = reject;
        document.body.appendChild(script);
      });

      return calendlyLoaderPromise;
    }

    function toggleFreeAuditBtn() {
      if (!freeAuditBtn) return;
      if (freeAuditBtn.classList.contains('hidden-during-calendly')) return;

      if (window.scrollY > 400) {
        freeAuditBtn.style.opacity = '1';
        freeAuditBtn.style.pointerEvents = 'auto';
      } else {
        freeAuditBtn.style.opacity = '0';
        freeAuditBtn.style.pointerEvents = 'none';
      }
    }

    function hideFreeAuditBtn() {
      if (!freeAuditBtn) return;
      freeAuditBtn.classList.add('hidden-during-calendly');
      freeAuditBtn.style.opacity = '0';
      freeAuditBtn.style.pointerEvents = 'none';
    }

    function showFreeAuditBtn() {
      if (!freeAuditBtn) return;
      freeAuditBtn.classList.remove('hidden-during-calendly');
      toggleFreeAuditBtn();
    }

    function watchCalendlyClose() {
      const closeWatcher = setInterval(() => {
        const calendlyPopup =
          document.querySelector('.calendly-overlay') ||
          document.querySelector('.calendly-popup') ||
          document.querySelector('.calendly-popup-content');

        if (!calendlyPopup) {
          clearInterval(closeWatcher);
          showFreeAuditBtn();
        }
      }, 500);
    }

    async function openCalendlyPopup(e) {
      if (e) e.preventDefault();
      hideFreeAuditBtn();

      try {
        await ensureCalendly();
      } catch (error) {
        showFreeAuditBtn();
        window.open(calendlyUrl, '_blank', 'noopener');
        return;
      }

      if (typeof Calendly !== 'undefined' && typeof Calendly.initPopupWidget === 'function') {
        Calendly.initPopupWidget({ url: calendlyUrl });
        setTimeout(watchCalendlyClose, 800);
      } else {
        showFreeAuditBtn();
        window.open(calendlyUrl, '_blank', 'noopener');
      }
    }

    window.addEventListener('scroll', toggleFreeAuditBtn);
    window.addEventListener('load', toggleFreeAuditBtn);

    if (freeAuditBtn) {
      freeAuditBtn.addEventListener('click', openCalendlyPopup);
    }

    if (navFreeAuditBtn) {
      navFreeAuditBtn.addEventListener('click', openCalendlyPopup);
    }

// Theme Toggle Logic
const themeBtn = document.getElementById('themeToggle');
const themeBtnMobile = document.getElementById('themeToggleMobile');
const htmlEl = document.documentElement;
const themeIcon = themeBtn.querySelector('i');

// Check saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', 'dark');
    themeBtn.innerHTML = '<i data-lucide="sun"></i>';
    if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="sun"></i>';
}

themeBtn.addEventListener('click', toggleThemeFunc);
if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleThemeFunc);

function toggleThemeFunc() {
    const currentTheme = htmlEl.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        htmlEl.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        // We'd update lucide icon here but lucide requires re-creating
        themeBtn.innerHTML = '<i data-lucide="moon"></i>';
        if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="moon"></i>';
    } else {
        htmlEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeBtn.innerHTML = '<i data-lucide="sun"></i>';
        if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="sun"></i>';
    }
    lucide.createIcons();
}

// Modal Logic
const modal = document.getElementById('demoModal');
const closeBtn = document.getElementById('closeModal');
const demoBtns = document.querySelectorAll('.open-demo-btn');

demoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});


// tsParticles Initialization
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("tsparticles") && window.tsParticles) {
        tsParticles.load("tsparticles", {
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
            },
            modes: {
              grab: {
                distance: 200,
                links: {
                  opacity: 0.5,
                },
              },
            },
          },
          particles: {
            color: {
              value: ["#1a5cff", "#c8a96e"], // Blue and Gold
            },
            links: {
              color: "#8a8a9a", // Grey
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "bounce",
              },
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.4,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        });
    }
});

