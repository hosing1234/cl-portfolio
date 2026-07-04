const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

async function loadPortfolio() {
  const response = await fetch('data/portfolio.json');
  if (!response.ok) throw new Error('Failed to load portfolio data');
  return response.json();
}

function renderNav() {
  const nav = document.getElementById('nav-links');
  nav.innerHTML = NAV_SECTIONS.map(
    (s) => `<li><a href="#${s.id}">${s.label}</a></li>`
  ).join('');
}

function renderHero(data) {
  document.title = data.meta.siteTitle;
  document.getElementById('hero-name').textContent = data.hero.name;
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-tagline').textContent = data.hero.tagline;

  const cta = document.getElementById('hero-cta');
  const { primary, secondary } = data.hero.cta;
  cta.innerHTML = `
    <a href="${primary.target}" class="btn btn-primary">${primary.label}</a>
    <a href="${secondary.target}" class="btn btn-secondary">${secondary.label}</a>
  `;
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
  document.getElementById('contact-content').innerHTML = `
    <div class="contact-item">
      <span class="contact-label">Email</span>
      <a href="mailto:${contact.email}">${contact.email}</a>
    </div>
    <div class="contact-item">
      <span class="contact-label">GitHub</span>
      <a href="${contact.github}" target="_blank" rel="noopener">${contact.github.replace('https://', '')}</a>
    </div>
    <div class="contact-item">
      <span class="contact-label">LinkedIn</span>
      <a href="${contact.linkedin}" target="_blank" rel="noopener">${contact.linkedin.replace('https://', '')}</a>
    </div>
    <div class="contact-item">
      <span class="contact-label">Location</span>
      <span>${contact.location}</span>
    </div>
  `;
}

function renderFooter(data) {
  document.getElementById('footer-text').textContent =
    `© ${new Date().getFullYear()} ${data.hero.name}. Built with HTML, CSS & JavaScript.`;
}

function setupNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

async function init() {
  try {
    const data = await loadPortfolio();
    renderNav();
    renderHero(data);
    renderAbout(data);
    renderSkills(data);
    renderExperience(data);
    renderProjects(data);
    renderEducation(data);
    renderContact(data);
    renderFooter(data);
    setupNavToggle();
  } catch (err) {
    console.error(err);
    document.body.innerHTML =
      '<div style="padding:2rem;text-align:center;color:#f85149;">Failed to load portfolio. Please check data/portfolio.json.</div>';
  }
}

init();
