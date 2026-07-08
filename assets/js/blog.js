const projectId = 'kj3bgy2n';
        const dataset = 'production';

        const query = encodeURIComponent(`*[_type == "post"] | order(publishedAt desc){
      title,
      slug,
      excerpt,
      publishedAt,
      coverImage{
        asset->{
          url
        }
      }
    }`);

        const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${query}`;

        const statusEl = document.getElementById('status');
        const blogGrid = document.getElementById('blogGrid');

        function formatDate(dateString) {
            if (!dateString) return 'No date';
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function optimizeSanityImage(url) {
            if (!url) return '';
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}auto=format&fit=max&w=720`;
        }

        async function loadPosts() {
            try {
                const res = await fetch(url);
                const data = await res.json();
                const posts = data.result || [];

                statusEl.style.display = 'none';

                if (!posts.length) {
                    statusEl.style.display = 'block';
                    statusEl.className = 'empty-box';
                    statusEl.textContent = 'No published Case Studies found yet.';
                    return;
                }

                blogGrid.innerHTML = posts.map(post => {
                    const imageUrl = optimizeSanityImage(post.coverImage?.asset?.url || '');
                    const slug = post.slug?.current || '';
                    const postTitle = post.title || 'Untitled Post';
                    const excerpt = post.excerpt || 'No excerpt available yet.';
                    const postDate = formatDate(post.publishedAt);

                    return `
            <article class="blog-card">
              <div class="blog-card-media">
                ${imageUrl ? `<img src="${imageUrl}" alt="${postTitle}" loading="lazy" decoding="async">` : ''}
              </div>
              <div class="blog-card-body">
                <div class="blog-meta">
                  <span class="blog-date">${postDate}</span>
                  <span class="blog-dot"></span>
                 <span class="blog-label">Case Study</span>
                </div>
                <h3 class="blog-card-title">${postTitle}</h3>
                <p class="blog-card-excerpt">${excerpt}</p>
                <a class="blog-read" href="post.html?slug=${slug}">
                  View Case Study <span>-></span>
                </a>
              </div>
            </article>
          `;
                }).join('');
            } catch (error) {
                console.error('Blog load error:', error);
                statusEl.style.display = 'block';
                statusEl.className = 'error-box';
                statusEl.textContent = 'Failed to load Case Studies. Please try again.';
            }
        }

        loadPosts();

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
        navCloseBtn.addEventListener('click', closeMenu);

        document.querySelectorAll('.mobile-menu-links a, .mobile-hire-btn').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

const navFreeAuditBtn = document.getElementById('navFreeAuditBtn');
        const mobileFreeAuditBtn = document.getElementById('mobileFreeAuditBtn');
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

        if (navFreeAuditBtn) {
            navFreeAuditBtn.addEventListener('click', openCalendlyPopup);
        }

        if (mobileFreeAuditBtn) {
            mobileFreeAuditBtn.addEventListener('click', openCalendlyPopup);
        }