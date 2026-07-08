const projectId = 'kj3bgy2n';
        const dataset = 'production';

        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

        const statusEl = document.getElementById('status');
        const postContainer = document.getElementById('postContainer');
        const postTitle = document.getElementById('postTitle');
        const postDate = document.getElementById('postDate');
        const postExcerpt = document.getElementById('postExcerpt');
        const postImage = document.getElementById('postImage');
        const coverWrap = document.getElementById('coverWrap');
        const postBody = document.getElementById('postBody');

        if (!slug) {
            statusEl.textContent = 'No post slug provided.';
            statusEl.className = 'error-box';
            throw new Error('Missing slug');
        }

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
            return `${url}${separator}auto=format&fit=max&w=1400`;
        }

        function escapeHtml(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function applyMarks(text, marks = [], markDefs = []) {
            let output = escapeHtml(text);

            marks.forEach(mark => {
                if (mark === 'strong') {
                    output = `<strong>${output}</strong>`;
                } else if (mark === 'em') {
                    output = `<em>${output}</em>`;
                } else {
                    const def = markDefs.find(defItem => defItem._key === mark);
                    if (def && def._type === 'link' && def.href) {
                        output = `<a href="${def.href}" target="_blank" rel="noopener noreferrer">${output}</a>`;
                    }
                }
            });

            return output;
        }

        function renderChildren(children = [], markDefs = []) {
            return children.map(child => {
                if (child._type !== 'span') return '';
                return applyMarks(child.text || '', child.marks || [], markDefs);
            }).join('');
        }

        function renderPortableText(blocks) {
            if (!Array.isArray(blocks)) return '';

            let html = '';
            let currentListType = null;

            function closeListIfOpen() {
                if (currentListType) {
                    html += currentListType === 'bullet' ? '</ul>' : '</ol>';
                    currentListType = null;
                }
            }

            blocks.forEach(block => {
                if (block._type !== 'block') return;

                const text = renderChildren(block.children || [], block.markDefs || []);
                const listType = block.listItem || null;

                if (listType) {
                    if (currentListType !== listType) {
                        closeListIfOpen();
                        html += listType === 'bullet' ? '<ul>' : '<ol>';
                        currentListType = listType;
                    }
                    html += `<li>${text}</li>`;
                    return;
                }

                closeListIfOpen();

                switch (block.style) {
                    case 'h1':
                        html += `<h1>${text}</h1>`;
                        break;
                    case 'h2':
                        html += `<h2>${text}</h2>`;
                        break;
                    case 'h3':
                        html += `<h3>${text}</h3>`;
                        break;
                    case 'h4':
                        html += `<h4>${text}</h4>`;
                        break;
                    case 'blockquote':
                        html += `<blockquote>${text}</blockquote>`;
                        break;
                    default:
                        html += `<p>${text}</p>`;
                        break;
                }
            });

            if (currentListType) {
                html += currentListType === 'bullet' ? '</ul>' : '</ol>';
            }

            return html;
        }

        const query = encodeURIComponent(`*[_type == "post" && slug.current == "${slug}"][0]{
      title,
      excerpt,
      publishedAt,
      body,
      coverImage{
        asset->{
          url
        }
      }
    }`);

        const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${query}`;

        async function loadPost() {
            try {
                const res = await fetch(url);
                const data = await res.json();
                const post = data.result;

                if (!post) {
                    statusEl.textContent = 'Post not found.';
                    statusEl.className = 'error-box';
                    return;
                }

                postTitle.textContent = post.title || 'Untitled Post';
                postDate.textContent = formatDate(post.publishedAt);
                postExcerpt.textContent = post.excerpt || '';

                if (!post.excerpt) {
                    postExcerpt.style.display = 'none';
                }

                if (post.coverImage?.asset?.url) {
                    postImage.src = optimizeSanityImage(post.coverImage.asset.url);
                    postImage.alt = post.title || 'Case study cover image';
                    postImage.loading = 'eager';
                    postImage.decoding = 'async';
                    coverWrap.style.display = 'block';
                }

                postBody.innerHTML = renderPortableText(post.body);

                statusEl.style.display = 'none';
                postContainer.style.display = 'block';
            } catch (error) {
                console.error('Post load error:', error);
                statusEl.textContent = 'Failed to load post. Please try again.';
                statusEl.className = 'error-box';
            }
        }

        loadPost();

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