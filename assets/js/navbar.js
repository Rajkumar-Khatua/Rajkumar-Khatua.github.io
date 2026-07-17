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
            if (htmlEl.getAttribute('data-theme') === 'dark') {
                htmlEl.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (themeBtn) themeBtn.innerHTML = '<i data-lucide="moon"></i>';
                if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="moon"></i>';
                if (typeof Cal !== 'undefined' && Cal.ns && Cal.ns["free-audit"]) {
                    Cal.ns["free-audit"]("ui", { "theme": "light" });
                }
            } else {
                htmlEl.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeBtn) themeBtn.innerHTML = '<i data-lucide="sun"></i>';
                if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="sun"></i>';
                if (typeof Cal !== 'undefined' && Cal.ns && Cal.ns["free-audit"]) {
                    Cal.ns["free-audit"]("ui", { "theme": "dark" });
                }
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

        // Cal.com Logic
        (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
        Cal("init", "free-audit", {origin:"https://app.cal.com"});
        Cal.config = Cal.config || {};
        Cal.config.forwardQueryParams = true;
        
        let initialTheme = localStorage.getItem('theme');
        if (!initialTheme) {
            initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        Cal.ns["free-audit"]("ui", {"theme": initialTheme, "cssVarsPerTheme":{"light":{"cal-brand":"#0d1b2a"},"dark":{"cal-brand":"#c8a96e"}},"hideEventTypeDetails":false,"layout":"month_view"});
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

        function loadGoogleAnalytics() {
            if (window.gtag) return;
            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-TRY624F47L';
            document.head.appendChild(script1);

            const script2 = document.createElement('script');
            script2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TRY624F47L');
            `;
            document.head.appendChild(script2);
        }

        // 2. Cookie Consent Banner
        const consentState = localStorage.getItem('cookieConsent');
        if (consentState === 'accepted' || consentState === 'true') {
            loadGoogleAnalytics();
            // Upgrade old 'true' state to 'accepted'
            if (consentState === 'true') localStorage.setItem('cookieConsent', 'accepted');
        } else if (!consentState) {
            const cookieBanner = document.createElement('div');
            cookieBanner.id = 'cookie-banner';
            cookieBanner.innerHTML = `
                <div class="cookie-content">
                    <p>Grab a cookie! 🍪 We use them just to make sure the site is working nicely for you.</p>
                    <div class="cookie-buttons">
                        <button id="cookieAcceptBtn" class="cookie-btn cookie-accept">I love cookies! 🍪</button>
                        <button id="cookieRejectBtn" class="cookie-btn cookie-reject">I'm on a diet</button>
                    </div>
                </div>
            `;
            document.body.appendChild(cookieBanner);

            document.getElementById('cookieAcceptBtn').addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                loadGoogleAnalytics();
                closeBanner();
            });

            rejectBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'rejected');
                closeBanner();
            });

            function closeBanner() {
                cookieBanner.style.opacity = '0';
                cookieBanner.style.transform = 'translateY(20px)';
                setTimeout(() => cookieBanner.remove(), 300);
            }
        }
    }
    
    initSitewideFeatures();
});
