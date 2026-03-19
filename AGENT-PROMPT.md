# Implementation Prompt for AI Agent

## Context

This is a Next.js 14 (App Router) landing page for a crypto/DePIN waitlist project called **grovegrove**. Stack: TypeScript, Tailwind CSS, Framer Motion. The project is at `c:\Users\dyady\Desktop\grovegrove`.

Currently the landing page is a visual prototype — the waitlist form doesn't save data anywhere, referral codes are generated client-side randomly, spots counter is hardcoded in React state. We need to make it a real working waitlist engine.

---

## What You Need to Build

### 1. SQLite Database (persists across deploys)

Use `better-sqlite3` for synchronous SQLite in Next.js API routes.

**DB file location:** `./data/waitlist.db` — a `data/` folder at project root, **added to `.gitignore`** so it never gets committed and survives git pull + rebuild deploys.

**Schema:**

```sql
CREATE TABLE IF NOT EXISTS applicants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  twitter_handle TEXT,
  telegram_handle TEXT,
  source TEXT,             -- "twitter", "telegram", "friend", "other"
  status TEXT NOT NULL DEFAULT 'new',  -- "new", "confirmed", "rejected"
  referral_code TEXT UNIQUE,           -- generated ONLY when status becomes "confirmed"
  referred_by_code TEXT,               -- referral code of the person who referred them
  ip_address TEXT,
  user_agent TEXT,
  admin_notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  confirmed_at TEXT,
  email_sent_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_applicants_referral_code ON applicants(referral_code);
CREATE INDEX IF NOT EXISTS idx_applicants_referred_by ON applicants(referred_by_code);
```

**Critical:** Create a `src/lib/db.ts` module that:
- Creates `./data/` directory if it doesn't exist (using `fs.mkdirSync`)
- Opens/creates the SQLite database at `./data/waitlist.db`
- Runs the CREATE TABLE IF NOT EXISTS on initialization
- Exports the db instance for use in API routes
- Uses `better-sqlite3` (NOT `sql.js`, NOT async sqlite — `better-sqlite3` is synchronous and works perfectly in Next.js API routes on Node.js)

**Important for deploys:** The `data/` folder and `waitlist.db` file live on disk outside of git. When new code is pushed and the app rebuilds, the database file stays intact. Add to `.gitignore`:
```
/data/
```

---

### 2. Public API Routes

#### `POST /api/waitlist/apply`

**Request body:**
```json
{
  "email": "user@example.com",
  "twitter": "@handle",       // optional
  "telegram": "username",     // optional
  "source": "twitter",        // "twitter" | "telegram" | "friend" | "other"
  "ref": "GRV-XXXXXX"        // optional, referral code from URL
}
```

**Logic:**
1. Validate email (regex, required)
2. Sanitize all inputs (trim, lowercase email)
3. Check for duplicate email — if exists, return `{ success: false, error: "already_applied" }`
4. Rate limit: Check if same IP applied in last 30 minutes — if yes, return `{ success: false, error: "rate_limited" }`
5. If `ref` is provided, verify it exists in DB as a confirmed user's referral_code. Store in `referred_by_code` if valid, ignore if invalid.
6. Insert into DB with status `"new"`. Do NOT generate referral_code yet.
7. Return `{ success: true, position: <total count of applicants> }`

**Important:** Do NOT return referral_code or referral link at signup. The user only gets their referral code when they are confirmed by admin.

#### `GET /api/waitlist/stats`

**Public endpoint, no auth.**

Returns:
```json
{
  "total_spots": 500,
  "applied": 153,       // COUNT(*) from applicants
  "confirmed": 42,      // COUNT(*) WHERE status = 'confirmed'
  "remaining": 347      // 500 - applied
}
```

Cache this response for 30 seconds (use a simple in-memory cache variable with timestamp, or Next.js `revalidate`).

---

### 3. Admin API Routes (protected)

All admin routes must be protected with a simple secret token. Check `Authorization: Bearer <token>` header against `ADMIN_SECRET` environment variable.

Create a helper `src/lib/admin-auth.ts` that validates the header and returns 401 if invalid.

#### `GET /api/admin/applicants`

Query params: `?status=new&page=1&limit=50&search=`

Returns paginated list of applicants with all fields. Default sort: newest first.

#### `PATCH /api/admin/applicants/[id]`

**Request body:**
```json
{
  "status": "confirmed",     // or "rejected"
  "admin_notes": "KOL, 5k followers"  // optional
}
```

**Logic when status changes to "confirmed":**
1. Generate unique referral code: `GRV-${6 random alphanumeric chars uppercase}`
2. Set `confirmed_at` to current datetime
3. Set `referral_code` to generated code
4. Send confirmation HTML email (see Email section below)
5. Set `email_sent_at` to current datetime
6. Return updated applicant

**Logic when status changes to "rejected":**
1. Set status to "rejected"
2. Do NOT send email
3. Return updated applicant

#### `GET /api/admin/stats`

Returns:
```json
{
  "total": 153,
  "new": 98,
  "confirmed": 42,
  "rejected": 13,
  "today_applied": 7,
  "referral_sources": { "twitter": 45, "telegram": 30, "friend": 50, "other": 28 }
}
```

