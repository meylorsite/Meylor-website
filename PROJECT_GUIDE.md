# MEYLOR International School — Project Guide

A full-stack bilingual (EN/AR) school website with a public site, admission wizard, public review system, and a dynamic admin CMS. Everything visible on the public site is editable from the admin panel.

---

## 1. Live Environments

| Piece | URL | Hosted on |
|---|---|---|
| **Frontend** | `https://glittery-kangaroo-a108ac.netlify.app` | Netlify |
| **Backend API** | `https://meylor-website.onrender.com/api` | Render |
| **Database** | `meylor.mwkvohf.mongodb.net` (cluster: `meylor`, db: `meylor`) | MongoDB Atlas |
| **Repo** | `https://github.com/meylorsite/Meylor-website` | GitHub |

Pushing to `main` triggers an auto-deploy on both Netlify and Render.

### Test accounts (seeded)

```
SUPER_ADMIN  admin@meylor.sa     Meylor@2026!
PARENT       parent@meylor.sa    Parent@2026!   (has 2 children: Sara, Omar)
STUDENT      student@meylor.sa   Student@2026!
```

---

## 2. Tech Stack

**Frontend** (`/frontend`)
- Next.js 14 (App Router, server + client components)
- TypeScript
- Tailwind CSS
- next-intl (i18n, EN + AR with RTL)
- Framer Motion (animations)
- Swiper (carousels)
- Zustand (auth state)
- React-hot-toast (toasts)
- Lucide-react (icons)
- Font: Alexandria (Google Fonts — supports Latin + Arabic)

**Backend** (`/backend`)
- Node 20
- Express 4
- TypeScript + `tsx` for dev, `tsc` for build
- Mongoose 8 (MongoDB ODM)
- JWT auth (access + refresh tokens, 15m / 7d)
- bcryptjs (password hashing, cost 12)
- Helmet + CORS + rate-limit
- Zod (validation)

---

## 3. Folder Layout

