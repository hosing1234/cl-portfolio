const SECTION_CONFIG = [
  { label: 'About', id: 'about' },
  { label: 'AI Era', id: 'ai-era' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

let portfolioData = null;
let activeSection = 'About';
let knowMoreOpen = false;
let navOpen = false;

function isDesktopViewport() {
  return window.matchMedia('(min-width: 901px)').matches;
}

async function loadPortfolio() {
  const response = await fetch('data/portfolio.json');
  if (!response.ok) throw new Error('Failed to load portfolio data');
  return response.json();
}

function buildSectionPreviews(data) {
  const topSkills = data.skills
    .flatMap((group) => group.items.slice(0, 2))
    .slice(0, 4);

  return {
    About: [
      data.hero.title,
      `Based in ${data.contact.location}`,
      '5+ years production experience',
      'Know more for full story',
    ],
    'AI Era': [
      data.aiEra?.kicker || 'On work and tools',
      'Communication over automation',
      'Requirements before code',
      'Friction, not replacement',
    ],
    Skills: topSkills,
    Experience: data.experience.map((exp) => `${exp.role} @ ${exp.company}`),
    Projects: data.projects.slice(0, 4).map((project) => project.title.split(' — ')[0]),
    Contact: [
      data.contact.email,
      data.contact.github.replace('https://', ''),
      data.contact.location,
    ],
  };
}

function renderIntro(lines) {
  const screen = document.getElementById('intro-screen');
  const container = document.getElementById('intro-lines');
  const introLines = lines;
  const rendered = introLines.map(() => '');
  container.innerHTML = rendered.map((line) => `<div class="intro-line">${line}</div>`).join('');

  const lineEls = [...container.querySelectorAll('.intro-line')];
  const totalChars = introLines.reduce((sum, line) => sum + line.length, 0);
  const charInterval = 2000 / totalChars;
  let lineIndex = 0;
  let charIndex = 0;

  const typeNext = () => {
    if (lineIndex >= introLines.length) {
      window.setTimeout(() => screen.classList.add('is-fading'), 1000);
      window.setTimeout(() => {
        screen.classList.add('is-hidden');
        document.getElementById('app-shell').classList.add('is-ready');
        document.getElementById('right-nav-line').classList.add('is-drawn');
        document.querySelectorAll('.nav-link').forEach((link) => link.classList.add('is-visible'));
        syncNavInset();
      }, 1600);
      return;
    }

    const current = introLines[lineIndex];
    if (charIndex < current.length) {
      lineEls[lineIndex].textContent = current.slice(0, charIndex + 1);
      charIndex += 1;
      window.setTimeout(typeNext, charInterval);
      return;
    }

    lineIndex += 1;
    charIndex = 0;
    if (lineIndex < introLines.length) {
      container.insertAdjacentHTML('beforeend', '<div class="intro-line"></div>');
      lineEls.push(container.lastElementChild);
    }
    window.setTimeout(typeNext, charInterval * 3);
  };

  typeNext();
}

function renderAbout(data) {
  document.title = data.meta.siteTitle;

  document.getElementById('about-name').innerHTML = `
    <span class="about-name-main">${data.hero.name}</span>
    <span class="about-name-suffix">Portfolio</span>
  `;
  document.getElementById('about-role').textContent = data.hero.title;

  const subhead = data.about.subhead || data.about.headline || [
    'Integrator.',
    'Builder.',
    'Problem solver.',
  ];
  document.getElementById('about-subhead').innerHTML = subhead.join('<br>');

  const paragraphs = data.about.paragraphs || (data.about.text ? [data.about.text] : []);
  document.getElementById('about-text').innerHTML = paragraphs
    .map((paragraph) => `<p class="section-lead">${paragraph}</p>`)
    .join('');
}

function renderAiEra(data) {
  const aiEra = data.aiEra;
  if (!aiEra) return;

  document.getElementById('ai-era-index').textContent = aiEra.indexLabel;
  document.getElementById('ai-era-title').textContent = aiEra.title;
  document.getElementById('ai-era-kicker').textContent = aiEra.kicker;
  document.getElementById('ai-era-body').innerHTML = aiEra.paragraphs
    .map((paragraph) => `<p class="section-lead">${paragraph}</p>`)
    .join('');
}

function renderKnowMore(data) {
  const longForm = data.about.longForm;
  if (!longForm) return;

  document.getElementById('know-more-label').textContent = longForm.title || 'About';

  const sections = longForm.sections
    || (longForm.paragraphs || []).map((paragraph) => ({ title: '', text: paragraph }));

  document.getElementById('know-more-content').innerHTML = sections
    .map(
      (section) => `
      <div class="know-more-block">
        ${section.title ? `<h3 class="know-more-block-title">${section.title}</h3>` : ''}
        <p class="know-more-block-text">${section.text}</p>
      </div>`
    )
    .join('');
}

function renderSkills(data) {
  document.getElementById('skills-grid').innerHTML = data.skills
    .map(
      (group) => `
      <div class="skill-group">
        <p class="skill-group-label">${group.category}</p>
        ${group.items
          .map(
            (item) => `
            <div class="skill-row">
              <span>${item}</span>
              <span class="skill-dot"></span>
            </div>`
          )
          .join('')}
      </div>`
    )
    .join('');
}

function renderExperience(data) {
  document.getElementById('experience-list').innerHTML = data.experience
    .map(
      (exp) => `
      <article class="experience-item">
        <div class="experience-meta">
          <div>
            <h3 class="experience-role">${exp.role}</h3>
            <p class="experience-company">${exp.company}</p>
          </div>
          <p class="experience-period">${exp.period}</p>
        </div>
        <p class="experience-summary">${exp.summary}</p>
        <ul class="experience-bullets">
          ${exp.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
        </ul>
      </article>`
    )
    .join('');
}

function renderProjects(data) {
  document.getElementById('projects-list').innerHTML = data.projects
    .map((project, index) => {
      const title = project.links.live
        ? `<a href="${project.links.live}" target="_blank" rel="noopener">${project.title}</a>`
        : project.title;

      return `
      <article class="project-item">
        <p class="project-index">${String(index + 1).padStart(2, '0')}</p>
        <div class="project-body">
          <h3 class="project-title">${title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tags">
            ${project.technologies
              .slice(0, 5)
              .map((tech) => `<span class="project-tag">${tech}</span>`)
              .join('')}
          </div>
        </div>
      </article>`;
    })
    .join('');
}

function renderContact(data) {
  const { contact } = data;
  const rows = [
    { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    {
      label: 'GitHub',
      value: contact.github.replace('https://', ''),
      href: contact.github,
    },
    { label: 'Location', value: contact.location },
  ];

  document.getElementById('contact-list').innerHTML = rows
    .map(
      ({ label, value, href }) => `
      <div class="contact-row">
        <span class="contact-label">${label}</span>
        ${
          href
            ? `<a href="${href}" target="_blank" rel="noopener">${value}</a>`
            : `<span>${value}</span>`
        }
      </div>`
    )
    .join('');
}

function renderNavLinks(sectionPreviews) {
  const linkMarkup = SECTION_CONFIG.map(
    (section, index) => `
    <button
      type="button"
      class="nav-link"
      data-section="${section.label}"
      data-target="${section.id}"
      data-preview="${sectionPreviews[section.label].join('|')}"
      style="--delay:${1 + index * 0.13}s"
    >
      ${section.label}
    </button>`
  ).join('');

  document.getElementById('right-nav-links').innerHTML = linkMarkup;
}

function setLeftPanel(section, previewItems) {
  const defaultPanel = document.getElementById('left-panel-default');
  const hoverPanel = document.getElementById('left-panel-hover');
  const sectionLabel = document.getElementById('left-panel-section');
  const bullets = document.getElementById('left-panel-bullets');

  if (!section) {
    defaultPanel.classList.remove('hidden');
    hoverPanel.classList.add('hidden');
    return;
  }

  defaultPanel.classList.add('hidden');
  hoverPanel.classList.remove('hidden');
  sectionLabel.textContent = section;
  bullets.innerHTML = previewItems
    .map(
      (item, index) => `
      <li style="--delay:${index * 0.055}s">
        <span>—</span>${item}
      </li>`
    )
    .join('');
}

function scrollToSection(sectionLabel) {
  const section = SECTION_CONFIG.find((item) => item.label === sectionLabel);
  const target = document.getElementById(section?.id || sectionLabel.toLowerCase());
  const container = document.getElementById('content-scroll');
  if (!target || !container) return;

  closeKnowMore();
  container.scrollTo({
    top: target.offsetTop - 80,
    behavior: 'smooth',
  });
  if (!isDesktopViewport()) closeNav();
}

function openKnowMore() {
  const panel = document.getElementById('know-more-panel');
  knowMoreOpen = true;
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  panel.removeAttribute('inert');
  document.body.classList.add('know-more-open');
  document.getElementById('know-more-btn').setAttribute('aria-expanded', 'true');
}

function closeKnowMore() {
  if (!knowMoreOpen) return;
  const panel = document.getElementById('know-more-panel');
  knowMoreOpen = false;
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('inert', '');
  document.body.classList.remove('know-more-open');
  document.getElementById('know-more-btn').setAttribute('aria-expanded', 'false');
}

function updateActiveSection() {
  const container = document.getElementById('content-scroll');
  const scrollTop = container.scrollTop;
  const atTop = scrollTop < 50;

  if (!atTop && navOpen && !isDesktopViewport()) closeNav();

  let current = 'About';
  for (const section of SECTION_CONFIG) {
    const element = document.getElementById(section.id);
    if (element && element.offsetTop <= scrollTop + 240) current = section.label;
  }

  activeSection = current;
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.section === current);
  });
}

