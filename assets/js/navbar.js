document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    fetch("components/navbar.html")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load navbar");
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html;
            
            // Re-render lucide icons if library is loaded
            if (window.lucide) {
                lucide.createIcons();
            }
            
            initNavbarLogic();
            highlightActiveLink();
            
            // Dispatch event so other scripts know navbar is ready
            document.dispatchEvent(new Event("navbarLoaded"));
        })
        .catch(error => console.error("Error loading navbar:", error));

    function highlightActiveLink() {
        const path = window.location.pathname;
        const page = path.split("/").pop() || "index.html";
        
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            item.classList.remove("active");
            const href = item.getAttribute("href");
            if (href) {
                const hrefPage = href.split("#")[0];
                if (hrefPage === page && page !== "index.html") {
                    item.classList.add("active");
                }
            }
        });
    }

    function initNavbarLogic() {
        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        const navBackdrop = document.getElementById('navBackdrop');
        const navCloseBtn = document.getElementById('navCloseBtn');
        const themeBtn = document.getElementById('themeToggle');
        const themeBtnMobile = document.getElementById('themeToggleMobile');
        
        // Scroll Logic
        if (navbar) {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                // Toggle scrolled state (background blur)
                navbar.classList.toggle('scrolled', currentScrollY > 60);
                
                // Hide/show logic based on scroll direction
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down & past header -> hide
                    navbar.classList.add('nav-hidden');
                } else {
                    // Scrolling up -> show
                    navbar.classList.remove('nav-hidden');
                }
                
                lastScrollY = currentScrollY;
            });
            // trigger once on load
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }

        // Mobile Menu Logic
        if (menuToggle && navLinks && navBackdrop && navCloseBtn) {
            function openMenu() {
                navLinks.classList.add('open');
                navBackdrop.classList.add('open'); // Some files use 'open', some use 'visible'
                navBackdrop.classList.add('visible'); 
                menuToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }

            function closeMenu() {
                navLinks.classList.remove('open');
                navBackdrop.classList.remove('open');
                navBackdrop.classList.remove('visible');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }

            menuToggle.addEventListener('click', () => {
                navLinks.classList.contains('open') ? closeMenu() : openMenu();
            });

            navCloseBtn.addEventListener('click', closeMenu);
            navBackdrop.addEventListener('click', closeMenu);

            document.querySelectorAll('.mobile-menu-links a, .mobile-hire-btn').forEach(link => {
                link.addEventListener('click', closeMenu);
            });
        }

        // Theme Toggle Logic
        const htmlEl = document.documentElement;
        
        function toggleThemeFunc() {
            const currentTheme = htmlEl.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                htmlEl.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (themeBtn) themeBtn.innerHTML = '<i data-lucide="moon"></i>';
                if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="moon"></i>';
            } else {
                htmlEl.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeBtn) themeBtn.innerHTML = '<i data-lucide="sun"></i>';
                if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="sun"></i>';
            }
            if (window.lucide) {
                lucide.createIcons();
            }
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            if (themeBtn) themeBtn.innerHTML = '<i data-lucide="sun"></i>';
            if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="sun"></i>';
            if (window.lucide) lucide.createIcons();
        }

        if (themeBtn) themeBtn.addEventListener('click', toggleThemeFunc);
        if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleThemeFunc);

        // Calendly Logic
        const navFreeAuditBtn = document.getElementById('navFreeAuditBtn');
        const mobileFreeAuditBtn = document.getElementById('mobileFreeAuditBtn');
        const calendlyUrl = 'https://calendly.com/work-rajkumarkhatua/30min';
        let calendlyLoaderPromise;

        function ensureCalendly() {
            if (typeof Calendly !== 'undefined' && typeof Calendly.initPopupWidget === 'function') {
                return Promise.resolve(Calendly);
            }
            if (calendlyLoaderPromise) return calendlyLoaderPromise;

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

        async function openCalendlyPopup(e) {
            if (e) e.preventDefault();
            try {
                await ensureCalendly();
            } catch (error) {
                window.open(calendlyUrl, '_blank', 'noopener');
                return;
            }
            if (typeof Calendly !== 'undefined' && typeof Calendly.initPopupWidget === 'function') {
                Calendly.initPopupWidget({ url: calendlyUrl });
            } else {
                window.open(calendlyUrl, '_blank', 'noopener');
            }
        }

        if (navFreeAuditBtn) navFreeAuditBtn.addEventListener('click', openCalendlyPopup);
        if (mobileFreeAuditBtn) mobileFreeAuditBtn.addEventListener('click', openCalendlyPopup);
    }

    // --- Sitewide Features (Cursor, Scroll Progress & Cookie Banner) ---
    function initSitewideFeatures() {
        // 0. Custom Cursor
        let cursor = document.getElementById('cursor');
        let cursorRing = document.getElementById('cursorRing');
        
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'cursor';
            cursor.id = 'cursor';
            document.body.appendChild(cursor);
        }
        if (!cursorRing) {
            cursorRing = document.createElement('div');
            cursorRing.className = 'cursor-ring';
            cursorRing.id = 'cursorRing';
            document.body.appendChild(cursorRing);
        }

        const useCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
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

            // Delegate hover events for performance
            document.addEventListener('mouseover', (e) => {
                const target = e.target.closest('a, button, .service-card, .project-card, .t-card, .exp-card, .hl-card, .photo-frame, .about-photo-wrap, .error-btn');
                if (target) cursorRing.classList.add('hover');
            });
            document.addEventListener('mouseout', (e) => {
                const target = e.target.closest('a, button, .service-card, .project-card, .t-card, .exp-card, .hl-card, .photo-frame, .about-photo-wrap, .error-btn');
                if (target) cursorRing.classList.remove('hover');
            });
        } else {
            cursor.style.display = 'none';
            cursorRing.style.display = 'none';
            document.body.style.cursor = 'auto';
        }

        // 1. Scroll Progress Bar
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            // Prevent division by zero on very short pages
            const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        });

        // 2. Cookie Consent Banner
        if (!localStorage.getItem('cookieConsent')) {
            const cookieBanner = document.createElement('div');
            cookieBanner.id = 'cookie-banner';
            cookieBanner.innerHTML = `
                <div class="cookie-content">
                    <p>We use cookies to analyze site traffic and improve your experience.</p>
                    <button id="cookieAcceptBtn" class="btn-dark" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Accept</button>
                </div>
            `;
            document.body.appendChild(cookieBanner);

            document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                cookieBanner.style.opacity = '0';
                cookieBanner.style.transform = 'translateY(20px)';
                setTimeout(() => cookieBanner.remove(), 300);
            });
        }
    }
    
    initSitewideFeatures();
});
