const SECTIONS = [
  {
    id: 'about',
    label: 'About',
    preview: '5+ years building production systems with Laravel, Vue, JavaScript, and a strong full-stack integration mindset.',
  },
  {
    id: 'skills',
    label: 'Skills',
    preview: 'PHP, Laravel, Vue, JavaScript, MySQL, REST APIs, operation scripts, and AI-assisted engineering workflows.',
  },
  {
    id: 'experience',
    label: 'Experience',
    preview: 'FirmStudio and ECHK experience across client systems, internal platforms, e-commerce, booking, and production operations.',
  },
  {
    id: 'projects',
    label: 'Projects',
    preview: 'KNSM, DrugInSport, HKAB, HIPPOS, and DentalMiles — selected work with real production constraints.',
  },
  {
    id: 'contact',
    label: 'Contact',
    preview: 'Available in Hong Kong. Open to full-stack roles focused on maintainable systems and thoughtful AI-assisted engineering.',
  },
];

async function loadPortfolio() {
  const response = await fetch('data/portfolio.json');
  if (!response.ok) throw new Error('Failed to load portfolio data');
  return response.json();
}

function renderHero(data) {
  document.title = data.meta.siteTitle;
  document.getElementById('hero-name').textContent = data.hero.name;
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-tagline').textContent = data.hero.tagline;
  document.getElementById('hero-preview').textContent = data.hero.tagline;

  const cta = document.getElementById('hero-cta');
  const { primary, secondary } = data.hero.cta;
  cta.innerHTML = `
    <a href="${primary.target}" class="btn btn-primary">${primary.label}</a>
    <a href="${secondary.target}" class="btn btn-secondary">${secondary.label}</a>
  `;

  renderSectionMenus();
}

function renderSectionMenus() {
  const heroMenu = document.getElementById('hero-menu');
  const railPanel = document.getElementById('rail-panel');
  const menuMarkup = SECTIONS.map(
    (section, index) => `
      <a
        href="#${section.id}"
        class="section-link"
        data-section="${section.id}"
        data-preview="${section.preview}"
        style="--i:${index}"
      >
        <span>${String(index + 1).padStart(2, '0')}</span>
        ${section.label}
      </a>`
  ).join('');

  heroMenu.innerHTML = menuMarkup;
  railPanel.innerHTML = menuMarkup;
}

function renderAbout(data) {
  document.getElementById('about-text').textContent = data.about.text;
  document.getElementById('about-highlights').innerHTML = data.about.highlights
    .map((h) => `<li>${h}</li>`)
    .join('');
}

function renderSkills(data) {
  document.getElementById('skills-grid').innerHTML = data.skills
    .map(
      (cat) => `
      <div class="skill-card">
        <h3>${cat.category}</h3>
        <div class="skill-tags">
          ${cat.items.map((s) => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>`
    )
    .join('');
}

function renderExperience(data) {
  document.getElementById('experience-list').innerHTML = data.experience
    .map(
      (exp) => `
      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-role">${exp.role}</span>
          <span class="exp-company">@ ${exp.company}</span>
          <span class="exp-period">${exp.period}</span>
        </div>
        <p class="exp-summary">${exp.summary}</p>
        <ul class="exp-bullets">
          ${exp.bullets.map((b) => `<li>${b}</li>`).join('')}
        </ul>
        <div class="skill-tags">
          ${exp.technologies.map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>`
    )
    .join('');
}

function renderProjects(data) {
  document.getElementById('projects-grid').innerHTML = data.projects
    .map((proj) => {
      const links = [];
      if (proj.links.github) links.push(`<a href="${proj.links.github}" target="_blank" rel="noopener">GitHub</a>`);
      if (proj.links.live) links.push(`<a href="${proj.links.live}" target="_blank" rel="noopener">Live Demo</a>`);

      return `
      <div class="project-card">
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <div class="skill-tags">
          ${proj.technologies.map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
        ${links.length ? `<div class="project-links">${links.join('')}</div>` : ''}
      </div>`;
    })
    .join('');
}

