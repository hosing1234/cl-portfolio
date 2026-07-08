const SECTION_CONFIG = [
  { label: 'About', id: 'about' },
  { label: 'AI Era', id: 'ai-era' },
  { label: 'Work', id: 'work' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

const CASE_STUDY_SECTIONS = [
  {
    key: 'context',
    label: '01 / Context',
    title: 'What this was',
    placeholder: 'Add: what the system was, who used it, scale, and public/private constraints.',
  },
  {
    key: 'problem',
    label: '02 / Problem',
    title: 'What made it difficult',
    placeholder: 'Add: unclear requirements, data complexity, timeline pressure, legacy constraints, or operational risk.',
  },
  {
    key: 'role',
    label: '03 / My Role',
    title: 'What I owned',
    placeholder: 'Add: your concrete responsibilities, boundaries with PM/design/other developers, and ownership level.',
  },
  {
    key: 'solution',
    label: '04 / Solution',
    title: 'How I approached it',
    placeholder: 'Add: how you broke down the work, designed the flow, handled integration, and shipped safely.',
  },
  {
    key: 'impact',
    label: '05 / Impact',
    title: 'What changed',
    placeholder: 'Add: measurable result, client/team feedback, risk reduced, speed improved, or production outcome.',
  },
];

function parseTimelineSortYear(period = '') {
  const years = (period.match(/\d{4}/g) || []).map(Number);
  if (!years.length) return 0;
  if (/present/i.test(period)) return years[0];
  return Math.max(...years);
}

function formatTimelinePeriod(period = '') {
  return period.replace(/\s*[—–]\s*present/gi, '').trim();
}

function parseTimelineDisplayYear(period = '') {
  const match = formatTimelinePeriod(period).match(/\d{4}/);
  return match ? match[0] : formatTimelinePeriod(period);
}

function formatWorkPreviewLabel(item) {
  return `${parseTimelineDisplayYear(item.period)} — ${item.title}`;
}

function getEmploymentTimelineItems(employmentId, data) {
  return data.projects
    .filter((project) => project.company === employmentId)
    .sort((a, b) => {
      const yearDiff = parseTimelineSortYear(b.period) - parseTimelineSortYear(a.period);
      return yearDiff !== 0 ? yearDiff : a.title.localeCompare(b.title);
    });
}

function getWorkPanelOrder(data) {
  return data.experience.flatMap((employment) =>
    getEmploymentTimelineItems(employment.id, data).map((project) => project.id)
  );
}

let portfolioData = null;
let activeSection = 'About';
let knowMoreOpen = false;
let workPanelOpen = false;
let activeWorkProjectId = null;
let navOpen = false;

function getInitialThemeState() {
  const stored = window.localStorage?.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return { theme: stored, forced: true };
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return { theme: prefersDark ? 'dark' : 'light', forced: false };
}

function applyTheme(theme, forced = false) {
  if (forced) {
    document.body.dataset.theme = theme;
  } else {
    delete document.body.dataset.theme;
  }

  const button = document.getElementById('theme-toggle');
  if (button) {
    const isDark = theme === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
    button.textContent = isDark ? 'Light' : 'Dark';
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0f0f10' : '#f8f8f8');
  }
}

function setupThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const initial = getInitialThemeState();
  applyTheme(initial.theme, initial.forced);

  button.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    window.localStorage?.setItem('theme', nextTheme);
    applyTheme(nextTheme, true);
  });

  // Auto mode: keep label in sync with OS changes.
  if (!initial.forced) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    if (mql.addEventListener) {
      mql.addEventListener('change', (e) => applyTheme(e.matches ? 'dark' : 'light', false));
    } else {
      mql.addListener?.((e) => applyTheme(e.matches ? 'dark' : 'light', false));
    }
  }
}

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
      data.aiEra?.kicker || 'On work, tools, and what remains human',
    ],
    Skills: topSkills,
    Work: [...data.projects]
      .filter((project) => project.id !== 'ai-adoption')
      .sort((a, b) => parseTimelineSortYear(b.period) - parseTimelineSortYear(a.period))
      .map(formatWorkPreviewLabel),
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
  const appShell = document.getElementById('app-shell');
  const introLines = lines;
  const rendered = introLines.map(() => '');
  container.innerHTML = rendered
    .map((line) => `<div class="intro-line">${line}</div>`)
    .join('');

  const lineEls = [...container.querySelectorAll('.intro-line')];
  const totalChars = introLines.reduce((sum, line) => sum + line.length, 0);
  const charInterval = totalChars ? 2000 / totalChars : 30;
  let lineIndex = 0;
  let charIndex = 0;

  // Show caret on the currently typing line (instead of relying on :last-child).
  if (lineEls[0]) lineEls[0].classList.add('has-caret');

  const typeNext = () => {
    if (lineIndex >= introLines.length) {
      window.setTimeout(() => screen.classList.add('is-fading'), 1000);
      window.setTimeout(() => {
        screen.classList.add('is-hidden');
        document.getElementById('app-shell').classList.add('is-ready');
        appShell?.removeAttribute('inert');
        document.getElementById('right-nav-line').classList.add('is-drawn');
        document.querySelectorAll('.nav-link').forEach((link) => link.classList.add('is-visible'));
        syncNavInset();
      }, 1600);
      return;
    }

    // Keep caret anchored to the line we're about to type.
    lineEls.forEach((el) => el.classList.remove('has-caret'));
    lineEls[lineIndex]?.classList.add('has-caret');

    const current = introLines[lineIndex];
    if (charIndex < current.length) {
      lineEls[lineIndex].textContent = current.slice(0, charIndex + 1);
      charIndex += 1;
      window.setTimeout(typeNext, charInterval);
      return;
    }

    // Line finished: move caret to next line.
    lineIndex += 1;
    charIndex = 0;
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

  const paragraphs = aiEra.paragraphs || [];
  const statementMarkup = aiEra.statement
    ? `<p class="ai-era-statement">${aiEra.statement}</p>`
    : paragraphs.map((paragraph) => `<p class="section-lead">${paragraph}</p>`).join('');
  const principlesMarkup = (aiEra.principles || []).length
    ? `
      <div class="ai-era-principles">
        ${aiEra.principles.map((principle) => `
          <article class="ai-era-principle">
            <p class="ai-era-principle-label">${principle.label}</p>
            <h3 class="ai-era-principle-title">${principle.title}</h3>
            <p class="ai-era-principle-text">${principle.text}</p>
          </article>
        `).join('')}
      </div>
    `
    : '';
  const flowMarkup = (aiEra.flow || []).length
    ? `
      <ol class="ai-era-flow" aria-label="AI Era working flow">
        ${aiEra.flow.map((step) => `<li>${step}</li>`).join('')}
      </ol>
    `
    : '';

  document.getElementById('ai-era-body').innerHTML = [statementMarkup, principlesMarkup, flowMarkup]
    .filter(Boolean)
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
        <div class="skill-rows">
          ${group.items
            .map(
              (item) => `
            <div class="skill-row">
              <span>${item}</span>
              <span class="skill-dot"></span>
            </div>`
            )
            .join('')}
        </div>
        <div class="skill-tags">
          ${group.items.map((item) => `<span class="skill-tag">${item}</span>`).join('')}
        </div>
      </div>`
    )
    .join('');
}

function renderTimeline(data) {
  const html = data.experience
    .map((employment) => {
      const items = getEmploymentTimelineItems(employment.id, data);

      const eventsHtml = items
        .map(
          (project) => `
        <div class="timeline-event${project.kind === 'initiative' ? ' timeline-event--initiative' : ''}">
          <button
            type="button"
            class="timeline-event-btn"
            data-project-id="${project.id}"
            aria-expanded="false"
          >
            <p class="timeline-event-period">${formatTimelinePeriod(project.period)}</p>
            <h4 class="timeline-event-title">${project.title}</h4>
            <p class="timeline-event-subtitle">${project.subtitle}</p>
            <p class="timeline-event-summary">${project.summary}</p>
            <span class="timeline-event-cta">View details</span>
          </button>
        </div>`
        )
        .join('');

      return `
      <article class="timeline-employment">
        <p class="timeline-employment-period">${formatTimelinePeriod(employment.period)}</p>
        <h3 class="timeline-employment-role">${employment.role}</h3>
        <p class="timeline-employment-company">${employment.company}</p>
        <p class="timeline-employment-summary section-lead">${employment.summary}</p>
        <p class="timeline-other-work">${employment.otherWork}</p>
        ${eventsHtml}
      </article>`;
    })
    .join('');

  document.getElementById('timeline').innerHTML = html;
}

function getProjectById(projectId) {
  return portfolioData?.projects.find((project) => project.id === projectId);
}

function hasCaseStudyContent(caseStudy = {}) {
  const hasText = CASE_STUDY_SECTIONS.some((section) => (caseStudy[section.key] || '').trim());

  const visual = caseStudy.visual || {};
  const hasVisual = Boolean(
    (visual.src && visual.type === 'image')
    || (visual.type === 'imagePair' && (visual.images || []).length)
    || (visual.caption && visual.type === 'diagram')
    || (visual.type === 'flow' && (visual.steps || []).length)
    || (visual.type === 'phaseFlow' && (visual.phases || []).length),
  );

  return hasText || hasVisual;
}

function shouldRenderCaseStudy(project) {
  const caseStudy = project.caseStudy || {};
  if (caseStudy.collapsed) return false;
  return hasCaseStudyContent(caseStudy);
}

function renderCaseStudySections(project) {
  const caseStudy = project.caseStudy || {};

  return CASE_STUDY_SECTIONS.map((section) => {
    const text = (caseStudy[section.key] || '').trim();
    const isPlaceholder = !text;

    return `
      <article class="work-case-section${isPlaceholder ? ' is-placeholder' : ''}">
        <p class="work-case-label">${section.label}</p>
        <h4 class="work-case-title">${section.title}</h4>
        <p class="work-case-text">${text || section.placeholder}</p>
      </article>
    `;
  }).join('');
}

function renderCaseStudyVisual(project) {
  const visual = project.caseStudy?.visual || {};
  const hasImage = visual.src && visual.type === 'image';
  const hasImagePair = visual.type === 'imagePair' && (visual.images || []).length;
  const hasDiagram = visual.caption && visual.type === 'diagram';
  const hasFlow = visual.type === 'flow' && (visual.steps || []).length;
  const hasPhaseFlow = visual.type === 'phaseFlow' && (visual.phases || []).length;

  if (hasImage) {
    return `
      <figure class="work-case-visual">
        <img src="${visual.src}" alt="${visual.caption || `${project.title} project visual`}">
        ${visual.caption ? `<figcaption>${visual.caption}</figcaption>` : ''}
      </figure>
    `;
  }

  if (hasImagePair) {
    const pairLayoutClass = visual.layout === 'equal' ? ' work-case-image-pair--equal' : '';
    return `
      <figure class="work-case-visual work-case-image-pair${pairLayoutClass}">
        ${visual.caption ? `<figcaption>${visual.caption}</figcaption>` : ''}
        <div class="work-case-image-pair-grid">
          ${visual.images.map((image) => `
            <div class="work-case-image-card">
              <p>${image.label}</p>
              <img src="${image.src}" alt="${image.alt || image.label}">
            </div>
          `).join('')}
        </div>
      </figure>
    `;
  }

  if (hasFlow) {
    return `
      <figure class="work-case-visual work-case-flow">
        ${visual.caption ? `<figcaption>${visual.caption}</figcaption>` : ''}
        <ol class="work-case-flow-list">
          ${visual.steps.map((step) => `
            <li class="work-case-flow-step">
              <span class="work-case-flow-index">${step.label}</span>
              <span class="work-case-flow-content">
                <strong>${step.title}</strong>
                <span>${step.text}</span>
              </span>
            </li>
          `).join('')}
        </ol>
      </figure>
    `;
  }

  if (hasPhaseFlow) {
    return `
      <figure class="work-case-visual work-case-phase-flow">
        ${visual.caption ? `<figcaption>${visual.caption}</figcaption>` : ''}
        ${visual.intro ? `<p class="work-case-phase-intro">${visual.intro}</p>` : ''}
        <div class="work-case-phase-flow-list">
          ${visual.phases.map((phase) => `
            ${phase.prologue ? `<p class="work-case-phase-prologue">${phase.prologue}</p>` : ''}
            <section class="work-case-phase">
              <div class="work-case-phase-heading">
                <p>${phase.label}</p>
                <h4>${phase.title}</h4>
                ${phase.description ? `<span>${phase.description}</span>` : ''}
              </div>
              <ol class="work-case-phase-steps">
                ${(phase.steps || []).map((step) => `
                  <li class="work-case-phase-step">
                    <strong>${step.label}</strong>
                    <span>${step.text}</span>
                  </li>
                `).join('')}
              </ol>
            </section>
          `).join('')}
        </div>
      </figure>
    `;
  }

  return `
    <figure class="work-case-visual${hasDiagram ? '' : ' is-placeholder'}">
      <div class="work-case-visual-frame">
        <span>${hasDiagram ? visual.caption : 'Visual placeholder'}</span>
      </div>
      <figcaption>
        ${hasDiagram ? 'Convert this into a simple diagram later.' : 'Optional: add one sanitized screenshot, simple flow diagram, or metric block.'}
      </figcaption>
    </figure>
  `;
}

function renderWorkPanel(project, slideDirection = 0) {
  const liveLink = project.links?.live
    ? `<a href="${project.links.live}" target="_blank" rel="noopener" class="work-panel-link">Visit site</a>`
    : '';

  const content = document.getElementById('work-panel-content');
  content.classList.remove('is-enter-left', 'is-enter-right', 'is-enter-active');

  document.getElementById('work-panel-label').textContent = 'Work';
  const caseStudyHtml = shouldRenderCaseStudy(project)
    ? `
    ${renderCaseStudyVisual(project)}
    <div class="work-case-grid">
      ${renderCaseStudySections(project)}
    </div>
  `
    : '';

  content.innerHTML = `
    <p class="work-panel-period">${formatTimelinePeriod(project.period)}</p>
    <h3 class="work-panel-title">${project.title}</h3>
    <p class="work-panel-subtitle">${project.subtitle}</p>
    <p class="work-panel-description">${project.description}</p>
    ${caseStudyHtml}
    ${project.highlights?.length
      ? `
        <section class="work-proof">
          <p class="work-proof-label">Proof points</p>
          <ul class="work-panel-highlights">
            ${project.highlights.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </section>
      `
      : ''}
    <div class="work-panel-tags">
      ${(project.technologies || []).map((tech) => `<span class="project-tag">${tech}</span>`).join('')}
    </div>
    ${liveLink}
  `;

  if (slideDirection) {
    content.classList.add(slideDirection > 0 ? 'is-enter-right' : 'is-enter-left');
    requestAnimationFrame(() => {
      content.classList.add('is-enter-active');
    });
  }
}

function updateWorkPanelNav() {
  const order = getWorkPanelOrder(portfolioData);
  const hasMultiple = order.length > 1;
  const prevButton = document.getElementById('work-panel-prev');
  const nextButton = document.getElementById('work-panel-next');

  prevButton.disabled = !hasMultiple;
  nextButton.disabled = !hasMultiple;
}

function setActiveWorkTimelineButton(projectId) {
  document.querySelectorAll('.timeline-event-btn').forEach((button) => {
    button.setAttribute('aria-expanded', button.dataset.projectId === projectId ? 'true' : 'false');
  });
}

function openWorkPanel(projectId, slideDirection = 0) {
  const project = getProjectById(projectId);
  if (!project) return;

  closeKnowMore();
  activeWorkProjectId = projectId;
  renderWorkPanel(project, slideDirection);
  updateWorkPanelNav();

  const panel = document.getElementById('work-panel');
  workPanelOpen = true;
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  panel.removeAttribute('inert');
  document.body.classList.add('work-panel-open');

  setActiveWorkTimelineButton(projectId);
}

function navigateWorkPanel(delta) {
  if (!portfolioData || !activeWorkProjectId) return;

  const order = getWorkPanelOrder(portfolioData);
  if (order.length < 2) return;

  const index = order.indexOf(activeWorkProjectId);
  const nextIndex = (index + delta + order.length) % order.length;

  openWorkPanel(order[nextIndex], delta);
}

function closeWorkPanel() {
  if (!workPanelOpen) return;

  const panel = document.getElementById('work-panel');
  workPanelOpen = false;
  activeWorkProjectId = null;
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('inert', '');
  document.body.classList.remove('work-panel-open');

  document.getElementById('work-panel-prev').disabled = true;
  document.getElementById('work-panel-next').disabled = true;
  setActiveWorkTimelineButton(null);
}

function setupWorkPanelSwipe() {
  const panelInner = document.getElementById('work-panel-inner');
  let touchStartX = 0;
  let touchStartY = 0;

  panelInner.addEventListener(
    'touchstart',
    (event) => {
      if (!workPanelOpen) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  panelInner.addEventListener(
    'touchend',
    (event) => {
      if (!workPanelOpen) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;

      if (deltaX < 0) navigateWorkPanel(1);
      else navigateWorkPanel(-1);
    },
    { passive: true }
  );
}

function closeAllPanels() {
  closeKnowMore();
  closeWorkPanel();
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

function revealContentSection(sectionEl, { delay = 0 } = {}) {
  if (!sectionEl || sectionEl.classList.contains('is-in-view')) return;

  const apply = () => sectionEl.classList.add('is-in-view');
  if (delay > 0) window.setTimeout(apply, delay);
  else apply();
}

function scrollToSection(sectionLabel) {
  const section = SECTION_CONFIG.find((item) => item.label === sectionLabel);
  const target = document.getElementById(section?.id || sectionLabel.toLowerCase());
  const container = document.getElementById('content-scroll');
  if (!target || !container) return;

  closeAllPanels();
  container.scrollTo({
    top: target.offsetTop - 80,
    behavior: 'smooth',
  });
  if (!isDesktopViewport()) closeNav();

  revealContentSection(target, { delay: 500 });
}

function openKnowMore() {
  closeWorkPanel();
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
  // Desktop: show section navigation by default.
  // Mobile: hide by default to match expected UX.
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

}

function setupSectionReveal() {
  const container = document.getElementById('content-scroll');
  const sections = document.querySelectorAll('.content-section:not(:first-child)');

  if (!container || !sections.length) return;

  const reveal = (section) => section.classList.add('is-in-view');

  if (!window.IntersectionObserver) {
    sections.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target.closest('.content-section');

        if (section) reveal(section);
        observer.unobserve(entry.target);
      });
    },
    {
      root: container,
      threshold: 0,
      rootMargin: '-22% 0px -38% 0px',
    }
  );

  sections.forEach((section) => {
    const trigger = section.querySelector('.section-index') || section;
    observer.observe(trigger);
  });
}

function setupSectionFocusReveal() {
  const container = document.getElementById('content-scroll');
  if (!container) return;

  container.addEventListener('focusin', (event) => {
    const section = event.target.closest('.content-section:not(:first-child)');
    if (!section) return;

    revealContentSection(section);
  });
}

function setupInteractions(sectionPreviews) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const section = link.dataset.section;
    const previewItems = link.dataset.preview.split('|');

    link.addEventListener('mouseenter', () => setLeftPanel(section, previewItems));
    link.addEventListener('mouseleave', () => setLeftPanel(null));
    link.addEventListener('click', () => scrollToSection(section));
    link.addEventListener('focus', () => scrollToSection(section));
  });

  document.getElementById('rail-toggle').addEventListener('click', (event) => {
    event.stopPropagation();
    toggleNav();
  });

  document.getElementById('know-more-btn').addEventListener('click', openKnowMore);
  document.getElementById('know-more-close').addEventListener('click', closeKnowMore);
  document.getElementById('know-more-panel').addEventListener('click', (event) => {
    if (event.target.id === 'know-more-panel') closeKnowMore();
  });

  document.getElementById('work-panel-close').addEventListener('click', closeWorkPanel);
  document.getElementById('work-panel-prev').addEventListener('click', () => navigateWorkPanel(-1));
  document.getElementById('work-panel-next').addEventListener('click', () => navigateWorkPanel(1));
  document.getElementById('work-panel').addEventListener('click', (event) => {
    if (event.target.id === 'work-panel') closeWorkPanel();
  });

  setupWorkPanelSwipe();

  document.getElementById('timeline').addEventListener('click', (event) => {
    const button = event.target.closest('.timeline-event-btn');
    if (!button) return;
    openWorkPanel(button.dataset.projectId);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllPanels();
      if (!isDesktopViewport()) closeNav();
      return;
    }

    if (!workPanelOpen) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateWorkPanel(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateWorkPanel(1);
    }
  });

  const container = document.getElementById('content-scroll');
  container.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();
}

async function init() {
  try {
    setupThemeToggle();
    // Prevent Tab from jumping into hidden buttons during the intro animation.
    document.getElementById('app-shell')?.setAttribute('inert', '');
    portfolioData = await loadPortfolio();
    const sectionPreviews = buildSectionPreviews(portfolioData);

    renderAbout(portfolioData);
    renderAiEra(portfolioData);
    renderKnowMore(portfolioData);
    renderSkills(portfolioData);
    renderTimeline(portfolioData);
    renderContact(portfolioData);
    renderNavLinks(sectionPreviews);
    initNavState();
    setupNavInset();
    setupSectionReveal();
    setupSectionFocusReveal();
    setupInteractions(sectionPreviews);
    renderIntro(portfolioData.intro?.lines || [
      '> initializing...',
      '> loading portfolio...',
      '> welcome.',
    ]);
  } catch (error) {
    console.error(error);
    document.getElementById('app-shell')?.removeAttribute('inert');
    document.body.innerHTML =
      '<div class="load-error">Failed to load portfolio. Please check data/portfolio.json.</div>';
  }
}

init();
