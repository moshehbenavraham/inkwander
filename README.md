# Personal Blog

Personal Blog is a Vite, React, and TypeScript site for Perspective, an editorial blog about lifestyle, wellness, travel, creativity, and personal growth.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

## Requirements

- Node.js 20+
- npm 10+

## Local Development

```bash
npm install
npm run dev
```

The development server starts on port 8080 by default.

## Production Build

```bash
npm run build
npm run preview
```

The compiled app is emitted to `dist/` and can be served with standard static hosting tooling such as Nginx, Caddy, Apache, or any static hosting provider.

## Project Notes

- Editorial content lives in `src/data/articles.ts`.
- Shared UI components live in `src/components`.
- Social preview metadata uses the local `public/social-card.svg` asset.
- The project uses standard Vite and npm tooling without vendor-specific build plugins.

## SEO and Discoverability

Per-page SEO is handled by the `useSEO` hook in `src/lib/seo.tsx`, which sets:

- `<title>` and meta description
- Canonical URL (`SITE_URL` + path)
- Open Graph and Twitter Card tags (image, type, site name)
- `robots` directive (`noindex` for utility pages like `/style-guide` and `/404`)
- JSON-LD structured data:
  - **Article** + **BreadcrumbList** on individual posts (`/article/:id`)
  - **WebSite** + **Organization** on the homepage
  - **CollectionPage** on each category landing page (`/wellness`, `/travel`, `/creativity`, `/growth`)
  - **ItemList** of `Person` entities on `/authors`

Update the base URL in `src/lib/seo.tsx` (`SITE_URL`) when deploying under a new domain.

A static `public/sitemap.xml` and `public/robots.txt` (with a `Sitemap:` directive) are committed. Regenerate the sitemap whenever you add or rename articles.

### Dark mode and flash-of-light prevention

`Header.tsx` toggles a `.dark` class on `<html>` and persists the choice in `localStorage` under the `theme` key. An inline blocking script in `index.html` applies the saved preference (or `prefers-color-scheme`) before the body paints, so dark-mode visitors don't see a flash of light theme on first load.

### Accessibility

- Skip-to-content link in the header (visible on focus)
- Each page's `<main>` has `id="main"` for skip-link targeting
- Newsletter forms use proper `<form>`, `<label>`, `autoComplete`, and `aria-label`
- Theme toggle reports its state via `aria-pressed`
- Mobile menu toggle uses `aria-expanded`

### Newsletter and contact forms

All four interactive forms (newsletter on Home / About / Article and the Contact page) submit through helpers in `src/lib/forms.ts`. They do **one** of two things, decided at build time:

1. **POST to a configured endpoint** — when the relevant env var is set, the form posts JSON and reports success/failure with a `sonner` toast and an inline ARIA live region.
2. **Open a prefilled `mailto:` draft** — when no endpoint is configured, the form opens the visitor's mail client with a draft to `VITE_CONTACT_EMAIL` (default `hello@perspective.blog`) so submissions never get silently dropped.

Configure via a `.env.local` file (see `.env.example`):

```bash
VITE_NEWSLETTER_ENDPOINT=https://your-provider.example/subscribe   # Buttondown, ConvertKit, Mailchimp, custom worker, etc.
VITE_CONTACT_FORM_ENDPOINT=https://your-provider.example/contact   # Formspree, Netlify Forms, custom worker, etc.
VITE_CONTACT_EMAIL=hello@perspective.blog                          # destination for mailto: fallbacks
```

Endpoint payloads:

- Newsletter: `POST { "email": string, "source"?: string }` as JSON.
- Contact: `POST { "name": string, "email": string, "subject": string, "message": string }` as JSON.

Forms use `noValidate` so the email-format check and "all fields required" checks run in JS with consistent UX, and an ARIA live region announces success/error to screen readers.

### Site links and contact info

Off-site brand presence and contact details live in `src/lib/site.ts` so the
homepage, hero, footer, and `/contact` page render conditionally — nothing
ships as a dead anchor or placeholder phone number.

```bash
# Social profiles (any platform left empty is omitted from the UI)
VITE_SOCIAL_TWITTER=https://twitter.com/your-handle
VITE_SOCIAL_INSTAGRAM=https://instagram.com/your-handle
VITE_SOCIAL_FACEBOOK=
VITE_SOCIAL_LINKEDIN=
VITE_SOCIAL_YOUTUBE=

# Contact-page rows (each row hidden when unset)
VITE_CONTACT_PHONE=
VITE_CONTACT_LOCATION=
VITE_CONTACT_HOURS=
```

### SPA navigation

Internal navigation uses React Router `<Link>` everywhere (header, footer,
hero, article cards, NotFound, etc.) so route changes don't trigger a full
page reload (no FOUC, no lost scroll position, no React Query cache reset).
`src/components/ScrollManager.tsx` lives inside `<BrowserRouter>` and:

- Scrolls to the top on every path change.
- Smooth-scrolls to in-page hash targets (e.g. `/#articles`, `/#newsletter`)
  after the new route mounts.
- Respects `prefers-reduced-motion`.