function syncNavInset() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const { width } = sidebar.getBoundingClientRect();
  document.documentElement.style.setProperty('--nav-line-right', `${Math.ceil(width)}px`);
}

function applyNavState() {
  const sidebar = document.getElementById('sidebar');
  const rightNav = document.getElementById('right-nav');
  if (!sidebar || !rightNav) return;

  sidebar.classList.toggle('is-collapsed', !navOpen);
  rightNav.setAttribute('aria-hidden', String(!navOpen));
  document.getElementById('rail-toggle').setAttribute('aria-expanded', String(navOpen));
  document.querySelector('.rail-icon-open').classList.toggle('hidden', navOpen);
  document.querySelector('.rail-icon-close').classList.toggle('hidden', !navOpen);
  syncNavInset();
}

function initNavState() {
  navOpen = isDesktopViewport();
  applyNavState();
}

function openNav() {
  navOpen = true;
  applyNavState();
}

function closeNav() {
  if (!navOpen) return;
  navOpen = false;
  applyNavState();
}

function toggleNav() {
  navOpen = !navOpen;
  applyNavState();
}

function setupNavInset() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  syncNavInset();

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(syncNavInset);
    observer.observe(sidebar);
  } else {
    window.addEventListener('resize', syncNavInset);
  }

  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    navOpen = event.matches;
    applyNavState();
  });
}

