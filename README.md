# Stick&Dot — Auth Flow

A multi-step authentication UI built as part of a frontend assignment.

🔗 **Live Demo** → [stick-and-dot-app.vercel.app/signup](https://stick-and-dot-app.vercel.app/signup)

## Tech Stack
Next.js 14 (App Router) · TypeScript · TailwindCSS · Lucide React

## Pages Built
| Route | Description |
|---|---|
| `/signup` | Step 1 — Create account with email/password or OAuth |
| `/signup/otp` | Step 2 — 6-digit OTP verification |
| `/signup/details` | Step 3 — Add profile details |
| `/explore` | Post-auth explore page with dark theme |
| `/*` | Custom 404 page |

## Highlights
- Shared `AuthLayout` with role selector (Writer, Reader, Subject Expert, Client)
- OTP input with auto-focus, backspace navigation, and paste support
- Collapsible sidebar with active route detection
- Bottom-border-only inputs for a clean editorial feel

## Run Locally
```bash
npm install
npm run dev
