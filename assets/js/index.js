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

    // Navbar scroll moved to navbar.js


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

    // Mobile menu moved to navbar.js


    

// Calendly logic moved to navbar.js

// Theme toggle moved to navbar.js


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

// Formspree Lead Magnet form
const magnetForm = document.getElementById('magnetForm');
const magnetSuccess = document.getElementById('magnetSuccess');
const magnetSubmitBtn = document.getElementById('magnetSubmitBtn');

if (magnetForm) {
  magnetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = magnetForm.email.value.trim();
    const subject = magnetForm._subject.value;

    if (!email) {
      alert('Please enter your email.');
      return;
    }

    magnetSubmitBtn.textContent = 'Sending...';
    magnetSubmitBtn.disabled = true;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          _subject: subject
        })
      });

      if (response.ok) {
        magnetForm.reset();
        magnetForm.style.display = 'none';
        magnetSuccess.style.display = 'block';
        
        // Re-initialize Lucide icons for the new success icon
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      } else {
        alert('Oops! There was a problem submitting your request.');
        magnetSubmitBtn.innerHTML = 'Send me the Checklist <i data-lucide="arrow-right" class="btn-icon"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        magnetSubmitBtn.disabled = false;
      }
    } catch (error) {
      alert('Oops! There was a problem submitting your request.');
      magnetSubmitBtn.innerHTML = 'Send me the Checklist <i data-lucide="arrow-right" class="btn-icon"></i>';
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      magnetSubmitBtn.disabled = false;
    }
  });
}

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});


// Removed dead tsParticles logic as it's handled by network.js on canvas
