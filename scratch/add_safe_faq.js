const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const faqs = [
  {
    category: "Trust & Credibility",
    q: "Are you an agency or a solo consultant?",
    a: "I lead every engagement personally as your BI strategist and architect. For full-scope builds needing extra hands across CRM, Books, or Creator, I work with a small network of vetted Zoho implementers I've collaborated with before — you always deal with me as the single point of contact."
  },
  {
    q: "Can you actually deliver results, or is this just dashboards?",
    a: "I focus on decisions, not charts. Every engagement starts by identifying the 2-3 numbers your leadership actually needs to act on — then I build the data architecture and dashboards around those, not the other way around."
  },
  {
    category: "Scope",
    q: "Do you only do Zoho Analytics, or other Zoho apps too?",
    a: "Analytics is my core focus, but most of my work touches the full ecosystem — CRM, Books, Inventory, Creator, Projects — since that's where the underlying data actually lives. If your bottleneck is in the source app rather than the dashboard, I'll tell you that upfront."
  },
  {
    q: "What if my Zoho setup is a mess / I don't even know what's wrong?",
    a: "That's exactly what the free audit is for. Most clients come to me without a clear diagnosis — I look at your current syncs, reports, and dashboards and tell you specifically what's broken and what it would take to fix it."
  },
  {
    category: "Process & Timeline",
    q: "What happens after I book the free audit?",
    a: "A 15-30 minute call where I look at your current Zoho Analytics setup (screen share works fine) and walk you through what I'm seeing — sync issues, data trust problems, dashboard gaps. You get a short written summary after, no obligation to hire me."
  },
  {
    q: "How long does a typical project take?",
    a: "A single-dashboard rebuild usually runs 1-3 weeks. Full BI system builds spanning multiple Zoho apps run 4-8 weeks depending on data complexity. I'll give you a specific timeline after the audit, not before."
  },
  {
    q: "I already work with a BI person/agency — can you just review their work?",
    a: "Yes — a second-opinion audit is one of the most common ways people start working with me. I'm not territorial about it."
  },
  {
    category: "Pricing",
    q: "What does this cost?",
    a: "The audit is free. Project pricing depends on scope — a single dashboard fix is a different investment than a multi-app BI system. I'll give you a real number after understanding your setup on the audit call, not a generic rate card that doesn't match your situation."
  },
  {
    category: "Logistics for remote/global clients",
    q: "I'm not in India — does time zone matter?",
    a: "No — I work with clients across North America, Europe, and the Middle East regularly and structure calls and async updates around your hours, not mine."
  },
  {
    q: "How do we handle access to our Zoho data securely?",
    a: "You grant scoped access through Zoho's own user-permission system — I never need your login credentials, and access can be revoked by you at any time."
  }
];

let faqHtml = `
  <section id="faq" style="padding: 6rem 0; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.01);">
    <div class="reveal">
      <div class="section-tag" style="margin-bottom: 1rem; text-align: center; margin-inline: auto;">Common Questions</div>
    </div>
    <div class="reveal reveal-delay-1">
      <h2 class="section-title" style="text-align: center; max-width: 600px; margin-inline: auto;">Clear Answers for <em>Clear Decisions</em></h2>
    </div>

    <div class="faq-container reveal reveal-delay-2" style="max-width: 800px; margin: 3rem auto 0;">`;

faqs.forEach(f => {
  if (f.category) {
    faqHtml += `
      <div style="margin: 2.5rem 0 1rem; font-size: 1.2rem; font-weight: 600; color: var(--accent); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
        ${f.category}
      </div>`;
  }
  faqHtml += `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          ${f.q}
          <i data-lucide="chevron-down" class="faq-icon"></i>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            ${f.a}
          </div>
        </div>
      </div>`;
});

faqHtml += `
    </div>
  </section>

  <section id="contact">`;

const ldJsonData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }))
};
const ldJsonStr = `<script type="application/ld+json">
${JSON.stringify(ldJsonData, null, 2)}
</script>
</head>`;

// Safely insert HTML before contact section
html = html.replace('  <section id="contact">', faqHtml);

// Safely insert JSON-LD before closing head
html = html.replace('</head>', ldJsonStr);

fs.writeFileSync(htmlPath, html);
console.log('Safe FAQ inserted successfully');
