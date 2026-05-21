# BizCraft AI — AI Business-in-a-Box

> Turn an idea into a complete online business in under 60 seconds.

BizCraft AI is a generative SaaS platform that converts natural language business ideas into fully structured, deployable digital businesses using a multi-provider AI routing system with guaranteed fallback safety.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [AI System Architecture](#ai-system-architecture)
- [Database](#database)
  - [Schema](#schema)
  - [How to Access the Database](#how-to-access-the-database)
  - [View Users](#view-users)
  - [View Businesses](#view-businesses)
  - [View Products & Marketing Assets](#view-products--marketing-assets)
- [API Routes](#api-routes)
- [Pages & Navigation](#pages--navigation)
- [Dynamic Storefront Design](#dynamic-storefront-design)
- [Light/Dark Mode](#lightdark-mode)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## Overview

A user types a prompt like:

> *"I want to sell skincare products for busy women in Lagos"*

BizCraft generates a complete business including:

- **Brand identity** — name, niche, tone, value proposition, colors, logo emoji
- **Product catalog** — 3-10 products with pricing, descriptions, categories
- **Landing page** — hero, features, testimonials, FAQs with unique visual design
- **Marketing campaigns** — emails, ads, social media posts for multiple platforms

All outputs are structured, validated via Zod schemas, and instantly deployed as a live web storefront.

---

## Features

| Feature | Description |
|---|---|
| **AI Business Generator** | Single prompt generates full structured business |
| **Product Generator** | Auto-generates 3-10 products with pricing strategy |
| **Landing Page Generator** | Creates full storefront with dynamic visual design |
| **Marketing Engine** | Generates emails, ads, Instagram/TikTok/LinkedIn posts |
| **Checkout Simulation** | Mock Paystack-style checkout flow |
| **User Authentication** | Email/password auth with session persistence |
| **Dashboard** | Manage all generated businesses in one place |
| **AI Router** | Multi-provider routing: Groq → Ollama → Mock fallback |
| **Zod Validation** | Two-phase validation ensures valid structured output |
| **Dynamic Storefronts** | Each business gets a unique layout, card style, typography, section order |
| **Light/Dark Mode** | Full theme switching with system preference detection |
| **Guaranteed Fallback** | System always works even without internet or API keys |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + CSS Variables |
| **Theme** | next-themes (light/dark/system) |
| **Database** | SQLite via Prisma ORM |
| **Auth** | NextAuth.js (Credentials provider) |
| **Password Hashing** | bcryptjs |
| **Validation** | Zod v4 |
| **AI Providers** | Groq (primary), Ollama (local), Mock (fallback) |
| **Icons** | Lucide React |
| **Font** | Geist Sans + Geist Mono |

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema (User, Business, Product, MarketingAsset)
│   ├── dev.db                 # SQLite database file
│   └── migrations/            # Prisma migration history
├── src/
│   ├── app/
│   │   ├── page.tsx           # Public landing page (with auth-aware header)
│   │   ├── layout.tsx         # Root layout with theme + auth providers
│   │   ├── globals.css        # CSS variables for theming + animations
│   │   ├── not-found.tsx      # 404 page
│   │   ├── loading.tsx        # Loading spinner
│   │   ├── login/page.tsx     # Sign-in page
│   │   ├── signup/page.tsx    # Registration page
│   │   ├── create/page.tsx    # AI generation page (protected)
│   │   ├── dashboard/page.tsx # User workspace (protected)
│   │   ├── dashboard/[id]/page.tsx          # Business detail view (protected)
│   │   ├── dashboard/[id]/marketing/page.tsx # Marketing assets viewer (protected)
│   │   ├── business/[id]/
│   │   │   ├── page.tsx                     # Server component for storefront
│   │   │   └── StorefrontClient.tsx         # Dynamic storefront with design tokens
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │       ├── auth/signup/route.ts         # User registration endpoint
│   │       ├── generate/route.ts            # AI business generation (protected)
│   │       ├── business/[id]/route.ts       # Fetch business by ID
│   │       └── checkout/route.ts            # Mock checkout processing
│   ├── components/
│   │   ├── AuthProvider.tsx   # Theme + Session providers
│   │   ├── ThemeToggle.tsx    # Light/dark mode toggle button
│   │   ├── CheckoutModal.tsx  # Simulated payment modal
│   │   └── CopyButton.tsx     # Copy-to-clipboard button
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client singleton
│   │   └── ai/
│   │       ├── types.ts       # Zod schemas for all AI outputs
│   │       ├── router.ts      # AI Router (provider selection, retry, normalization)
│   │       └── providers/
│   │           ├── groq.ts    # Groq API provider
│   │           ├── ollama.ts  # Ollama local provider
│   │           └── mock.ts    # Template mock fallback provider
│   └── middleware.ts           # Route protection middleware
├── .env                        # Environment variables (not committed)
├── .env.example                # Template for environment variables
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# NextAuth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your-secret-key-here

# Groq API Key (primary AI provider)
# Get one at https://console.groq.com
GROQ_API_KEY=your-groq-key

# Ollama Configuration (local AI provider, optional)
OLLAMA_MODEL=llama3
OLLAMA_TIMEOUT=25
```

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AUTH_SECRET` | Yes | Secret for NextAuth JWT signing. Generate with `openssl rand -base64 32` |
| `GROQ_API_KEY` | No* | Groq API key for AI generation. Without it, falls back to Ollama or Mock |
| `OLLAMA_MODEL` | No | Model name for Ollama. Default: `llama3` |
| `OLLAMA_TIMEOUT` | No | Timeout in seconds for Ollama requests. Default: `25` |

*Not strictly required — the Mock provider guarantees the system always works.

---

## Authentication

### How it works

- **Provider**: NextAuth.js Credentials provider
- **Storage**: Email + bcrypt-hashed password in SQLite
- **Session**: JWT-based, stored in encrypted cookie
- **Persistence**: Sessions persist across browser restarts

### Protected routes

Only authenticated users can access:

- `/create` — AI business generation
- `/dashboard` — User workspace
- `/dashboard/[id]` — Business detail view
- `/dashboard/[id]/marketing` — Marketing assets viewer
- `/api/generate` — AI generation endpoint

Public routes (no auth required):

- `/` — Landing page
- `/login` — Sign in
- `/signup` — Register
- `/business/[id]` — Public storefront (read-only)

### Middleware

Route protection is handled in `src/middleware.ts`. Unauthenticated users trying to access protected routes are redirected to `/login` with a `callbackUrl` parameter.

---

## AI System Architecture

### Provider Priority Chain

```
User Prompt
    ↓
AI Router (src/lib/ai/router.ts)
    ↓
Health Check + Latency Scoring
    ↓
Groq (primary) → Ollama (local) → Mock (guaranteed fallback)
    ↓
Zod Validation (Phase 1)
    ↓
Output Normalization
    ↓
Zod Validation (Phase 2)
    ↓
Database Storage
    ↓
Frontend Rendering
```

### AI Router Rules

1. **Single entry point** — All AI calls go through `routerInstance.generateContent()`
2. **Health checks** — Pings providers on startup and every 60 seconds
3. **Latency tracking** — Rolling average of last 5 requests per provider
4. **Retry logic** — Up to 2 attempts per provider before falling back
5. **Normalization** — Fills missing fields (e.g., secondary color, default FAQs)
6. **Double validation** — Zod validates before AND after normalization

### Design Token Generation

The AI generates **design decisions** alongside content, making every storefront visually unique:

| Token | Options | Effect |
|---|---|---|
| `layout` | `centered`, `split`, `minimal`, `bold` | Hero section layout |
| `cardStyle` | `rounded`, `sharp`, `pill` | Border radius on all cards |
| `heroBg` | `solid`, `gradient`, `pattern`, `none` | Hero background style |
| `typography` | `clean`, `elegant`, `bold` | Heading font weights |
| `dividerStyle` | `line`, `dots`, `none` | Section separators |
| `sectionOrder` | shuffled array | Order of page sections |
| `showTestimonials` | `true`/`false` | Whether to render testimonials |
| `showFaqs` | `true`/`false` | Whether to render FAQs |
| `showAbout` | `true`/`false` | Whether to render about section |

### Resilience Guarantee

The system **always functions** even without:
- Internet connection
- Groq API key
- Ollama running

The Mock provider generates complete, valid businesses from built-in templates keyed to industry detection.

---

## Database

### Schema

```prisma
model User {
  id         String     @id @default(uuid())
  email      String     @unique
  password   String?    // bcrypt hashed
  createdAt  DateTime   @default(now())
  businesses Business[]
}

model Business {
  id              String           @id @default(uuid())
  userId          String?
  user            User?            @relation(fields: [userId], references: [id])
  name            String
  niche           String
  tagline         String
  brandColor      String           // Hex color code
  secondaryColor  String?          // Optional hex color code
  logoEmoji       String
  valueProp       String
  aboutText       String
  tone            String           // luxury, casual, premium, local, tech
  landingPageJson String           // Serialized JSON with content + design tokens
  createdAt       DateTime         @default(now())
  products        Product[]
  marketingAssets MarketingAsset[]
}

model Product {
  id          String   @id @default(uuid())
  businessId  String
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  title       String
  price       Float
  description String
  category    String
  imageEmoji  String
}

model MarketingAsset {
  id         String   @id @default(uuid())
  businessId String
  business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  type       String   // 'email', 'ad', 'post'
  title      String
  content    String   // The copy text
  platform   String   // Instagram, TikTok, Email, Facebook, LinkedIn
}
```

### How to Access the Database

The database is **SQLite** stored at `prisma/dev.db`.

#### Option 1: Prisma Studio (Recommended)

```bash
npx prisma studio
```

Opens a visual database browser at `http://localhost:5555` where you can:
- Browse all tables (User, Business, Product, MarketingAsset)
- View, edit, and delete records
- Run raw SQL queries
- See relationships between records

#### Option 2: Prisma CLI

```bash
# View all users
npx prisma db execute --file query.sql

# Open interactive REPL
npx prisma studio
```

#### Option 3: Direct SQLite

```bash
# Install sqlite3 CLI if not available
# macOS: brew install sqlite
# Windows: download from https://www.sqlite.org/download.html

sqlite3 prisma/dev.db

# Inside sqlite3:
.tables                    # List all tables
.schema User               # Show User table schema
SELECT * FROM User;        # View all users
SELECT * FROM Business;    # View all businesses
SELECT * FROM Product;     # View all products
SELECT * FROM MarketingAsset;  # View all marketing assets
.exit                      # Exit
```

#### Option 4: VS Code Extension

Install the **SQLite Viewer** extension in VS Code, then click on `prisma/dev.db` to browse visually.

### View Users

```bash
npx prisma studio
# Click "User" table to see all registered users
# Columns: id, email, password (hashed), createdAt
```

Or via Prisma Client in Node:

```ts
import prisma from './src/lib/db';

const users = await prisma.user.findMany({
  include: { _count: { select: { businesses: true } } },
});

console.log(users);
// [
//   { id: 'uuid', email: 'user@example.com', password: '$2b$10...', createdAt: Date, _count: { businesses: 3 } }
// ]
```

### View Businesses

```bash
npx prisma studio
# Click "Business" table
# Columns: id, userId, name, niche, tagline, brandColor, secondaryColor, logoEmoji, valueProp, aboutText, tone, landingPageJson, createdAt
```

To see a business's landing page JSON (content + design tokens):

```ts
const biz = await prisma.business.findUnique({
  where: { id: 'business-uuid-here' },
});
console.log(JSON.parse(biz.landingPageJson));
```

### View Products & Marketing Assets

```bash
npx prisma studio
# Click "Product" or "MarketingAsset" table
# Filter by businessId to see items for a specific business
```

Or query with relations:

```ts
const biz = await prisma.business.findUnique({
  where: { id: 'business-uuid-here' },
  include: {
    products: true,
    marketingAssets: true,
    user: true,
  },
});
```

---

## API Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | No | NextAuth handler (sign in, sign out, session) |
| `/api/auth/signup` | POST | No | Create new user account |
| `/api/generate` | POST | Yes | Generate a complete business from a prompt |
| `/api/business/[id]` | GET | No | Fetch a business by ID (public storefront data) |
| `/api/checkout` | POST | No | Process mock checkout transaction |

### `/api/generate` Request

```json
{
  "prompt": "I want to sell hand-thrown ceramic mugs in Lagos"
}
```

### `/api/generate` Response

```json
{
  "success": true,
  "businessId": "uuid-here",
  "business": { /* full business object with products and marketingAssets */ }
}
```

### `/api/checkout` Request

```json
{
  "productId": "product-uuid",
  "email": "customer@example.com",
  "name": "Customer Name"
}
```

---

## Pages & Navigation

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with gradient square background, auth-aware header |
| `/login` | Public | Sign-in form |
| `/signup` | Public | Registration form with password confirmation |
| `/create` | Protected | AI generation page — enter prompt, watch progress, get results |
| `/dashboard` | Protected | User workspace — list of all generated businesses |
| `/dashboard/[id]` | Protected | Business detail — products, marketing summary, links |
| `/dashboard/[id]/marketing` | Protected | Full marketing copy viewer with copy-to-clipboard |
| `/business/[id]` | Public | Live storefront — unique design per business |
| `/_not-found` | Public | 404 page |

---

## Dynamic Storefront Design

Every generated business gets a **visually unique storefront**. The AI determines:

- **Layout** — centered hero, split two-column, minimal sparse, or bold dark
- **Cards** — soft rounded, sharp corners, or pill-shaped
- **Hero background** — solid brand color, gradient, dot pattern, or plain
- **Typography** — clean modern, elegant light, or bold heavy
- **Section order** — features, products, testimonials, about, FAQs arranged uniquely
- **Section visibility** — some businesses show testimonials, others hide them
- **Dividers** — thin lines, dot rows, or no separators between sections

This means two businesses generated from the same prompt will look completely different.

---

## Light/Dark Mode

- **Default**: Dark mode
- **Toggle**: Sun/moon icon in every page header
- **System**: Respects OS preference if set to "system"
- **Persistence**: Saved to localStorage
- **Implementation**: `next-themes` with CSS variables

All colors use CSS custom properties (`--background`, `--foreground`, `--card`, `--border`, etc.) defined in `globals.css` with separate values for light and dark themes.

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npx prisma studio  # Open database GUI
npx prisma migrate dev  # Run pending migrations
npx prisma generate     # Regenerate Prisma client
```

---

## Deployment

### Prerequisites

1. Set all environment variables in your hosting platform
2. Generate a strong `AUTH_SECRET`: `openssl rand -base64 32`
3. Add your `GROQ_API_KEY`

### Vercel (Recommended)

```bash
vercel deploy
```

The project is optimized for Vercel with:
- Automatic HTTPS
- Edge-compatible middleware
- Serverless function support
- SQLite works via file storage (for production, consider PostgreSQL)

### For Production Database

SQLite is fine for development and small deployments. For production with multiple users:

1. Change the Prisma provider to PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set `DATABASE_URL` in your environment
3. Run `npx prisma migrate deploy`

---

## Troubleshooting

### Groq API not working
- Verify your key at https://console.groq.com
- Check `.env` has `GROQ_API_KEY=` set (no quotes)
- Restart the dev server after changing `.env`
- The system will fall back to Mock if Groq fails

### Auth not persisting
- Ensure `AUTH_SECRET` is set in `.env`
- Clear browser cookies and log in again

### Database locked error (Windows)
- Kill all Node processes: `taskkill /F /IM node.exe`
- Run `npx prisma generate` again

### Port already in use
```bash
# Find process on port 3000
netstat -ano | findstr :3000
# Kill it
taskkill /F /PID <PID>
```