```
/
├── backend/
│   ├── src/
│   │   ├── index.ts                ← Express bootstrap (CORS, rate-limits, routes)
│   │   ├── config/db.ts            ← Mongoose connection with retry
│   │   ├── models/                 ← Mongoose schemas (19 models)
│   │   │   ├── User.ts
│   │   │   ├── Program.ts
│   │   │   ├── NewsPost.ts
│   │   │   ├── GalleryActivity.ts
│   │   │   ├── Testimonial.ts      (with isApproved moderation)
│   │   │   ├── AdmissionApplication.ts
│   │   │   ├── JobApplication.ts
│   │   │   ├── ContactMessage.ts
│   │   │   ├── ComplaintTicket.ts
│   │   │   ├── NewsletterSubscriber.ts
│   │   │   ├── TeamMember.ts
│   │   │   ├── Section.ts
│   │   │   ├── FAQ.ts
│   │   │   ├── JourneyItem.ts
│   │   │   ├── PricingPackage.ts
│   │   │   ├── JobPost.ts
│   │   │   ├── StatCounter.ts
│   │   │   ├── Facility.ts
│   │   │   └── SiteSettings.ts
│   │   ├── controllers/crudFactory.ts  ← generic getAll/getOne/createOne/updateOne/deleteOne/reorder
│   │   ├── routes/
│   │   │   ├── auth.ts             ← login, refresh, logout, profile, my-admissions, change-password
│   │   │   ├── admin.ts            ← all CRUD routes (authorize SUPER_ADMIN/ADMIN/EDITOR)
│   │   │   └── public.ts           ← public reads + form submissions
│   │   ├── middleware/
│   │   │   ├── auth.ts             ← authenticate + authorize(...roles)
│   │   │   ├── validate.ts
│   │   │   └── errorHandler.ts
│   │   ├── validators/public.ts    ← Zod schemas for public forms
│   │   ├── utils/                  ← ApiError, asyncHandler, jwt, ticketNumber
│   │   └── seed.ts                 ← seed script (drops and repopulates collections)
│   ├── .env                        ← NOT committed
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          ← root layout (metadata)
│   │   │   ├── globals.css         ← Tailwind + RTL rules
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx      ← locale layout, Alexandria font, <Toaster/>
│   │   │       ├── page.tsx        ← homepage
│   │   │       ├── about/          ← + _components/AboutPageClient.tsx
│   │   │       ├── programs/
│   │   │       ├── admissions/     ← + _components/AdmissionWizard.tsx (5-step)
│   │   │       ├── careers/
│   │   │       ├── gallery/ + [slug]/
│   │   │       ├── journey/
│   │   │       ├── news/ + [slug]/
│   │   │       ├── contact/
│   │   │       ├── faq/
│   │   │       └── admin/
│   │   │           ├── layout.tsx  ← grouped sidebar, role-based nav
│   │   │           ├── page.tsx    ← dashboard
│   │   │           ├── login/
│   │   │           ├── profile/
│   │   │           ├── portal/     ← parent/student portal
│   │   │           ├── my-applications/
│   │   │           └── {18 resource pages using AdminCrud}
│   │   ├── components/
│   │   │   ├── admin/AdminCrud.tsx ← generic CMS table/form (the engine)
│   │   │   ├── home/               ← hero, stats, programs preview, etc.
│   │   │   ├── layout/             ← Header, Footer, LayoutWrapper
│   │   │   ├── shared/             ← ReviewFormModal
│   │   │   └── ui/                 ← PageHero, SectionHeading, AnimatedCard, etc.
│   │   ├── lib/
│   │   │   ├── api.ts              ← publicApi + adminApi fetch wrappers
│   │   │   ├── auth-store.ts       ← Zustand store (login/logout/refresh)
│   │   │   └── utils.ts            ← cn(), getLocalizedField(), formatDate()
│   │   ├── messages/               ← en.json, ar.json (next-intl)
│   │   ├── i18n.ts                 ← locales + loader
│   │   └── middleware.ts           ← next-intl locale middleware
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── .env                        ← NOT committed
│   └── .env.example
│
├── netlify.toml                    ← frontend deploy config
├── render.yaml                     ← backend deploy config
├── .gitignore
├── PROJECT_GUIDE.md                ← this file
└── TESTING_PROMPT.md               ← QA test script
```

---

## 4. Data Models (19 total)

All models use `timestamps: true` (adds `createdAt`/`updatedAt`).

