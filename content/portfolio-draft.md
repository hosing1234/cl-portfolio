# Portfolio 精選稿 — Public Draft

> **用途：** 從 `profile.md` 精選、改寫成對外展示版本，對應網站各 section。  
> **原則：** 精簡、量化、對準 IT 軟件公司招聘方；一頁能看完的重點。  
> **最後更新：** 2026-07-04  
**狀態：** 草稿 — FirmStudio 三個主力 project 已填（KNSM、DrugInSport、HKAB），待自介

---

## Hero

| 欄位 | 內容 |
|------|------|
| Name | Lee Ho Sing Cyrus |
| Title | Full Stack Web Developer |
| Tagline | `[待填 — 一句話賣點，英文]` |

**CTA：**
- Primary: View Projects → `#projects`
- Secondary: Contact Me → `#contact`

---

## About

**正文（約 80–120 字）：**
> `[待填 — 從 profile.md 中版自介精簡]`

**Highlights（3 點）：**
1. 5+ years full-stack web development (PHP/Laravel, Vue, jQuery)
2. Led FirmStudio **AI agent adoption** (2026) — evaluated solutions, built standardized **Cursor skills** for code scanning, docs & plan mode
3. Enterprise systems at scale — KNSM (20+ schools), DrugInSport (10k+ drugs), HKAB (16-node on-premise)

---

## Skills

### Languages
PHP, JavaScript, HTML, CSS, SQL

### Frameworks
Laravel, Vue.js, Node.js, jQuery, Bootstrap

### Database
MySQL

### Integration
REST APIs, API Integration (POS, payment gateways)

### AI & Workflow
Cursor, AI-assisted development, Cursor Skills design, AI agent evaluation & rollout, code scanning automation

---

## Experience

### FirmStudio — Full Stack Web Developer | Oct 2022 — Present

**一句概述：**
> Full stack developer building multi-tenant internal systems and client web applications — owning both frontend and backend.

- **Full stack** development of **KNSM** — internal Po Leung Kuk kindergarten platform used by **20+ schools** (no public URL); Vue 3 frontend + Laravel backend
- Built **DrugInSport** — [druginsport.hk](https://www.druginsport.hk/en) for ADOHK (`fs-anti-doping`); UI by design team, **all JavaScript (jQuery) and backend (Laravel) by me**; **10,000+** drugs; Excel import with **chunked processing** and **memory** optimization
- Built **HKAB member area** — complex permissions; **16-node on-premise infra**; revamped ops scripts cut key procedures from **20+ min to 5–10 min**; operation guide praised by client
- **Led AI agent adoption (2026)** — evaluated AI agent solutions, gathered team feedback, rolled out **Cursor Skills** for code scanning, document generation, and plan mode optimization; built internal batch tools (e.g. FTP access testing)

**Technologies:** PHP, Laravel, Vue 3, TypeScript, Inertia.js, MySQL, Oracle export, LDAP

---

### ECHK — Web Developer | Aug 2020 — May 2022

**一句概述：**
> Full-stack web development across loyalty, e-commerce, and booking systems for multiple clients.

- Built **DentalMiles redemption system** with cross-platform points transfer (DentalMiles ↔ CDE)
- Developed **HIPPOS online shop module** — multi-tenant e-commerce with POS API integration, auto-discounts, promo codes, inventory sync, and online payments ([live](https://hippos.systems/login) · [product info](https://leaflet.hippos.systems/))
- Built **online booking system** with configurable quota rules

**Technologies:** PHP, Laravel, JavaScript, Vue.js, MySQL, REST API

---

## Projects

### KNSM — Po Leung Kuk Kindergarten Management System

**描述（1–2 句）：**
> **Full stack** internal platform for Po Leung Kuk kindergartens and nurseries — **no public URL**. Built and maintained **both frontend (Vue 3 + TypeScript) and backend (Laravel)**; serving **20+ campuses** with student management, fee billing, and **Oracle** AR/RA exports.

**Technologies:** PHP, Laravel, Vue 3, TypeScript, Inertia.js, Vuetify, MySQL, Oracle export, LDAP

- GitHub: N/A (company project)
- Live: N/A — internal use only

---

### DrugInSport — Anti-Doping Drug Database

**描述（1–2 句）：**
> Public anti-doping drug lookup for [ADOHK](https://www.druginsport.hk/en). UI by design team (partial generated CSS); **I built all JavaScript (jQuery) and backend (Laravel 11)**. **10,000+** drug records; Excel import pipeline with **500-row chunks**, memory tuning, and approval workflow.

**Technologies:** PHP 8.2, Laravel 11, jQuery, Blade, Vite, Tailwind CSS, MySQL, PhpSpreadsheet, Laravel Queue

- GitHub: N/A (company project)
- Live: https://www.druginsport.hk/en

---

### HIPPOS — Online Shop Module

**描述（1–2 句）：**
> Online shop module for [HIPPOS](https://hippos.systems/login), an iPad retail management platform (Apple Mobility Partner). Built multi-tenant storefronts with POS API integration, synced inventory/membership, discount rules, and payment processing.

**Technologies:** PHP, Laravel, JavaScript, Vue.js, MySQL, REST API

- GitHub: N/A (company project)
- Live: https://hippos.systems/login
- Product: https://leaflet.hippos.systems/

---

### HKAB — Member Area & On-Premise Operations

**描述（1–2 句）：**
> Member portal for Hong Kong Accreditation Body with granular **role-based permissions**. Also documented and scripted **on-premise operations** for a **16-server architecture**: 4 groups (P1–P4), each with WEB, CMS, DB, and HIBOR nodes — **CMS file sync**, **DB replication**, daily backup, failover, and restart procedures. Operation guide praised by client.

**Infrastructure:** P1–P4 × {WEB, CMS, DB, HIBOR} — CMS nodes handle file sync; DB nodes handle MySQL replication.

**Technologies:** PHP, Laravel 9, Laravel Passport, MySQL replication, on-premise Linux, Artisan CLI ops scripts

- GitHub: N/A (company project — `hkab-api` / `hkab-cms` / `hkab-web`)
- Live: N/A — member login required

---

## Education

| 學校 | 學位 | 年份 |
|------|------|------|
| IVE (Tsing Yi) | Diploma of Software Engineering (GPA 3.23) | 2020 |

---

## Contact

| 欄位 | 內容 |
|------|------|
| Email | hosing1234@gmail.com |
| GitHub | https://github.com/fs-cyrus-lee |
| Location | Hong Kong |

---

## 同步 Checklist

完成此稿後，逐項對照更新：

- [ ] `data/portfolio.json` — 網站直接讀取
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