#### `POST /api/admin/applicants/[id]/send-email`

Manually re-send the confirmation email to an already confirmed user.

---

### 4. Email Sending

Use **Resend** (https://resend.com) — free tier, 100 emails/day, perfect for this stage. Install `resend` npm package.

Environment variable: `RESEND_API_KEY`
From address: `onboarding@resend.dev` (default for testing) or custom domain later.

Create `src/lib/email.ts` with a function:

```typescript
async function sendConfirmationEmail(params: {
  to: string;
  referralCode: string;
  position: number;
}) 
```

**HTML email template** — inline styles, simple, clean design matching the site's aesthetic (white bg, green accent #16A34A, DM Sans feel). Content:

Subject: "You're confirmed — here's your grovegrove access"

Body:
- grovegrove logo/name
- "Welcome to the grove."
- "Your early access has been confirmed. You're one of the first [position] people in the network."
- "Your personal referral link:" — big green box with `https://grovegrove.com/?ref=GRV-XXXXXX`
- "Share this link. Each person who joins through you strengthens your position."
- "What happens next:" — numbered list:
  1. "We'll send you the extension download link when it's ready"
  2. "Share your referral link to climb the ranks"
  3. "Stay tuned — the first participants get the strongest position"
- "Follow us:" — X, Telegram links
- Footer: "© 2026 grovegrove"

The HTML email should be a well-formatted template string in the code. Use inline CSS (email clients don't support external CSS). Keep it simple and clean.

---

### 5. Admin Panel (UI)

Create a minimal but functional admin panel at `/admin` route.

**Auth:** Simple password gate. When visiting `/admin`, show a password input. Check against `ADMIN_SECRET` env var via an API call `POST /api/admin/auth` that returns a session token (store in localStorage). All subsequent admin API calls use this token.

Alternatively (simpler): just use the ADMIN_SECRET as a bearer token entered once on the admin page and stored in localStorage. No session management needed.

**Admin page layout:**

Top bar: "grovegrove admin" + stats (total / new / confirmed / rejected)

Main content: Table of applicants with columns:
- # (id)
- Email
- Twitter
- Telegram  
- Source
- Status (colored badge: new=gray, confirmed=green, rejected=red)
- Referred by (show code if any)
- Applied (relative time)
- Actions

**Actions per row:**
- "Confirm" button (green) — calls PATCH with status "confirmed", triggers email
- "Reject" button (red) — calls PATCH with status "rejected"
- Notes field — editable inline or via modal

**Filters:** Tabs or buttons for "All", "New", "Confirmed", "Rejected"

**Search:** Search by email or twitter handle

**Design:** Keep it minimal. Dark sidebar or simple top nav. Use the same Tailwind config. The admin page does NOT need Framer Motion animations — keep it functional and fast.

**IMPORTANT:** The admin page is a client component that makes API calls. It's NOT server-rendered with sensitive data. All data flows through the authenticated API routes.

---

### 6. Modify Existing Landing Page Components

#### Update `src/lib/grove-context.tsx`

Remove ALL fake state logic:
- Remove hardcoded `spotsClaimed: 153`
- Remove the `setInterval` that randomly increments spots
- Remove client-side rank generation
- Remove client-side referral code generation

New state should:
- Fetch stats from `GET /api/waitlist/stats` on mount
- `signup()` function calls `POST /api/waitlist/apply` with form data
- On successful apply: show success modal with position number
- Track `isSignedUp` in localStorage so returning users see their status
- Do NOT show referral code at signup — user doesn't have one yet

#### Update `src/components/waitlist-form.tsx`

Change the form to collect:
- Email (required) — text input
- Twitter/X handle (optional) — text input with @ prefix hint
- Telegram username (optional) — text input
- "How did you find us?" (required) — small dropdown/select: "Twitter/X", "Telegram", "A friend", "Other"

Keep the form compact — these fields should still feel like a quick apply, not a long form. Use a single-column layout inside the rounded form container. The submit button text should be "Apply for Early Access".

The form should also read `?ref=` from the URL (using `useSearchParams`) and pass it to the API.

#### Update `src/components/signup-success-modal.tsx`

After successful signup, show:
- "Application received."
- "You're #[position] in the queue."
- "Status: Under review"
- "We'll email you when you're confirmed — with your personal referral link and next steps."
- Remove the referral link section entirely
- Remove share buttons (user has nothing to share yet — they get their referral link only after confirmation via email)
- Keep confetti animation for dopamine hit

#### Update `src/components/scarcity-section.tsx`

Use real stats from the context (which now fetches from API):
- `applied` count from API
- `remaining` = 500 - applied
- Percentage bar based on real data

#### Update `src/components/sticky-cta.tsx`

Use real remaining spots from API stats.

---

### 7. Environment Variables

Create `.env.local` (added to `.gitignore`):

```
ADMIN_SECRET=<generate a random 32-char string>
RESEND_API_KEY=<from resend.com dashboard>
NEXT_PUBLIC_SITE_URL=https://grovegrove.com
```

Also create `.env.example` with placeholder values for documentation:

```
ADMIN_SECRET=your-secret-admin-token-here
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://grovegrove.com
```

---

### 8. Packages to Install

```bash
npm install better-sqlite3 resend
npm install -D @types/better-sqlite3
```

---

### 9. File Structure (new/modified files)

```
NEW FILES:
  src/lib/db.ts                        — SQLite connection + schema init
  src/lib/admin-auth.ts                — Admin auth helper
  src/lib/email.ts                     — Resend email sending + HTML template
  src/app/api/waitlist/apply/route.ts  — POST apply endpoint
  src/app/api/waitlist/stats/route.ts  — GET stats endpoint
  src/app/api/admin/auth/route.ts      — POST admin login
  src/app/api/admin/applicants/route.ts — GET list applicants
  src/app/api/admin/applicants/[id]/route.ts — PATCH update status
  src/app/api/admin/applicants/[id]/send-email/route.ts — POST resend email
  src/app/api/admin/stats/route.ts     — GET admin stats
  src/app/admin/page.tsx               — Admin panel UI
  .env.example                         — Environment variable template
  data/                                — Directory for SQLite DB (gitignored)

MODIFIED FILES:
  src/lib/grove-context.tsx            — Real API calls instead of fake state
  src/components/waitlist-form.tsx      — Extended form fields
  src/components/signup-success-modal.tsx — No referral link, queue message
  src/components/scarcity-section.tsx   — Real stats from API
  src/components/sticky-cta.tsx         — Real stats from API
  .gitignore                           — Add /data/ and .env.local
```

---

### 10. Important Implementation Details

1. **`better-sqlite3` is synchronous** — no async/await needed for DB calls. This is a feature, not a bug. It's faster and simpler in API routes.

2. **DB initialization pattern in `src/lib/db.ts`:**
```typescript
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, 'waitlist.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS applicants (
    ... schema from above ...
  );
  ... indexes ...
`);

export default db;
```

3. **API Route pattern (Next.js App Router):**
```typescript
// src/app/api/waitlist/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // ... logic ...
  return NextResponse.json({ success: true, position: 123 });
}
```

4. **Admin auth pattern:**
```typescript
// src/lib/admin-auth.ts
import { NextRequest } from 'next/server';

