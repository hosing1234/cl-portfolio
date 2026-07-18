# Portfolio 精選稿 — Public Draft

> **用途：** 從 `profile.md` 精選、改寫成對外展示版本，對應網站各 section。  
> **原則：** 精簡、量化、對準 IT 軟件公司招聘方；一頁能看完的重點。  
> **最後更新：** 2026-07-05  
**狀態：** 已對齊 profile，已同步至 `data/portfolio.json`

---

## Hero

| 欄位 | 內容 |
|------|------|
| Name | Lee Ho Sing Cyrus |
| Title | Full Stack Developer |
| Tagline | Full-stack developer who excels where frontend and backend must work as one — integration, business logic, and delivery under pressure. |

**CTA：**
- Primary: View Projects → `#projects`
- Secondary: Contact Me → `#contact`

---

## About

**正文（約 80–120 字）：**

> Full-stack developer with 6 years of experience building production systems in Laravel, Vue, and JavaScript. Core strengths include **FE/BE integration and delivery under pressure**.
>
> Selected work includes KNSM, a Po Leung Kuk kindergarten platform used by 20+ schools; DrugInSport's 10k+ drug-data import workflows; and HKAB's 16-server operations revamp, cutting key procedures from 20+ minutes to 5–10 minutes.
>
> Since 2026, I have led team AI adoption at FirmStudio — evaluating agent solutions, gathering colleague feedback, and rolling out company-wide AI-assisted workflows, with clear requirements and human communication at the centre.

**Highlights（3 點）：**
1. **Full-stack integration** — developed KNSM, a multi-campus platform serving 20+ schools
2. **Backend & crisis delivery** — HKAB ops turnaround (20+ min → 5–10 min); DrugInSport 10k+ import; restored client trust on troubled projects
3. **Led team AI adoption** — evaluated tools, gathered feedback, and rolled out AI-assisted workflows company-wide

---

## Skills

### Core Development
PHP, Laravel, JavaScript, TypeScript, Vue.js, HTML/CSS

### Data & Integration
MySQL, SQL Server, SQL, REST API design, third-party integrations (POS, payment gateways, Oracle exports, Google OCR)

### Engineering Workflow
Git/GitHub, Linux/SSH deployment, operation scripting, technical documentation

### AI-Assisted Engineering
Cursor, AI-assisted development, Cursor Skills design & standardization, AI agent evaluation & rollout, internal automation tooling

---

## Experience

### FirmStudio — Web Developer (Full Stack) | Oct 2022

**一句概述：**
> Full stack developer building multi-tenant internal systems, client web applications, and CMS platforms — owning both frontend and backend.

