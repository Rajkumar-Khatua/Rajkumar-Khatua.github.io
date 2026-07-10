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
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
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
});