export function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  return auth.slice(7) === process.env.ADMIN_SECRET;
}
```

5. **Referral code generation (only at confirmation):**
```typescript
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let code = 'GRV-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
```
Verify uniqueness in DB before assigning.

6. **Rate limiting pattern:** Store IP + timestamp in a simple in-memory Map (resets on server restart — that's fine for this stage). Or check last application from same IP in DB.

7. **The admin panel** should be a `"use client"` page component that:
   - On mount, checks localStorage for admin token
   - If no token, shows login form
   - If token exists, fetches applicants list
   - Handles all CRUD via fetch() calls to admin API routes

8. **localStorage for returning visitors on landing page:**
   - After successful apply, store `{ email, position, appliedAt }` in localStorage
   - On page load, if localStorage has data, show "You've already applied" state
   - The waitlist form shows "View Your Application" button instead of the form

9. **URL ref parameter handling:**
   - On the main page (`/`), read `?ref=GRV-XXXXXX` from URL using `useSearchParams()`
   - Store in context/state
   - Pass to API when submitting the form
   - No separate `/join` route needed — the main page handles `?ref=`

10. **Email sending should not block the API response.** Call the email function but don't await it in the response path (or handle errors gracefully — log them but still return success for the status update).

---

### 11. What NOT to Do

- Do NOT use Prisma (overkill for SQLite + simple schema)
- Do NOT use NextAuth (overkill for single-admin auth)
- Do NOT create a separate frontend app for admin (just a Next.js page)
- Do NOT store ADMIN_SECRET or RESEND_API_KEY in client-side code
- Do NOT expose internal scoring or admin logic to the client
- Do NOT add user-facing referral link at signup time
- Do NOT create fake/simulated data — all numbers must come from the real DB
- Do NOT delete or restructure existing visual components that aren't listed in modified files — keep the landing page look and feel intact
- Do NOT add any npm packages beyond `better-sqlite3`, `resend`, and `@types/better-sqlite3`

---

### 12. Testing Checklist

After implementation, verify:
- [ ] `npm run build` succeeds without errors
- [ ] Landing page loads, form is visible with all fields
- [ ] Submitting form with email saves to SQLite DB
- [ ] Submitting duplicate email returns appropriate error
- [ ] `GET /api/waitlist/stats` returns real counts
- [ ] Scarcity section shows real numbers
- [ ] Success modal shows position, no referral link
- [ ] Returning visitor (localStorage) sees "already applied" state
- [ ] `/admin` shows login form
- [ ] Entering correct ADMIN_SECRET shows applicant list
- [ ] Clicking "Confirm" on an applicant changes status and generates referral code
- [ ] Confirmation triggers email send (check Resend dashboard)
- [ ] `?ref=GRV-XXXXXX` parameter is captured and stored
- [ ] `data/waitlist.db` file is created in `data/` folder
- [ ] `data/` folder is in `.gitignore`
- [ ] No sensitive keys in client-side code (check page source)