| Model | Purpose | Key fields |
|---|---|---|
| `User` | Auth + role | email, password, nameEn/Ar, role (SUPER_ADMIN/ADMIN/EDITOR/PARENT/STUDENT), phone, nationality, nationalId, avatarUrl, children[] |
| `SiteSettings` | Singleton config | logoUrl, schoolNameEn/Ar, taglineEn/Ar, phone, email, addressEn/Ar, mapUrl, socialLinks, seo* |
| `Section` | Generic content block | key, page, titleEn/Ar, subtitleEn/Ar, contentEn/Ar, imageUrl, ctaTextEn/Ar, ctaLink, order, isVisible |
| `Program` | Academic program | titleEn/Ar, slug, descriptionEn/Ar, gradeRange, ageRange, classSize, curriculumEn/Ar, scheduleEn/Ar, highlightsEn/Ar[], extracurricularsEn/Ar[], imageUrl |
| `Facility` | Campus facility | titleEn/Ar, descriptionEn/Ar, imageUrl, order |
| `Testimonial` | Parent/student review | nameEn/Ar, roleEn/Ar, contentEn/Ar, rating, isApproved, isVisible, submittedBy, submitterEmail |
| `NewsPost` | News article | titleEn/Ar, slug, excerptEn/Ar, contentEn/Ar, imageUrl, category, publishedAt |
| `GalleryActivity` | Photo album | titleEn/Ar, slug, descriptionEn/Ar, date, locationEn/Ar, coverImageUrl, media[] (url, type, caption), isInsideSchool |
| `JourneyItem` | Before/after campus | titleEn/Ar, descriptionEn/Ar, beforeImageUrl, afterImageUrl |
| `PricingPackage` | Tuition tier | titleEn/Ar, price, currency, period, featuresEn/Ar[], includesEn/Ar[], notIncludedEn/Ar[], isPopular |
| `JobPost` | Open job | titleEn/Ar, slug, descriptionEn/Ar, departmentEn/Ar, typeEn/Ar, locationEn/Ar, qualificationsEn/Ar[], benefitsEn/Ar[], salaryRange, experienceRequired, isOpen |
| `JobApplication` | Job form submission | jobPost (ref), name, email, phone, yearsOfExperience, cvLink, message, status |
| `AdmissionApplication` | Enrollment form | packageId (ref), parentName, parentEmail, parentPhone, nationality, studentNameEn/Ar, dateOfBirth, currentGrade, previousSchool, medicalConditions, status, submittedBy (ref) |
| `ContactMessage` | Contact form | name, email, phone, subject, message, isRead |
| `ComplaintTicket` | Complaint form | ticketNumber (auto), name, email, category, priority, details, attachmentLink, status |
| `NewsletterSubscriber` | Email subscriber | email, isActive |
| `StatCounter` | Stat on homepage | labelEn/Ar, value, suffix |
| `FAQ` | Q&A | questionEn/Ar, answerEn/Ar, category, order |
| `TeamMember` | Board/Leadership/Staff | nameEn/Ar, roleEn/Ar, bioEn/Ar, imageUrl, email, phone, category (board/leadership/staff) |

---

## 5. API Endpoints

Base: `https://meylor-website.onrender.com/api`

### Public (no auth)
```
GET    /health
GET    /public/settings
GET    /public/sections?page=<home|about|about-values|about-milestones|about-features>
GET    /public/programs               GET /public/programs/:slug
GET    /public/facilities
GET    /public/testimonials           ← only isApproved && isVisible
GET    /public/news?page=&limit=      GET /public/news/:slug
GET    /public/gallery                GET /public/gallery/:slug
GET    /public/journey
GET    /public/pricing
GET    /public/jobs                   GET /public/jobs/:slug
GET    /public/stats
GET    /public/faqs?category=
GET    /public/team?category=<board|leadership|staff>

POST   /public/contact        (rate-limited)
POST   /public/complaints     (rate-limited, generates ticket)
POST   /public/applications   (rate-limited, job applications)
POST   /public/admissions     (rate-limited, wizard submission, optionalAuth)
POST   /public/newsletter     (rate-limited)
POST   /public/testimonials   (rate-limited, goes to pending queue)
```

### Auth
```
POST   /auth/login            { email, password }  → { user, accessToken, refreshToken }
POST   /auth/refresh          { refreshToken }
POST   /auth/logout           (auth)
GET    /auth/me               (auth)
PUT    /auth/profile          (auth)  ← self-service profile update
PUT    /auth/change-password  (auth)
GET    /auth/my-admissions    (auth, PARENT/STUDENT)
```

### Admin (auth + role SUPER_ADMIN | ADMIN | EDITOR)
```
GET    /admin/dashboard              ← aggregated counts + recent lists

GET    /admin/settings
PUT    /admin/settings

GET    /admin/users                  (SUPER_ADMIN only)
POST   /admin/users                  (SUPER_ADMIN only)
PUT    /admin/users/:id              (SUPER_ADMIN only)
DELETE /admin/users/:id              (SUPER_ADMIN only)

# Identical pattern for each resource below:
GET    /admin/<resource>?page=&limit=&sort=&search=&isVisible=&status=
GET    /admin/<resource>/:id
POST   /admin/<resource>
PUT    /admin/<resource>/:id
DELETE /admin/<resource>/:id
PUT    /admin/<resource>-reorder     (for resources that use `order`)

# where <resource> ∈ {
#   sections, programs, facilities, testimonials, news, gallery,
#   journey, pricing, jobs, applications, admissions, contacts,
#   complaints, newsletter, faqs, stats, team
# }
```

