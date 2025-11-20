**AM News — Next.js News Platform**

A modern news publishing application built with Next.js (App Router) and Supabase. This repository contains the frontend, admin UI, API route handlers, and Supabase integration used to manage and serve articles for AM News.

**Project Objective**

- **Goal**: Provide an easy-to-run CMS-style news site with an admin dashboard to create, edit, and list articles that are served via Next.js API routes and Supabase.
- **Audience**: Developers and product teams building a lightweight news platform or integrating editorial workflows with Supabase.

**Key Features**

- **Admin dashboard**: Create, edit, delete and list articles from a dedicated admin area (`/admin`).
- **Public article pages**: SEO-friendly article pages under `app/articles/[slug]` with server-side data fetching.
- **Rich text editor**: TipTap-based editor for article content and images.
- **Supabase integration**: Authentication and database (articles, authors, categories) powered by Supabase.
- **Modern stack**: Next.js (App Router), TypeScript, Tailwind CSS tooling, and a small component library.

**Tech Stack**

- **Framework**: `next` (App Router, Server Components)
- **Language**: TypeScript
- **Database/Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Editor**: TipTap (`@tiptap/react`)
- **UI**: Radix primitives, lucide icons, and utility-first styling (Tailwind tooling present)

**Repository Structure**

```
src/
	app/                      # Next.js App Router pages + API routes
		api/                    # Route handlers (server-side API wrappers)
		admin/                  # Admin routes (dashboard, create, edit)
		articles/               # Public article pages
	components/               # Reusable UI + admin components
	utils/supabase/           # Supabase client & server helpers
	services/                 # Data access (articleService.ts)
	contexts/                 # React contexts (Auth, Theme)
docs/
	SUPABASE_ENV.md           # Instructions for Supabase env variables
README.md
package.json
```

Notes:

- The primary app lives in `src/app` using Next.js App Router features (Server Components + Route Handlers).
- Admin API routes sit under `src/app/api/admin` and use the server-side supabase client (`src/utils/supabase/server.ts`).

**Getting Started (Local Development)**

Follow these steps to run the project locally on Windows (bash / WSL / Git Bash):

1. Install dependencies

```bash
# from project root
npm install
```

2. Configure environment variables

- Copy or create a `.env.local` file at the project root and add Supabase values. See `docs/SUPABASE_ENV.md` for exact variable names and how to get them from your Supabase project.

The project expects at least:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the dev server

```bash
npm run dev
# Open http://localhost:3000
```

4. Admin access

- The admin UI is available under `http://localhost:3000/admin` (authentication depending on your Supabase setup).

**Scripts**

- `npm run dev`: Start Next.js in development mode.
- `npm run build`: Build the app for production.
- `npm start`: Start the production server after build.
- `npm run lint`: Run ESLint.

**Environment Variables**

- See `docs/SUPABASE_ENV.md` for a full guided list. The two public keys above are used by client and server helpers.
- Do not commit secret keys to source control. Use environment secrets in hosting platforms for production.

**API & Data Layer**

- Admin API route examples live in `src/app/api/admin/*` and query Supabase tables such as `articles`, `authors`, and `categories`.
- `src/services/articleService.ts` provides higher-level helpers consumed by admin pages/components.

**Styling & Components**

- Tailwind tooling is present (see `tailwindcss` devDependency). UI uses Radix primitives and reusable components in `src/components/ui`.

**Deployment**

- Vercel is a good fit for deployment (Next.js native). Configure your Supabase env variables in the Vercel dashboard as production environment variables.
- Alternative: any platform that supports Node.js and environment variables (Netlify, Fly, Render) can host the built app.

**Testing & Linting**

- ESLint is configured (`npm run lint`). Add test framework and CI as needed.

**Contribution Guide**

- Fork the repo and open a PR for fixes or features.
- Keep commits focused and use clear PR descriptions. If adding DB migrations or schema changes, include SQL or Supabase migration steps in `docs/`.

**Troubleshooting**

- If pages fail to load due to Supabase errors, verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.
- Check `docs/SUPABASE_ENV.md` for environment guidance and any service-role-related steps.

**Next Steps / Ideas**

- Add unit/integration tests for API routes and services.
- Add GitHub Actions to run ESLint and build on PRs.
- Add a lightweight seed script to populate example authors/categories/articles for local development.

**Author**

**Alexander Olomokoro**  
Full-Stack Developer | Machine Learning Engineer  
🔗 [GitHub](https://github.com/xandersavage) • [LinkedIn](https://www.linkedin.com/in/alexander-olumukoro-699255199)

**License**

MIT
