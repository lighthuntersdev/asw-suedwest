const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content', 'blog');
const OUTPUT_DIR = __dirname;
const BLOG_PAGE = path.join(__dirname, 'blog.html');

function parseMarkdown(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return null;

  const frontmatter = {};
  fmMatch[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    frontmatter[key] = val;
  });

  return { frontmatter, body: fmMatch[2].trim() };
}

function mdToHtml(md) {
  let html = md;
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  const lines = html.split('\n');
  let result = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${trimmed.slice(2)}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      if (trimmed === '') continue;
      if (!trimmed.startsWith('<h') && !trimmed.startsWith('<ul') && !trimmed.startsWith('<li') && !trimmed.startsWith('</')) {
        result.push(`<p>${trimmed}</p>`);
      } else {
        result.push(trimmed);
      }
    }
  }
  if (inList) result.push('</ul>');

  return result.join('\n    ');
}

function formatDate(dateStr) {
  const months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const d = new Date(dateStr);
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function generateBlogPost(post, slug) {
  const { frontmatter: fm, body } = post;
  const articleHtml = mdToHtml(body);
  const dateFormatted = formatDate(fm.date);
  const imgSrc = fm.image || 'images/hero-building.jpg';
  const imgAlt = fm.image_alt || fm.title;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fm.title} | ASW s&uuml;dwest Blog</title>
  <meta name="description" content="${fm.description || ''}">
  <meta name="author" content="ASW s&uuml;dwest GmbH">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${fm.title} | ASW s&uuml;dwest">
  <meta property="og:description" content="${fm.description || ''}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="de_DE">
  <link rel="canonical" href="https://www.asw-suedwest.de/blog/${slug}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav role="navigation" aria-label="Hauptnavigation">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="ASW s&uuml;dwest &ndash; Startseite">
        <img src="images/logo-horizontal.svg" alt="ASW s&uuml;dwest" style="height: 40px; width: auto;">
      </a>
      <ul class="nav-links">
        <li class="nav-dropdown">
          <a href="versicherungen.html">Leistungen <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></a>
          <ul class="nav-dropdown-menu">
            <li><a href="versicherungen.html">Versicherungen</a></li>
            <li><a href="finanzierungen.html">Finanzierungen</a></li>
            <li><a href="benefits.html">Benefits</a></li>
            <li><a href="services.html">Services</a></li>
          </ul>
        </li>
        <li><a href="ueber-uns.html">&Uuml;ber uns</a></li>
        <li><a href="blog.html" class="active">Blog</a></li>
        <li><a href="schadenportal.html">Schadenportal</a></li>
        <li><a href="index.html#faq">FAQ</a></li>
        <li><a href="herzenspartner.html">Herzenspartner</a></li>
        <li><a href="index.html#kontakt" class="nav-cta">Risikoanalyse</a></li>
      </ul>
      <button class="nav-mobile-toggle" aria-label="Men&uuml; &ouml;ffnen">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <section class="blog-article-hero" style="padding-top: 100px;">
    <div class="container">
      <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 24px; display: flex; align-items: center; gap: 6px;">
        <a href="index.html" style="color: var(--text-muted); text-decoration: none;">Startseite</a>
        <span>&rsaquo;</span>
        <a href="blog.html" style="color: var(--text-muted); text-decoration: none;">Blog</a>
        <span>&rsaquo;</span>
        <span style="color: var(--text-secondary);">${fm.title}</span>
      </div>
      <div class="blog-article-meta">
        <span class="blog-category">${fm.category || 'Wohnungswirtschaft'}</span>
        <span>${dateFormatted}</span>
        <span>&middot;</span>
        <span>${fm.readtime || '5 Min. Lesezeit'}</span>
      </div>
      <h1>${fm.title}</h1>
      <p class="lead">${fm.description || ''}</p>
    </div>
  </section>

  <div class="blog-article-img">
    <img src="${imgSrc}" alt="${imgAlt}" loading="eager" style="width:100%; height:100%; object-fit:cover;">
  </div>

  <article class="blog-article-body">
    ${articleHtml}
  </article>

  <section class="cta-section">
    <div class="container">
      <div class="cta-content reveal">
        <h2>Haben Sie Fragen zu diesem Thema?</h2>
        <p>Unsere Experten beraten Sie gerne pers&ouml;nlich zu allen Versicherungsfragen der Wohnungswirtschaft.</p>
        <div class="cta-actions">
          <a href="mailto:info@asw-suedwest.de" class="btn-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
            Kontakt aufnehmen
          </a>
        </div>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="footer-logo"><img src="images/logo-horizontal.svg" alt="ASW s&uuml;dwest" style="height: 36px; width: auto; filter: brightness(0) invert(1);"></a>
          <p>Spezialisierter Versicherungsmakler f&uuml;r die Wohnungswirtschaft. Seit &uuml;ber 25 Jahren Ihr Partner.</p>
        </div>
        <div class="footer-column">
          <h4>Leistungen</h4>
          <ul>
            <li><a href="versicherungen.html">Versicherungen</a></li>
            <li><a href="finanzierungen.html">Finanzierungen</a></li>
            <li><a href="benefits.html">Ihre Vorteile</a></li>
            <li><a href="services.html">Services &amp; Netzwerk</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Unternehmen</h4>
          <ul>
            <li><a href="ueber-uns.html">&Uuml;ber uns</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="schadenportal.html">Schadenportal</a></li>
            <li><a href="herzenspartner.html">Herzenspartner</a></li>
            <li><a href="index.html#kontakt">Kontakt</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Rechtliches</h4>
          <ul>
            <li><a href="impressum.html">Impressum</a></li>
            <li><a href="#">Datenschutz</a></li>
            <li><a href="#">AGB</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ASW s&uuml;dwest GmbH. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  </footer>

  <script>
    (function() {
      'use strict';
      var nav = document.querySelector('nav');
      if (nav) window.addEventListener('scroll', function() { nav.classList.toggle('nav-scrolled', window.scrollY > 20); }, { passive: true });
      var toggle = document.querySelector('.nav-mobile-toggle');
      var navLinks = document.querySelector('.nav-links');
      if (toggle && navLinks) toggle.addEventListener('click', function() { navLinks.classList.toggle('nav-open'); toggle.classList.toggle('active'); });
      var observer = new IntersectionObserver(function(entries) { entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } }); }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
    })();
  </script>