function setupInteractions(sectionPreviews) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const section = link.dataset.section;
    const previewItems = link.dataset.preview.split('|');

    link.addEventListener('mouseenter', () => setLeftPanel(section, previewItems));
    link.addEventListener('mouseleave', () => setLeftPanel(null));
    link.addEventListener('click', () => scrollToSection(section));
  });

  document.getElementById('rail-toggle').addEventListener('click', toggleNav);

  document.getElementById('know-more-btn').addEventListener('click', openKnowMore);
  document.getElementById('know-more-close').addEventListener('click', closeKnowMore);
  document.getElementById('know-more-panel').addEventListener('click', (event) => {
    if (event.target.id === 'know-more-panel') closeKnowMore();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeKnowMore();
      if (!isDesktopViewport()) closeNav();
    }
  });

  const container = document.getElementById('content-scroll');
  container.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();
}

async function init() {
  try {
    portfolioData = await loadPortfolio();
    const sectionPreviews = buildSectionPreviews(portfolioData);

    renderAbout(portfolioData);
    renderAiEra(portfolioData);
    renderKnowMore(portfolioData);
    renderSkills(portfolioData);
    renderExperience(portfolioData);
    renderProjects(portfolioData);
    renderContact(portfolioData);
    renderNavLinks(sectionPreviews);
    initNavState();
    setupNavInset();
    setupInteractions(sectionPreviews);
    renderIntro(portfolioData.intro?.lines || [
      '> initializing...',
      '> loading portfolio...',
      '> welcome.',
    ]);
  } catch (error) {
    console.error(error);
    document.body.innerHTML =
      '<div class="load-error">Failed to load portfolio. Please check data/portfolio.json.</div>';
  }
}

init();
