
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
          _subject: subject,
          Message: "A visitor on your website has requested the free 5-Point Zoho Analytics Audit Checklist!",
          Action_Required: "Please reply to this email, attach the PDF checklist, and ask them about their current data reporting bottlenecks."
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

// Project Filtering
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset classes
                card.classList.remove('fade-in');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.classList.remove('hide');
                    // Strip the reveal classes to prevent fadeUp conflict
                    card.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'visible');
                    
                    // Trigger reflow
                    void card.offsetWidth;
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", initProjectFilters);


// Removed dead tsParticles logic as it's handled by network.js on canvas

// Initialize Calendly
function initCalendly() {
    const calendlyBtns = document.querySelectorAll('.calendly-trigger');
    calendlyBtns.forEach(btn => {
        btn.removeEventListener('click', openCalendly);
        btn.addEventListener('click', openCalendly);
    });
}

function openCalendly(e) {
    e.preventDefault();
    if (window.Calendly) {
        Calendly.initPopupWidget({ url: 'https://calendly.com/rajkumarkhatua/30min' });
    } else {
        console.warn("Calendly is not loaded yet.");
    }
}

// Bind on load and when navbar loads
document.addEventListener("DOMContentLoaded", initCalendly);
document.addEventListener('navbarLoaded', initCalendly);
