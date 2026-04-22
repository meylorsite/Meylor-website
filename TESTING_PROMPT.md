# MEYLOR School Website — Full Testing Prompt (copy this to Claude web)

You are a QA tester for MEYLOR International School's website. Your job is to go through EVERY user flow end-to-end as if you were a real user of each type, then report back a complete findings list.

## Live URLs
- **Website**: https://glittery-kangaroo-a108ac.netlify.app
- **Backend API**: https://meylor-website.onrender.com/api

## Test Accounts

### 1. Super Admin (full admin panel access)
- Email: `admin@meylor.sa`
- Password: `Meylor@2026!`
- Role: SUPER_ADMIN
- Expected: redirects to `/admin` dashboard with full sidebar (Programs, News, Gallery, Team, Jobs, Users, Applications, Admissions, etc.)

### 2. Parent (portal access only)
- Email: `parent@meylor.sa`
- Password: `Parent@2026!`
- Role: PARENT
- Has 2 children registered (Sara Ahmad Grade 3, Omar Ahmad KG2)
- Expected: redirects to `/admin/portal` with limited sidebar (My Portal, Profile, My Applications, Programs)

### 3. Student (portal access only)
- Email: `student@meylor.sa`
- Password: `Student@2026!`
- Role: STUDENT
- Expected: redirects to `/admin/portal` with limited sidebar (My Portal, Profile, My Grades)

---

## Testing Tasks — Go through ALL of these in order

### PART A — Public Visitor (not logged in)

1. **Homepage (`/en`)**
   - Load the English homepage. Confirm hero section, stats, why-meylor pillars, programs carousel, facilities carousel, testimonials, news cards, gallery preview, CTA section, newsletter signup all render.
   - Check every card/section is **clickable** and navigates somewhere meaningful.
   - Switch to Arabic (`/ar`). Confirm RTL layout works, text isn't cut off at the bottom, all strings are Arabic (no English fallback text).

2. **About page (`/en/about`)**
   - Verify Vision/Mission/Values cards render from API.
   - Check "Our Story" section image loads (no broken image).
   - Verify Board of Directors and Leadership Team sections show dynamic data with photos.
   - Core Values + Timeline + Why Choose MEYLOR all render.

3. **Programs page (`/en/programs`)**
   - See 4 programs (Kindergarten, Primary, Middle, High).
   - Click on each card — it should **expand** showing: curriculum, class size, schedule, highlights, extracurriculars.
   - Verify the expand/collapse animation is smooth.

4. **Admissions page (`/en/admissions`)**
   - See pricing packages with features.
   - Click each package to see details.
   - Go through the **5-step wizard**:
     - Step 1: Select a package
     - Step 2: Accept terms & conditions (the checkbox must be required)
     - Step 3: Fill parent info (name, email, phone, relationship, nationality, national ID)
     - Step 4: Fill student info (name EN/AR, DOB, gender, grade, previous school)
     - Step 5: Review all data, then submit
   - Confirm success toast appears.
   - Check the FAQ accordion expands smoothly (no choppy animation).

5. **Careers page (`/en/careers`)**
   - See job listings.
   - Click a job card — it should expand showing: description, requirements, qualifications, benefits, salary range, experience required.
   - Click "Apply Now" and fill the application form. Submit it.

6. **Gallery page (`/en/gallery`)**
   - Click into a gallery activity.
   - Click an image to open the lightbox.
   - Click the **Download** icon — it should actually download the image (not just open in a new tab).
   - Click the Close icon to close the lightbox.

7. **Journey page (`/en/journey`)** — verify before/after images render.

8. **News page (`/en/news`)** — verify news cards, click into one article.

9. **Contact page (`/en/contact`)**
   - Fill and submit the contact form.
   - Fill and submit the complaint form (should generate a ticket number).

10. **Newsletter signup** (footer on any page) — submit an email.

### PART B — Admin Login & Dashboard

1. Go to `/en/admin/login`. Confirm the page says "Sign In" (not "Admin Panel"). The subtitle mentions "Parents, students, and administrators sign in here".
2. Log in with the Super Admin credentials.
3. Confirm you land on `/en/admin` (the dashboard).
4. Verify dashboard shows:
   - Welcome banner with date and greeting
   - 4 main stat cards (Messages, Complaints, Applications, Subscribers) with live counts
   - 8 content overview tiles (Programs, News, Gallery, etc.)
   - 3 recent activity columns (Messages, Complaints, Applications)
   - Recent Published News row with thumbnails
   - Quick Actions buttons
   - System Info bar
