# ESG Land Services — Civil & Site Services (Static Website)

A modern, mobile‑first, fully responsive one‑page website for a contractor company offering:
- Storm water drainage
- Fine grading
- Land clearing
- Tree removal
- Concrete

Built with plain HTML, CSS, and JavaScript. Designed for 2025‑level UI polish with bright colors, smooth transitions, tasteful glassmorphism, and accessible interactions. Ready for GitHub Pages deployment.

Live preview: open `index.html` locally in your browser.

## Features
- Mobile‑first navigation with sticky, translucent header and burger menu
- Animated hero with gradient background and floating orbs
- Services grid (5 cards) with micro‑interactions
- About section (why choose us, process, safety)
- Contact section with a front‑end form and WhatsApp CTA (mock)
- Subtle scroll‑reveal animations using IntersectionObserver
- Back‑to‑top control and dynamic year in footer
- Accessibility: semantic HTML, focus states, skip link, reduced‑motion support
- SEO: meta description/keywords, Open Graph/Twitter tags, and JSON‑LD LocalBusiness schema

## File structure
- `index.html` — Main page (semantic sections, meta, JSON‑LD)
- `styles.css` — Theme, layout, utilities, animations
- `script.js` — Interactions: menu, smooth scroll, reveal, WhatsApp builder, to‑top
- `.nojekyll` — Prevents GitHub Pages/Jekyll processing
- `404.html` — Fallback page for GitHub Pages (optional but recommended)

## Customize before going live
Update the placeholder values marked as TODO in the following locations:

1) Contact details (visible on page)
- File: `index.html`
  - Contact section list (phone, email, address, license)

2) WhatsApp destination number
- File: `script.js`
  - Replace the value of `waPhone` with your WhatsApp number in international format without `+` (e.g., `15551234567`).

3) WhatsApp convenience links (header/footer/hero)
- File: `index.html`
  - Replace `https://wa.me/15551234567?...` with your number.

4) SEO & branding
- File: `index.html`
  - `<title>`
  - `<meta name="description">`
  - `<meta name="keywords">`
  - Canonical URL (`<link rel="canonical">`)
  - Open Graph/Twitter image and URL
  - JSON‑LD fields: `name`, `url`, `image`, `telephone`, `address`

5) Visual theme (optional)
- File: `styles.css`
  - Tweak CSS variables at the top (`:root`) for colors, shadows, and radii.

6) Favicon
- File: `index.html`
  - Currently an inline SVG data URL. Replace if desired with your own icon.

## Deploy to GitHub Pages
Option A — User/Org site (username.github.io)
1. Create a public repo named `USERNAME.github.io`.
2. Add these files to the repo root and push to `main`.
3. GitHub Pages will serve from `https://USERNAME.github.io/` automatically.

Option B — Project site
1. Create a public repo (any name).
2. Push these files to the repo root on `main`.
3. In GitHub: Settings → Pages → Build and deployment → Source = "Deploy from a branch".
4. Branch = `main` and folder = `/ (root)`. Save.
5. Your site will appear at `https://USERNAME.github.io/REPO/`.

Notes
- `.nojekyll` is included to avoid asset processing by Jekyll.
- If using a custom domain, set up `CNAME` in Settings → Pages (optional).

## Form handling (optional)
This is a front‑end‑only template. To capture form submissions, consider:
- Formspree: https://formspree.io/
- Netlify Forms: https://docs.netlify.com/forms/setup/
- Static backend/email hooks of your choice

## Performance & accessibility
- Uses `prefers-reduced-motion` to disable animations for sensitive users.
- Loads Google Fonts over HTTPS; consider self‑hosting fonts for maximum performance.
- Minify/inline CSS/JS in production if needed (currently kept readable for editing).

## External resources used
- Google Fonts (Inter, Manrope): https://fonts.google.com/
- Dummy Open Graph image placeholder: https://dummyimage.com/
- Inlined SVG icons and shapes are handcrafted for this template.

## License
You are free to use, modify, and deploy this template for your business. Replace placeholder content with your own branding and details.
