# FIT ID Demo Commerce

Three fictional storefronts backed by one FIT ID network:

- MORROW — refined essentials
- ARCHIVE 92 — street / utility
- PLAIN LAB — everyday basics

The storefronts are intentionally one multi-tenant Next.js codebase. Each product links to the live FIT ID Consumer app with its Product Code, demonstrating reuse of the same FIT ID across different shopping malls.

## Local

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` to read the live Supabase catalog. Without env values, the app falls back to the same demo catalog seeded in Supabase.

## Routes

- `/morrow`
- `/archive92`
- `/plainlab`
- `/[brand]/product/[productCode]`