Search is dynamic: the CRUD factory scans all String paths on the schema and runs a case-insensitive `$regex` across them. No hardcoded field list.

---

## 6. Public Pages (what the visitor sees)

| Route | Source | Editable from |
|---|---|---|
| `/` (homepage) | sections(home), stats, programs, facilities, testimonials, news, gallery | Admin → each respective module |
| `/about` | sections(about, about-values, about-milestones, about-features), team | Admin → Sections + Team |
| `/programs` | programs | Admin → Programs |
| `/admissions` | pricing + FAQs + 5-step wizard | Admin → Pricing + FAQs (wizard posts to /public/admissions) |
| `/careers` | jobs | Admin → Jobs |
| `/gallery` + `/gallery/:slug` | gallery activities (with media) | Admin → Gallery (media-gallery field type) |
| `/journey` | journey items | Admin → Journey |
| `/news` + `/news/:slug` | news posts | Admin → News |
| `/contact` | SiteSettings (phone/email/address) + form submission | Admin → Settings |
| `/faq` | FAQs | Admin → FAQs |

All public-data fetches use `next: { revalidate: 10 }` — admin changes appear on the public site within **10 seconds**.

---

## 7. Admin Panel

### Sidebar groups (SUPER_ADMIN / ADMIN / EDITOR)
1. **Dashboard** (ungrouped)
2. **Content** — Sections, Programs, News, Gallery, Journey, Facilities, Team, Testimonials, FAQs, Stats, Pricing
3. **Admissions & Careers** — Admissions, Jobs, Applications
4. **Messages** — Contacts, Complaints, Newsletter
5. **System** — Users
6. **Account** — Profile, Settings

### Sidebar for PARENT
My Portal · My Applications · Programs · Profile

### Sidebar for STUDENT
My Portal · My Grades · Profile

### `AdminCrud.tsx` features (one component, used by all 18 resource pages)
- Table with 5 visible columns (auto-picks first 5 where `showInTable !== false`)
- **Search** — debounced 300ms, runs against every String field on the model
- **Sort** — 8 presets (Newest, Oldest, Order ±, Name A-Z, Title A-Z)
- **View** — read-only details modal showing every field (including non-table fields, media thumbnails, date formatting, clickable URLs)
- **Edit / Create** — modal form; all fields including bilingual EN/AR, textarea, select, boolean, url, date, array, media-gallery, number
- **Delete** — confirm dialog shows the entity name being deleted
- **Approve** — shows Check icon on rows with `isApproved` (testimonials). Amber = pending, Green = approved. One-click toggle.
- **Toggle visibility** — Eye icon on rows with `isVisible/isPublished/isOpen`
- **Reorder** — when sorted by `order`, Up/Down arrow buttons swap neighbours
- **Export CSV** — date range picker (From/To + quick presets All time / This month / Last 30 days); exports every non-password field, UTF-8 BOM so Excel opens Arabic correctly
- **Auto-order** — on Create, new items get `order = max(existing) + 1`. The Order field is hidden from forms.
- **Retry** — if a request fails (e.g. Render cold-start), 3 auto-retries with 2s gap. Final failure shows an inline Retry button.
- **Bilingual UI** — all text translates to Arabic when locale is `ar`. Field labels are auto-translated via an internal dictionary (`LABEL_AR`).
- **RTL** — tables, sticky Actions column, search clear button all flip for `dir="rtl"`.

### Dashboard (admin landing)
- Welcome banner with date + greeting
- 4 stat cards (Messages / Complaints / Applications / Subscribers) each linkable
- 8 content overview tiles (Programs / News / Gallery / Facilities / Testimonials / Team / Jobs / Users)
- 3 recent activity columns (Messages / Complaints / Applications) with relative timestamps
- Recent Published News row with thumbnails
- Quick Actions (7 shortcut buttons to add content)
- System Info bar (site status, your role, total users, last login)