- **KNSM (2024 — maintenance)** — full-stack development of an internal Po Leung Kuk kindergarten platform used by **20+ schools** (no public URL); Vue 3 frontend + Laravel backend
- **DrugInSport (2025)** — [druginsport.hk](https://www.druginsport.hk/en) for ADOHK (`fs-anti-doping`); UI by design team, **all JavaScript (jQuery) and backend (Laravel) by me**; **10,000+** drugs; Excel import with **chunked processing** and **memory** optimization
- **Wellcome Lucky Draw (2025–2026)** — took over and revamped a legacy lucky draw codebase; reorganized duplicated coding, fixed vulnerabilities, integrated **Google OCR**, and created **AI-friendly technical documentation** later generalized into Cursor Skills
- **1O1O Corporate CMS (2025)** — [1010corporate.com](https://www.1010corporate.com/); CMS revamp with a colleague; **CMS UI/UX**, component-based page editor, version compare/approval, form builder, and detail refinements
- **HKAB member area (2022–2023; maintenance; ops script revamp in 2025)** — CMS integration + complex permissions; **16-node on-premise infra**; revamped ops scripts cut key procedures from **20+ min to 5–10 min**; operation guide praised by client

**Technologies:** PHP, Laravel, Vue 3, TypeScript, Inertia.js, MySQL, SQL Server, Oracle accounting integration, Google OCR, Cursor Skills

---

### ECHK — Web Developer (Full Stack) | Aug 2020 — May 2022

**一句概述：**
> Full-stack web development across loyalty, e-commerce, and booking for multiple clients.

- Built **[DentalMiles](https://www.dentalmiles.com/)** — dental loyalty and **booking platform** (single web system); points redemption (DentalMiles ↔ CDE), online booking, Miles Rewards & eShop
- Developed **HIPPOS POS and online shop modules** — configurable multi-tenant platform connecting iPad POS, Online POS, membership, points redemption, complex discounts, online payments, member cards, and quota-based booking ([live](https://hippos.systems/login) · [product info](https://leaflet.hippos.systems/))

**Technologies:** PHP, Laravel, JavaScript, Vue.js, MySQL, REST API

---

## Projects

**展示原則：** KNSM、HKAB 與 Wellcome Lucky Draw 為深入案例，依序呈現 Challenge & approach、My role、Outcome。DrugInSport 與 1O1O Corporate 為精簡案例，只保留摘要、成果重點、技術與公開連結。

### Wellcome Lucky Draw — Legacy Revamp, OCR Integration & AI-Ready Development Workflow

**Period:** 2025 — 2026

**描述（1–2 句）：**
> A legacy campaign project maintained across 2025–2026. I took over its PHP and JavaScript codebase, removed duplicated and unsafe patterns, integrated **Google OCR**, and documented real frontend and backend flows so AI-assisted changes could be made reliably and future delivery safer.

**Challenge & approach:** The inherited code had implicit behaviour that made AI-generated changes risky. I mapped the real flows, reorganized code, fixed vulnerabilities, and created documentation that AI agents could follow safely.

**My role:** Took over the project and led the frontend/backend revamp, OCR integration, security fixes, and AI-ready technical documentation.

**Outcome:** Turned an AI-error-prone legacy codebase into one where changes could be completed with much higher reliability; the documentation method later became reusable Cursor Skills.

**Technologies:** PHP, JavaScript, jQuery, CSS, Google OCR, MySQL, SQL, Cursor Skills, AI agent evaluation, AI-assisted development, technical documentation

- GitHub: N/A (company project)
- Live: N/A

---

### KNSM — Po Leung Kuk Kindergarten Management System

**Period:** 2024 — Present (maintenance)

**描述（1–2 句）：**
> Multi-campus internal platform for Po Leung Kuk kindergartens and nurseries. I delivered interconnected billing, subsidy, refund, and reporting work for **20+ campuses**, with **Oracle accounting exports** and 30+ reports supporting daily operations; the platform remains in maintenance for schools to use daily.

**Challenge & approach:** Requirements were incomplete after a PM change, schools worked differently, and money logic crossed many modules. We realigned every other day, surfaced gaps early, and shaped workable flows as real practices emerged.

**My role:** Owned UI implementation, fee settings and records, subsidies, refunds, usage-flow adjustments, Oracle AR/RA exports, and more than half of 30+ reports.

**Outcome:** Delivered a production platform for 20+ campuses under extreme pressure; biweekly demos kept client trust intact, and the client and school principals praised the outcome.

**Technologies:** PHP, Laravel, Vue 3, TypeScript, Inertia.js, Vuetify, SQL Server, Oracle accounting integration

- GitHub: N/A (company project)
- Live: N/A — internal use only

---

### DrugInSport — Anti-Doping Drug Database

**Period:** 2025

**描述（1–2 句）：**
> Public anti-doping drug lookup for [ADOHK](https://www.druginsport.hk/en). I built the JavaScript and Laravel workflow behind **10,000+** drug records, using chunked import, memory tuning, validation, approval, and scheduled launch controls to keep complex updates reliable; the public UI was supplied by the design team.

**Technologies:** PHP 8.2, Laravel 11, jQuery, Blade, Vite, Tailwind CSS, MySQL, PhpSpreadsheet, Laravel Queue

- GitHub: N/A (company project)
- Live: https://www.druginsport.hk/en

---

### 1O1O Corporate — Corporate CMS Revamp

**Period:** 2025

**描述（1–2 句）：**
> CMS revamp for [1O1O Corporate Solutions](https://www.1010corporate.com/), delivered with another backend developer. I led the CMS UI/UX and built its component editor, version comparison, approval workflow, and form builder—making publishing choices clearer for content editors and setting a stronger standard for day-to-day publishing.

**Technologies:** PHP, Laravel, Vue.js, JavaScript, CMS

- GitHub: N/A (company project)
- Live: https://www.1010corporate.com/

---

### HIPPOS — iPad POS, Online POS & E-Commerce Platform

**描述（1–2 句）：**
> Configurable multi-tenant platform linking iPad POS and online-shop operations. I owned POS APIs, Online POS UI/UX, shop backend, database design, and member cards; membership, points, payments, discounts, and quota-based booking could be configured for new clients without hardcoded rules.

**Technologies:** PHP, Laravel, JavaScript, Vue.js, MySQL, REST API, POS API integration, payment gateway integration, database design

- GitHub: N/A (company project)
- Live: https://hippos.systems/login
- Product: https://leaflet.hippos.systems/

---

### DentalMiles — Loyalty & Booking Platform

**Period:** 2020

**描述（1–2 句）：**
> A single dental loyalty and booking platform combining points redemption, DentalMiles-to-CDE conversion, quota-based online booking, Miles Rewards, and eShop features. I implemented the loyalty redemption and booking flows that connected these customer journeys in one web system, bringing rewards and booking into one consistent customer experience.

**Technologies:** PHP, Laravel, JavaScript, Vue.js, MySQL, REST API

- GitHub: N/A (company project)
- Live: https://www.dentalmiles.com/

---

### HKAB — Member Area & On-Premise Operations

**Period:** 2022–2023 development; maintenance ongoing; operation script revamp in 2025

**描述（1–2 句）：**
> Member portal with granular permissions, CMS integration, and **16-server** on-premise operations. I helped recover a delayed delivery, then rebuilt fragile operating procedures with clearer tooling and guides—cutting the main procedure from **20+ minutes to around 5**; the portal remains in maintenance.

**Challenge & approach:** HKAB had two trust-critical moments: a late-stage delivery takeover, then a hidden operations flaw two years later. We made recovery visible through weekly delivery; I later traced the root cause and rebuilt the scripts as operator-focused shell menus with status, logs, warnings, and guides.

**My role:** Built member-area permissions and portal features, worked with the PM to restore delivery momentum, and later owned maintenance and the operations recovery work.

**Outcome:** The ops revamp reduced the main procedure from 20+ minutes to around 5 minutes and produced guides operators could follow; the earlier recovery rebuilt client confidence through launch.

**Infrastructure:** P1–P4 × {WEB, CMS, DB, HIBOR} — CMS nodes handle file sync; DB nodes handle MySQL replication.

**Technologies:** PHP, Laravel 9, Laravel Passport, MySQL replication, on-premise Linux, Artisan CLI ops scripts

- GitHub: N/A (company project — `hkab-api` / `hkab-cms` / `hkab-web`)
- Live: N/A — member login required

---

## Education

| 學校 | 學位 | 年份 |
|------|------|------|
| IVE (Tsing Yi) | Diploma of Software Engineering (GPA 3.23) | 2018 — 2020 |

---

## Contact

| 欄位 | 內容 |
|------|------|
| Email | lhs.cyrus@gmail.com |
| GitHub | https://github.com/lhscyrus-work |
| Location | Hong Kong |

---

## 同步 Checklist

完成此稿後，逐項對照更新：

- [x] `data/portfolio.json` — 網站直接讀取
- [ ] `data/master/*.json` — 完整結構化備份（可選，或由腳本生成）
- [ ] 本地預覽確認：`python -m http.server 8080`

---

## 與 profile.md 的對應

| portfolio-draft section | 來源 |
|-------------------------|------|
| Hero | profile §1 基本資料 + §2 短版自介 |
| About | profile §2 中版自介 + 核心賣點 |
| Skills | profile §4（只取進階/中級以上） |
| Experience | profile §5（`是否放 portfolio = 是`） |
| Projects | profile §6（按優先序取前 2–3 個） |
| Education | profile §7 |
| Contact | profile §1 可公開聯絡方式 |