</body>
</html>`;
}

function generateBlogCard(post, slug) {
  const { frontmatter: fm } = post;
  const dateFormatted = formatDate(fm.date);
  const imgSrc = fm.image || 'images/hero-building.jpg';
  const imgAlt = fm.image_alt || fm.title;

  return `
        <a href="blog/${slug}.html" class="blog-card reveal" style="text-decoration:none; color:inherit;">
          <div class="blog-card-image" style="position:relative;">
            <img src="${imgSrc}" alt="${imgAlt}" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;">
            <span class="blog-card-badge">${fm.category || 'Wohnungswirtschaft'}</span>
          </div>
          <div class="blog-card-content">
            <div class="blog-card-meta">
              <span>${dateFormatted}</span>
              <span>${fm.readtime || '5 Min. Lesezeit'}</span>
            </div>
            <h3 class="blog-card-title">${fm.title}</h3>
            <p>${fm.description || ''}</p>
            <span class="blog-card-link">Weiterlesen &rarr;</span>
          </div>
        </a>`;
}

function build() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No content/blog directory found, skipping blog build.');
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('No blog posts found in content/blog/');
    return;
  }

  const blogDir = path.join(OUTPUT_DIR, 'blog');
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

  const posts = [];

  for (const file of files) {
    const slug = file.replace('.md', '');
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const parsed = parseMarkdown(raw);
    if (!parsed) {
      console.warn(`Skipping ${file}: invalid frontmatter`);
      continue;
    }

    const html = generateBlogPost(parsed, slug);
    fs.writeFileSync(path.join(blogDir, `${slug}.html`), html, 'utf-8');
    console.log(`Built: blog/${slug}.html`);

    posts.push({ ...parsed, slug });
  }

  posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

  if (fs.existsSync(BLOG_PAGE)) {
    let blogHtml = fs.readFileSync(BLOG_PAGE, 'utf-8');
    const cmsCards = posts.map(p => generateBlogCard(p, p.slug)).join('\n');
    const marker = '<!-- CMS_BLOG_POSTS -->';
    const endMarker = '<!-- /CMS_BLOG_POSTS -->';

    if (blogHtml.includes(marker)) {
      const startIdx = blogHtml.indexOf(marker);
      const endIdx = blogHtml.indexOf(endMarker);
      if (endIdx > startIdx) {
        blogHtml = blogHtml.slice(0, startIdx + marker.length) + '\n' + cmsCards + '\n        ' + blogHtml.slice(endIdx);
        fs.writeFileSync(BLOG_PAGE, blogHtml, 'utf-8');
        console.log('Updated blog.html with CMS posts');
      }
    }
  }

  console.log(`\nBuild complete: ${posts.length} blog post(s) generated.`);
}

build();
