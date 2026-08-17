const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../assets/site.css');
const jsPath = path.join(__dirname, '../assets/js/index.js');
const htmlPath = path.join(__dirname, '../index.html');

// 1. Append CSS
const css = `
/* FAQ Section */
.faq-container { display: flex; flex-direction: column; gap: 1rem; }
.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  transition: all 0.3s ease;
}
.faq-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}
.faq-question {
  width: 100%;
  text-align: left;
  padding: 1.5rem;
  background: none;
  border: none;
  color: var(--white);
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.3s ease;
  font-family: inherit;
}
.faq-question:hover { color: var(--accent); }
.faq-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--accent);
  transition: transform 0.3s ease;
}
.faq-question[aria-expanded="true"] .faq-icon {
  transform: rotate(180deg);
}
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-answer-inner {
  padding: 0 1.5rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  font-size: 1rem;
}
[data-theme="light"] .faq-item {
  border-color: rgba(13, 27, 42, 0.1);
  background: rgba(255, 255, 255, 0.6);
}
[data-theme="light"] .faq-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(13, 27, 42, 0.2);
}
[data-theme="light"] .faq-question { color: var(--navy); }
[data-theme="light"] .faq-answer-inner { color: var(--text2); }
`;
fs.appendFileSync(cssPath, css);

// 2. Append JS
const js = `
// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    
    document.querySelectorAll('.faq-question').forEach(otherBtn => {
      if (otherBtn !== button) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherBtn.nextElementSibling.style.maxHeight = null;
      }
    });
    
    button.setAttribute('aria-expanded', !expanded);
    const answer = button.nextElementSibling;
    if (!expanded) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      answer.style.maxHeight = null;
    }
  });
});
`;
fs.appendFileSync(jsPath, js);

// 3. Inject FAQPage JSON-LD schema into index.html
const ldjson = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What is the typical cost and timeline for a dashboard?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most custom Zoho Analytics dashboards range between $1,500 - $4,000 depending on data complexity and integration needs. A standard build takes 2 to 4 weeks from kickoff to deployment. For enterprise ERP/CRM data modeling, timelines and costs are scoped individually."
      }
    }, {
      "@type": "Question",
      "name": "Do you need my admin credentials? How is my data protected?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I prioritize data privacy. I do not need your master admin credentials. We will set up a restricted developer account with access only to the specific Zoho modules required for the build. All work is done within your secure Zoho environment, and I never export or host your data externally."
      }
    }, {
      "@type": "Question",
      "name": "What happens if the dashboard breaks after you finish?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every project includes a 30-day post-launch warranty. If an API breaks or a calculation errors out due to my build, I fix it for free. I also provide comprehensive handover documentation so your internal team understands the data model. Retainer options are available for ongoing BI support."
      }
    }, {
      "@type": "Question",
      "name": "Do you handle Zoho CRM and Creator development too?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "My primary expertise is in Business Intelligence, data modeling, and Analytics. For deep Deluge scripting, heavy Creator apps, or full CRM overhauls, I partner with a network of vetted Zoho specialized developers. I lead the architecture and reporting strategy, while they handle the underlying tech build."
      }
    }]
  }
  </script>
</head>`;

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('</head>', ldjson);
fs.writeFileSync(htmlPath, html);

console.log("FAQ assets added successfully");
