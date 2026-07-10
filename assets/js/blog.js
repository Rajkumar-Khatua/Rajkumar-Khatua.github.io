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
                <h3 class="blog-card-title"><a href="post.html?slug=${slug}" style="color: inherit; text-decoration: none;">${postTitle}</a></h3>
                <p class="blog-card-excerpt">${excerpt}</p>
                <a class="blog-read" href="post.html?slug=${slug}">
                  View Case Study <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
                </a>
              </div>
            </article>
          `;
                }).join('');
                
                // Render the newly added lucide icons
                if (window.lucide) {
                    lucide.createIcons();
                }
            } catch (error) {
                console.error('Blog load error:', error);
                statusEl.style.display = 'block';
                statusEl.className = 'error-box';
                statusEl.textContent = 'Failed to load Case Studies. Please try again.';
            }
        }

        loadPosts();

        // Mobile menu moved to navbar.js


// Calendly moved to navbar.js
