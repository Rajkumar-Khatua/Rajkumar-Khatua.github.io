const fs = require('fs');
const path = require('path');

const projectId = 'kj3bgy2n';
const dataset = 'production';

// Sanity Portable Text Parser
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
        if (mark === 'strong') output = `<strong>${output}</strong>`;
        else if (mark === 'em') output = `<em>${output}</em>`;
        else {
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
            case 'h1': html += `<h1>${text}</h1>`; break;
            case 'h2': html += `<h2>${text}</h2>`; break;
            case 'h3': html += `<h3>${text}</h3>`; break;
            case 'h4': html += `<h4>${text}</h4>`; break;
            case 'blockquote': html += `<blockquote>${text}</blockquote>`; break;
            default: html += `<p>${text}</p>`; break;
        }
    });
    closeListIfOpen();
    return html;
}

function formatDate(dateString) {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function optimizeSanityImage(url) {
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=max&w=1400`;
}

async function build() {
    console.log("Fetching case studies from Sanity...");
    
    // Updated query to fetch new structured fields too!
    const query = encodeURIComponent(`*[_type == "post"] | order(publishedAt desc){
        title,
        slug,
        excerpt,
        publishedAt,
        clientIndustry,
        toolsUsed,
        businessProblem,
        metricMoved,
        liveDemoUrl,
        body,
        coverImage{ asset->{url} }
    }`);
    
    const url = `https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${query}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        const posts = data.result || [];
        
        console.log(`Found ${posts.length} case studies.`);
        
        const templatePath = path.join(__dirname, 'post.html');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        
        let sitemapUrls = [];
        
        for (const post of posts) {
            const slug = post.slug?.current;
            if (!slug) continue;
            
            console.log(`Generating HTML for: ${slug}`);
            let html = templateHtml;
            
            const title = post.title || 'Case Study | Rajkumar Khatua';
            const excerpt = post.excerpt || 'Read this real-world case study on Business Intelligence consulting.';
            const imageUrl = optimizeSanityImage(post.coverImage?.asset?.url) || 'https://rajkumarkhatua.me/assets/profile_image.jpg';
            const urlSlug = `https://rajkumarkhatua.me/case-study-${slug}.html`;
            
            // 1. Replace SEO Meta Tags
            html = html.replace(/<title>.*?<\/title>/g, `<title>${title} | Rajkumar Khatua</title>`);
            html = html.replace(/<meta property="og:title" content="[^"]*"/g, `<meta property="og:title" content="${title}"`);
            html = html.replace(/<meta name="twitter:title" content="[^"]*"/g, `<meta name="twitter:title" content="${title}"`);
            
            html = html.replace(/<meta property="og:description" content="[^"]*"/g, `<meta property="og:description" content="${excerpt}"`);
            html = html.replace(/<meta name="twitter:description" content="[^"]*"/g, `<meta name="twitter:description" content="${excerpt}"`);
            
            html = html.replace(/<meta property="og:image" content="[^"]*"/g, `<meta property="og:image" content="${imageUrl}"`);
            html = html.replace(/<meta name="twitter:image" content="[^"]*"/g, `<meta name="twitter:image" content="${imageUrl}"`);
            html = html.replace(/<meta property="og:url" content="[^"]*"/g, `<meta property="og:url" content="${urlSlug}"`);
            
            // 2. Inject Content directly into HTML body so it loads instantly
            const dateStr = formatDate(post.publishedAt);
            const bodyHtml = renderPortableText(post.body);
            
            // Structured Case Study Fields Injection
            let structuredFieldsHtml = '';
            if (post.clientIndustry || post.toolsUsed?.length || post.businessProblem || post.metricMoved) {
                structuredFieldsHtml = `
                <div class="case-study-meta" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
                    ${post.clientIndustry ? `<div><strong>Industry:</strong> ${post.clientIndustry}</div>` : ''}
                    ${post.toolsUsed?.length ? `<div><strong>Tools Used:</strong> ${post.toolsUsed.join(', ')}</div>` : ''}
                    ${post.businessProblem ? `<div style="margin-top:0.5rem;"><strong>The Problem:</strong> ${post.businessProblem}</div>` : ''}
                    ${post.metricMoved ? `<div style="margin-top:0.5rem; color: var(--accent); font-weight:600;"><strong>Result:</strong> ${post.metricMoved}</div>` : ''}
                    ${post.liveDemoUrl ? `<div style="margin-top:1rem;"><a href="${post.liveDemoUrl}" target="_blank" class="btn-dark" style="display:inline-block; padding: 0.5rem 1rem; font-size: 0.9rem;">View Live Demo <i data-lucide="external-link" style="width:14px;"></i></a></div>` : ''}
                </div>`;
            }
            
            // We use string replacement to inject the content into the DOM where post.js normally would
            // We also remove post.js so it doesn't double-render
            html = html.replace('<script src="assets/js/post.js"></script>', '');
            
            // Replace loading state with block display
            html = html.replace('<div id="status" class="status-box">Loading post...</div>', '');
            html = html.replace('style="display:none;"', 'style="display:block;"');
            
            // Replace Title, Date, Excerpt
            html = html.replace('<h1 id="postTitle" class="article-title"></h1>', `<h1 id="postTitle" class="article-title">${title}</h1>`);
            html = html.replace('<span id="postDate" class="article-date"></span>', `<span id="postDate" class="article-date">${dateStr}</span>`);
            html = html.replace('<p id="postExcerpt" class="article-excerpt"></p>', `<p id="postExcerpt" class="article-excerpt">${excerpt}</p>${structuredFieldsHtml}`);
            
            // Replace Image
            if (post.coverImage?.asset?.url) {
                html = html.replace('<div id="coverWrap" class="article-cover-wrap" style="display:none;">', '<div id="coverWrap" class="article-cover-wrap" style="display:block;">');
                html = html.replace('<img id="postImage" class="article-cover" alt="" />', `<img id="postImage" class="article-cover" src="${imageUrl}" alt="${title}" />`);
            }
            
            // Replace Body
            html = html.replace('<div id="postBody" class="content"></div>', `<div id="postBody" class="content">${bodyHtml}</div>`);
            
            // 3. Write HTML file
            const outPath = path.join(__dirname, `case-study-${slug}.html`);
            fs.writeFileSync(outPath, html, 'utf8');
            
            // Add to sitemap
            sitemapUrls.push(`  <url>
    <loc>${urlSlug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
        }
        
        // Build new Sitemap
        console.log("Generating sitemap.xml...");
        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rajkumarkhatua.me/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rajkumarkhatua.me/blog.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${sitemapUrls.join('\n')}
</urlset>`;

        fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml, 'utf8');
        console.log("Done! Run this script every time you publish a new case study.");
        
    } catch (err) {
        console.error("Build failed:", err);
    }
}

build();
