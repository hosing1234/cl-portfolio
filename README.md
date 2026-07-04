# 個人作品集網站 — cl-portfolio

面向 IT / 軟件開發公司見工用的個人 portfolio 網站。

**內容流程：** 先在 Markdown 整理個人資料 → 精選成 portfolio 稿 → 同步至 JSON → 網站渲染。目前於 local branch `content/profile-data` 進行資料收集，網站骨架及 JSON 為 placeholder。

---

## 專案結構

```
cl-portfolio/
├── content/                # ★ 第一步：在這裡填寫個人資料（Markdown）
│   ├── profile.md              # 完整個人資料（master，source of truth）
│   └── portfolio-draft.md      # 對外精選稿（從 profile 整理）
├── data/                   # 第二步：由 Markdown 同步過來的結構化資料
│   ├── master/                 # JSON 版完整資料
│   └── portfolio.json          # 網站直接讀取的精簡版
├── index.html              # 網站入口
├── css/style.css
├── js/main.js
├── .github/workflows/deploy.yml
└── README.md
```

---

## 建議工作流程

```
profile.md  ──精選改寫──▶  portfolio-draft.md  ──同步──▶  data/portfolio.json  ──▶  網站
     │                                                          │
     └──────────────────── 可選同步 ──────────────────────────▶ data/master/*.json
```

| 階段 | 檔案 | 做什麼 |
|------|------|--------|
| 1. 收集 | `content/profile.md` | 填寫所有個人資料，標記哪些要公開 |
| 2. 精選 | `content/portfolio-draft.md` | 改寫成招聘方易讀的精簡版 |
| 3. 同步 | `data/portfolio.json` | 轉成 JSON 供網站渲染 |
| 4. 預覽 | 本地 HTTP server | 確認內容及排版 |
| 5. 部署 | push 至 GitHub | GitHub Pages 自動更新 |

**現階段：** 專注步驟 1–2，填好 Markdown 後再更新 JSON 及網站內容。

---

## 兩層資料架構

### 1. Master Data（`data/master/`）— 完整個人資料庫

用作**內部整理**，存放所有與你相關的資料，方便日後更新 portfolio 或製作 CV。

| 檔案 | 用途 | 主要欄位 |
|------|------|----------|
| `personal.json` | 個人基本資料 | name, title, contact, bio, availability |
| `education.json` | 學歷 | institution, degree, dates, highlights |
| `experience.json` | 工作經驗 | company, role, achievements, technologies, `showOnPortfolio` |
| `skills.json` | 技能 | categories, level (beginner/intermediate/advanced) |
| `projects.json` | 項目 | title, description, links, `showOnPortfolio`, `portfolioPriority` |
| `certifications.json` | 證書 | name, issuer, dates |
| `languages.json` | 語言 | language, proficiency |

**設計原則：**
- 支援中英雙語（`en` / `zh` 欄位）
- 每項 experience / project 設有 `showOnPortfolio` 布林值，控制是否納入對外展示
- `portfolioPriority` 數字越小越優先展示

### 2. Portfolio Data（`data/portfolio.json`）— 對外精簡版

用作**網站實際渲染**，從 master data 中精選、改寫成招聘方易讀的格式。

```json
{
  "meta":       { "siteTitle", "language", "lastUpdated" },
  "hero":       { "name", "title", "tagline", "cta" },
  "about":      { "text", "highlights" },
  "skills":     [ { "category", "items" } ],
  "experience": [ { "company", "role", "period", "bullets", "technologies" } ],
  "projects":   [ { "title", "description", "technologies", "links" } ],
  "education":  [ { "institution", "degree", "period" } ],
  "contact":    { "email", "github", "linkedin", "location" }
}
```

**更新流程：**
1. 在 `content/profile.md` 更新完整資料
2. 整理 `content/portfolio-draft.md` 精選稿
3. 同步至 `data/portfolio.json`（及可選的 `data/master/`）
4. Push 至 GitHub，網站自動更新

---

## 本地預覽

因網站使用 `fetch()` 讀取 JSON，需透過本地 HTTP server 預覽（直接開 `index.html` 會因 CORS 限制而無法載入資料）。

```bash
# Python 3
python -m http.server 8080

# 或 Node.js (需安裝 npx)
npx serve .
```

然後在瀏覽器開啟 `http://localhost:8080`。

---

## Git 分支策略

| Branch | 用途 |
|--------|------|
| `master` | 穩定版 — 網站骨架及已確認內容 |
| `content/profile-data` | **目前工作分支** — 填寫 Markdown 個人資料 |

```bash
# 目前在 content/profile-data 工作
git checkout content/profile-data

# 資料填妥、JSON 同步、網站確認後，合併回 master
git checkout master
git merge content/profile-data
```

---

## 部署至 GitHub Pages

> 資料收集完成、內容確認後再 push 及部署。

### 首次設定

1. **建立 GitHub repo** 並 push 此專案：

   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git branch -M main
   git remote add origin https://github.com/<username>/cl-portfolio.git
   git push -u origin main
   ```

2. **啟用 GitHub Pages**：
   - 進入 repo → **Settings** → **Pages**
   - **Source** 選 **GitHub Actions**
   - Push 至 `main` branch 後，`.github/workflows/deploy.yml` 會自動部署

3. **公開網址**：
   ```
   https://<username>.github.io/cl-portfolio/
   ```

### 後續更新

只需修改 `data/portfolio.json`（或 master data）後 push，GitHub Actions 會自動重新部署，無需額外操作。

---

## 自訂內容

### 必改項目

| 位置 | 內容 |
|------|------|
| `data/master/personal.json` | 姓名、聯絡方式、自介 |
| `data/master/experience.json` | 真實工作經驗 |
| `data/master/projects.json` | 真實項目及 GitHub 連結 |
| `data/portfolio.json` | 對外展示的全部內容 |
| `index.html` `<title>` / meta | SEO 描述（或由 JS 動態設定） |

### 選改項目

- `css/style.css` — 調整配色（修改 `:root` CSS variables）
- `js/main.js` — 新增 section 或調整渲染邏輯
- `data/master/skills.json` — 更新技能及程度

---

## 技術選型

| 項目 | 選擇 | 原因 |
|------|------|------|
| 前端 | Vanilla HTML/CSS/JS | 零依賴、載入快、易維護 |
| 資料 | JSON | 內容與呈現分離，非技術人員也可編輯 |
| 部署 | GitHub Pages + Actions | 免費、自動化、與 repo 同步 |
| 字體 | Inter + JetBrains Mono | 清晰易讀，適合技術 portfolio |

---

## 見工建議

針對 IT / 軟件公司，portfolio 應突出：

1. **Projects** — 2–3 個有 GitHub link 的完整項目，說明你用了什麼技術、解決了什麼問題
2. **Experience bullets** — 用數字量化成果（如「減少 40% 載入時間」）
3. **Skills** — 對準 job description 的 tech stack
4. **GitHub link** — 確保 profile 有 pinned repos 及 README

---

## License

MIT — 可自由使用及修改。