function renderEducation(data) {
  document.getElementById('education-list').innerHTML = data.education
    .map(
      (edu) => `
      <div class="edu-item">
        <div>
          <div class="edu-degree">${edu.degree}</div>
          <div class="edu-institution">${edu.institution}</div>
        </div>
        <span class="edu-period">${edu.period}</span>
      </div>`
    )
    .join('');
}

function renderContact(data) {
  const { contact } = data;
  const items = [
    `<div class="contact-item">
      <span class="contact-label">Email</span>
      <a href="mailto:${contact.email}">${contact.email}</a>
    </div>`,
    `<div class="contact-item">
      <span class="contact-label">GitHub</span>
      <a href="${contact.github}" target="_blank" rel="noopener">${contact.github.replace('https://', '')}</a>
    </div>`,
  ];
  if (contact.linkedin) {
    items.push(`<div class="contact-item">
      <span class="contact-label">LinkedIn</span>
      <a href="${contact.linkedin}" target="_blank" rel="noopener">${contact.linkedin.replace('https://', '')}</a>
    </div>`);
  }
  items.push(`<div class="contact-item">
      <span class="contact-label">Location</span>
      <span>${contact.location}</span>
    </div>`);
  document.getElementById('contact-content').innerHTML = items.join('');
}

function renderFooter(data) {
  document.getElementById('footer-text').textContent =
    `© ${new Date().getFullYear()} ${data.hero.name}. Built with HTML, CSS & JavaScript.`;
}

function setupIntro() {
  const intro = document.getElementById('intro-screen');
  const type = document.getElementById('intro-type');
  const message = 'Welcome, review my portfolio.';
  let index = 0;
  const typingDuration = 2000;
  const step = typingDuration / message.length;

  const timer = window.setInterval(() => {
    type.textContent = message.slice(0, index + 1);
    index += 1;

    if (index >= message.length) {
      window.clearInterval(timer);
      window.setTimeout(() => intro.classList.add('is-hidden'), 1000);
    }
  }, step);

  window.setTimeout(() => {
    intro.classList.add('is-done');
  }, typingDuration + 1600);
}

function setupPortfolioInteractions() {
  const preview = document.getElementById('hero-preview');
  const railMenu = document.getElementById('rail-menu');
  const railToggle = document.getElementById('rail-toggle');
  const hero = document.getElementById('hero');

  document.querySelectorAll('.section-link').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      preview.textContent = link.dataset.preview;
      preview.classList.remove('is-changing');
      void preview.offsetWidth;
      preview.classList.add('is-changing');
    });

    link.addEventListener('click', () => {
      railMenu.classList.remove('is-open');
      railToggle.setAttribute('aria-expanded', 'false');
    });
  });

  railToggle.addEventListener('click', () => {
    const isOpen = railMenu.classList.toggle('is-open');
    railToggle.setAttribute('aria-expanded', String(isOpen));
  });

  const updateRail = () => {
    const pastHero = window.scrollY > hero.offsetHeight * 0.55;
    railMenu.classList.toggle('is-visible', pastHero);

    if (pastHero) {
      railMenu.classList.remove('is-open');
      railToggle.setAttribute('aria-expanded', 'false');
    } else {
      railMenu.classList.add('is-open');
      railToggle.setAttribute('aria-expanded', 'true');
    }
  };

  updateRail();
  window.addEventListener('scroll', updateRail, { passive: true });
}

async function init() {
  try {
    const data = await loadPortfolio();
    renderHero(data);
    renderAbout(data);
    renderSkills(data);
    renderExperience(data);
    renderProjects(data);
    renderEducation(data);
    renderContact(data);
    renderFooter(data);
    setupIntro();
    setupPortfolioInteractions();
  } catch (err) {
    console.error(err);
    document.body.innerHTML =
      '<div style="padding:2rem;text-align:center;color:#f85149;">Failed to load portfolio. Please check data/portfolio.json.</div>';
  }
}

init();