5. All the forms submitted in Part A should appear here:
   - Contact form → `/admin/contacts`
   - Complaint → `/admin/complaints`
   - Job application → `/admin/applications`
   - **Admission wizard submission → `/admin/admissions`** ⚠️ verify this specifically
   - Newsletter email → `/admin/newsletter`

### PART C — Admin CMS CRUD (test every module)

For each of these admin pages, perform: Create → Edit → Delete:

- `/admin/programs` — Add a test program, edit it, delete it
- `/admin/news` — Add a test news post with image URL
- `/admin/gallery` — Add a gallery activity **WITH MEDIA** (click the media-gallery field, add 2 photos with URLs and captions, save, then re-open to verify media persisted)
- `/admin/testimonials`
- `/admin/facilities`
- `/admin/team` — Add a board member and a leadership member
- `/admin/jobs` — Add a job with qualifications + benefits
- `/admin/pricing` — Add a package
- `/admin/sections` — Edit the homepage hero section, verify it updates on the public homepage
- `/admin/faqs` — Add an FAQ
- `/admin/stats` — Edit a stat counter
- `/admin/journey` — Add a timeline item with before/after images
- `/admin/users` — Add a new user with role PARENT or STUDENT
- `/admin/settings` — Update school contact info

**For each module, verify the change reflects IMMEDIATELY on the public site** (may need to hard refresh).

### PART D — Admin Profile

1. Click your name in the sidebar (or go to `/admin/profile`).
2. Update your profile (name, phone, nationality).
3. Try the "Change Password" section with wrong current password → should fail.
4. Change the password with correct values. Log out, log back in with new password. Then change it back to `Meylor@2026!`.

### PART E — Parent Flow (full user journey)

1. Log out from admin.
2. Log in at `/en/admin/login` with `parent@meylor.sa` / `Parent@2026!`.
3. Confirm you land on `/admin/portal` (NOT the admin dashboard).
4. Verify the sidebar shows only: My Portal, Profile, My Applications, Programs.
5. Verify the portal homepage shows:
   - Welcome banner: "Parent Portal" / "بوابة ولي الأمر"
   - Quick action buttons
   - **My Children section** listing Sara Ahmad (Grade 3) and Omar Ahmad (KG2)
   - Available Programs grid
   - Latest News
   - School contact
6. Click "My Profile" → try editing phone number → add a new child in the Children section → save → verify it persists after reload.
7. Click "My Applications" → should show empty state with "Start Application" CTA.
8. Click "Start Application" → takes you to `/en/admissions`.
9. Go through the full admission wizard. Submit.
10. Return to "My Applications" — **the new application should appear in the list** (pending status).
11. Log out.

### PART F — Student Flow

1. Log in with `student@meylor.sa` / `Student@2026!`.
2. Confirm you land on `/admin/portal`.
3. Verify the sidebar shows: My Portal, Profile, My Grades.
4. Try to navigate to `/admin/programs` (admin-only) — should redirect back to portal.
5. Try editing profile.
6. Log out.

### PART G — Language Switching

1. On ANY page, switch between EN and AR.
2. Verify:
   - Every piece of UI text is translated (no English leaking into Arabic)
   - RTL layout is correct (no broken spacing)
   - No Arabic letters are clipped at the bottom
   - Font renders correctly (should be Alexandria)

### PART H — Responsive

Test on mobile viewport (375px wide) and tablet (768px wide):
- Homepage
- Admin dashboard
- Admission wizard
- Programs page
- Gallery lightbox
- Admin sidebar (should collapse into a hamburger menu)

Nothing should overflow horizontally.

---

## Report Format

After you finish testing, send back a structured report with:

### ✅ What works
- List every flow that passed smoothly

### ⚠️ Issues found
For each issue, give:
- **Where** (exact page/URL and role)
- **What** (what you tried to do)
- **Expected** (what should happen)
- **Actual** (what actually happened)
- **Severity** (blocker / major / minor / cosmetic)
- **Screenshot suggestion** (what to screenshot)

### 🐛 Broken features
Any feature that is completely broken or missing.

### 💡 UX suggestions
Things that technically work but feel awkward or unclear.

### 🌐 Translation issues
Any English text that isn't translated in Arabic mode, or vice versa.

### 📱 Responsive issues
Anything that breaks on mobile/tablet.

Be thorough. Pretend you're a real parent researching the school for your child — go slowly and click everything.