---

## 8. Auth & Roles

- **Access token**: JWT, 15 min, sent as `Authorization: Bearer <token>`
- **Refresh token**: JWT, 7 days, stored in `User.refreshTokens` array (allows multi-device + revocation)
- On login: client stores both in `localStorage`, Zustand holds them in memory
- On 401 with valid refresh: `refreshAuth()` auto-retries the request with a new access token
- Admin routes gate with `authenticate` + `authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR')`
- `PARENT` and `STUDENT` can use `/auth/profile`, `/auth/my-admissions`, `/auth/change-password`, but are blocked from `/admin/*` routes (backend) and redirected to `/admin/portal` (frontend)

---

## 9. i18n

- Locales: `en`, `ar` (`src/i18n.ts`)
- URL pattern: `/{locale}/...` (middleware enforces)
- Strings: `src/messages/{en,ar}.json`
- Usage in client components: `useTranslations('namespace')` → `t('key')`
- Usage in server components: `getTranslations({ locale, namespace })`
- Bilingual DB fields: `<field>En` + `<field>Ar` with helper `getLocalizedField(doc, 'field', locale)`
- Font: Alexandria (supports Arabic script natively)
- RTL: driven by `dir={locale === 'ar' ? 'rtl' : 'ltr'}` on the `<html>` element; `[dir='rtl']` selectors in `globals.css` handle line-height, header alignment, etc.

---

## 10. How to Add a New Content Type

Example: add a "Scholarship" model.

1. **Create the model**: `backend/src/models/Scholarship.ts` — Mongoose schema with the fields you want.
2. **Export** it from `backend/src/models/index.ts`.
3. **Register admin routes** in `backend/src/routes/admin.ts`:
   ```ts
   router.get('/scholarships', crud.getAll(Scholarship));
   router.get('/scholarships/:id', crud.getOne(Scholarship));
   router.post('/scholarships', crud.createOne(Scholarship));
   router.put('/scholarships/:id', crud.updateOne(Scholarship));
   router.delete('/scholarships/:id', crud.deleteOne(Scholarship));
   router.put('/scholarships-reorder', crud.reorder(Scholarship));
   ```
4. **Public route** (if public): add in `backend/src/routes/public.ts`.
5. **Add public API method** in `frontend/src/lib/api.ts`.
6. **Create the admin page** `frontend/src/app/[locale]/admin/scholarships/page.tsx`:
   ```tsx
   'use client';
   import AdminCrud from '@/components/admin/AdminCrud';
   export default function AdminScholarships() {
     return <AdminCrud
       resource="scholarships"
       title="Scholarships"
       fields={[
         { key: 'title', label: 'Title', bilingual: true, required: true, showInTable: true },
         { key: 'amount', label: 'Amount', type: 'number' },
         { key: 'description', label: 'Description', bilingual: true, type: 'textarea' },
         { key: 'order', label: 'Order', type: 'number', showInTable: true },
         { key: 'isVisible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
       ]}
     />;
   }
   ```
7. **Add to admin sidebar** in `frontend/src/app/[locale]/admin/layout.tsx` under the appropriate `adminGroups` section.
8. **(Optional)** add Arabic label to `NAV_LABELS_AR` and `TITLE_AR`/`LABEL_AR` dictionaries.
9. **Consume on public side** via `publicApi.getScholarships()` in a server component.
10. **Seed sample data** in `backend/src/seed.ts` if desired.

That's it — CRUD, search, sort, view, export, approve, reorder, CSV, i18n labels — all come for free from the existing `AdminCrud` + `crudFactory`.

---

## 11. Local Development

```bash
# prerequisites: Node 20, MongoDB running locally on 27017 or Atlas URI in .env

# Backend
cd backend
cp .env.example .env     # set MONGODB_URI + JWT secrets
npm install
npm run seed             # populate DB
npm run dev              # http://localhost:5001

# Frontend
cd frontend
cp .env.example .env     # set NEXT_PUBLIC_API_URL=http://localhost:5001/api
npm install
npm run dev              # http://localhost:3000
```

