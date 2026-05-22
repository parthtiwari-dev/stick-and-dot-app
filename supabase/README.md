# Supabase Setup

1. Create a Supabase project.
2. Run `schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. In Authentication > URL Configuration, add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - your deployed site URL plus `/auth/callback`
5. Enable Google, Facebook, and Apple providers after adding each provider's client credentials.
6. For the existing OTP screen, configure the signup email template to include the numeric token.

