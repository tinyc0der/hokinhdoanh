# hokinhdoanh.ai — landing page

A redesigned landing page for [Hộ Kinh Doanh AI](https://hokinhdoanh.ai), the AI assistant for tax and accounting questions from Vietnamese household businesses (hộ kinh doanh).

**Live:** https://tinyc0der.github.io/hokinhdoanh/

## Brand

| Token | Light | Dark | Use |
|---|---|---|---|
| Paper | `#F7F3EA` | `#0C1512` | Page background |
| Ink | `#10221B` | `#EEF0E8` | Headings |
| Jade | `#0F3B2E` | `#133426` | Primary buttons, chat bubbles, dark sections |
| Seal | `#E04E2E` | `#EE5C3B` | Accent: the red "official seal" that stands for cited legal sources |

- **Mark:** a chat bubble with a seal check (`assets/logo.svg`)
- **Type:** Be Vietnam Pro (UI and headings) + Fraunces Italic (accent words), both with full Vietnamese support

## Structure

```
index.html            single page: hero, features, how-it-works, regulations, pricing, app, FAQ, contact
assets/styles.css     all styles (design tokens at the top, light/dark via prefers-color-scheme)
assets/app.js         nav, mobile menu, scroll reveal, hero chat demo, regulation filter, contact form
assets/logo.svg       brand mark (favicon.svg is a copy)
og-image.png          1200×630 social preview
```

There's no build step. It's plain HTML, CSS and JS.

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes

- Sign-up/login, legal pages and store links point to the production app at `hokinhdoanh.ai`.
- The canonical URL is `https://hokinhdoanh.ai/`, so search engines don't treat this preview as duplicate content.
- GitHub Pages is static, so the contact form opens the visitor's email app with the message pre-filled (to `lienhe@hokinhdoanh.ai`). Swap it for a form endpoint (Formspree, a Next.js API route, etc.) when this moves to production.