Scripts:
- `backend`: `dev` (tsx watch), `build` (tsc), `start` (node dist), `seed` (tsx src/seed.ts)
- `frontend`: `dev`, `build`, `start`, `lint`

---

## 12. Environment Variables

### Backend
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/meylor?...
JWT_ACCESS_SECRET=<96 hex chars>
JWT_REFRESH_SECRET=<96 hex chars>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://glittery-kangaroo-a108ac.netlify.app
ADMIN_EMAIL=admin@meylor.sa
ADMIN_PASSWORD=Meylor@2026!
```

- CORS additionally whitelists any `*.netlify.app` origin.
- `FRONTEND_URL` can be a comma-separated list.

### Frontend
```
NEXT_PUBLIC_API_URL=https://meylor-website.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://glittery-kangaroo-a108ac.netlify.app
```

---

## 13. Deployment

### Netlify (frontend)
- `netlify.toml` at repo root
- Base directory: `frontend`
- Build: `npm run build`
- Publish: `.next` (uses `@netlify/plugin-nextjs` auto-installed by Netlify)
- Set `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_SITE_URL` in Site → Environment variables.

### Render (backend)
- `render.yaml` at repo root (informational — settings configured in Render UI)
- Root directory: `backend`
- Runtime: Node
- Build: `npm install --include=dev && npm run build` (dev deps needed for `tsc`)
- Start: `npm start`
- Health check: `/api/health`
- Free tier spins down after 15 min inactivity; first request after sleep takes ~30-50s. `AdminCrud` retries 3× automatically; upgrade to a paid instance for always-on.

### MongoDB Atlas
- Network Access: `0.0.0.0/0` (or the Render egress IPs once Render provides static IPs)
- Database user credentials used in `MONGODB_URI`
- Free tier (M0) is fine for current load.

---

## 14. Performance & Caching

- Public GETs cached via `next: { revalidate: 10 }` — ISR with 10s window.
- Admin fetches are live (no cache).
- Backend rate limits:
  - General: 200 req / 15 min per IP
  - Auth: 20 / 15 min
  - Forms (contact/complaint/application/admission/newsletter/testimonial POST): 10 / 15 min
- Next.js `<Image>` is used everywhere for automatic optimization.
- Images are served from Pexels / Unsplash / school uploads (CDN-backed).
- Production build bundle: 87 KB shared JS, largest page ~210 KB First Load (homepage).

---

## 15. Known Limitations / Future Improvements

- **No file upload**: images are URLs only. Adding Cloudinary or S3 integration would let admins upload directly.
- **No email notifications**: form submissions only save to DB. Add SendGrid/SES hooks in route handlers.
- **No pagination UI** on some admin list views beyond 20 rows per page. Extend `AdminCrud` with a pagination footer.
- **CSV export** is client-side. For very large datasets (10k+), move to a streaming server endpoint.
- **No audit log**: can't tell which admin edited what when. Add an `ActivityLog` model with middleware on admin writes.
- **No scheduled publish**: news posts publish immediately. Add a `publishAt` field + cron.
- **Free Render** cold-starts. Upgrade to Starter ($7/mo) for always-on.

---

## 16. Quick Reference

- **Login**: `/en/admin/login` (any role)
- **Dashboard**: `/en/admin` (admin roles only)
- **Portal**: `/en/admin/portal` (parent / student)
- **Public site root**: `/en` or `/ar`
- **API health**: `https://meylor-website.onrender.com/api/health`

### Conventions
- Bilingual DB fields always use `<key>En` + `<key>Ar`
- Image URLs: always full https URLs (no blob uploads)
- Slugs: kebab-case, unique per model
- Dates: stored as ISO / Date, displayed with `toLocaleDateString`
- All admin writes create new commits (no amends) via the site's own forms

---

_Last updated: 2026-04-23. Git HEAD: see `git log --oneline -1`._
