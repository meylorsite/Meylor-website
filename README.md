# MEYLOR School - Full-Stack Web Platform

A production-ready, full-stack web platform for **MEYLOR School**, a premium educational institution in Al-Naeem District, Jeddah, Saudi Arabia. Serving students from **KG to Grade 12**.

## Tech Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript                 |
| Database | MongoDB Atlas (Mongoose)                     |
| i18n     | next-intl (Arabic + English, RTL/LTR)        |
| Auth     | JWT (Access + Refresh Token rotation)        |
| State    | Zustand                                       |
| UI       | Framer Motion, Lucide Icons, Swiper          |

## Project Structure

```
/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/       # DB & env config
│   │   ├── controllers/  # CRUD factory
│   │   ├── middleware/    # Auth, error, validation
│   │   ├── models/       # Mongoose models (16 models)
│   │   ├── routes/       # Auth, Admin, Public routes
│   │   ├── utils/        # JWT, error helpers
│   │   ├── validators/   # Zod schemas
│   │   ├── seed.ts       # Database seeder
│   │   └── index.ts      # Server entry
│   └── package.json
│
├── frontend/         # Next.js application
│   ├── src/
│   │   ├── app/[locale]/ # All pages (i18n routing)
│   │   │   ├── admin/    # Admin dashboard (CMS)
│   │   │   ├── about/
│   │   │   ├── programs/
│   │   │   ├── admissions/
│   │   │   ├── gallery/
│   │   │   ├── journey/
│   │   │   ├── careers/
│   │   │   ├── contact/
│   │   │   └── news/
│   │   ├── components/   # Reusable components
│   │   ├── lib/          # API client, auth store, utils
│   │   ├── messages/     # en.json, ar.json translations
│   │   └── i18n.ts       # i18n config
│   └── package.json
│
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas connection string
- npm

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env    # Edit with your MongoDB URI
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure Environment

**Backend `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/meylor
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@meylor.sa
ADMIN_PASSWORD=ChangeMe123!
```

**Frontend `.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 1 Super Admin user
- Site settings
- 4 Programs, 6 Facilities, 6 Testimonials
- 8 News posts, 5 Gallery activities (each with 8 media)
- 6 Journey items, 4 Pricing packages, 4 Job posts
- Stat counters and page sections

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/en/admin

### Default Admin Login

- Email: `admin@meylor.sa`
- Password: `ChangeMe123!`

## Features

### Public Website
- Premium responsive design with dark/white alternating sections
- Animated hero with floating elements and blob shapes
- Programs showcase (KG, Primary, Middle, High School)
- Facilities grid with hover animations
- Testimonials section with star ratings
- News & Events with category filtering
- Gallery with activity albums and lightbox
- Journey timeline with before/after images
- Admissions with pricing packages and steps
- Careers with job listings and application forms
- Contact with general inquiry + complaint ticket system
- Newsletter subscription
- Google Maps integration
- Full Arabic (RTL) and English (LTR) support

### Admin Panel (CMS)
- Secure JWT authentication with token refresh
- Dashboard with key metrics
- Full CRUD for all 16 entities
- Bilingual field management (EN/AR side by side)
- Search, pagination, and filtering
- Visibility toggles
- Delete confirmation dialogs
- Toast notifications
- Site settings management (logo, SEO, social links)

### Backend API
- RESTful architecture
- JWT access + refresh token with rotation
- Zod validation
- Rate limiting (auth, forms)
- CORS, Helmet security headers
- Morgan request logging
- Global error handling
- MongoDB with Mongoose

## API Endpoints

| Route              | Description            |
|--------------------|------------------------|
| POST /api/auth/login    | Admin login       |
| POST /api/auth/refresh  | Token refresh     |
| GET /api/public/*       | Public data       |
| POST /api/public/contact     | Contact form |
| POST /api/public/complaints  | Complaint ticket |
| POST /api/public/applications| Job application |
| POST /api/public/newsletter  | Newsletter sub |
| GET/POST/PUT/DELETE /api/admin/* | Admin CRUD |

## Brand Colors

| Color             | Hex       | Usage                  |
|-------------------|-----------|------------------------|
| Dark Azure        | #003A83   | Primary, headers       |
| Spanish Sky Blue  | #01A9E4   | Accent, links          |
| Amber             | #FFBF00   | Limited accent         |
| Chilli Red        | #FF2B01   | Errors, warnings       |
| Philippine Green  | #007F44   | Success states         |
