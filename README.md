<div align="center">

# Portfolio

**An immersive, animation-driven personal portfolio built with Next.js 16, React 19 and Three.js — backed by a full Supabase-powered admin dashboard.**

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-r182-000?logo=three.js&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3.14-88CE02?logo=greensock&logoColor=black" />
</p>

</div>

---

## About the project

This isn't just a static resume site — it's a production-grade single-page experience that combines **cinematic 3D graphics**, **smooth scroll storytelling**, and a **self-serve content management system**. Every section (hero, about, skills, projects, contact) can be edited live from a protected admin panel. Visitors get a playful, interactive front door; the owner gets a Notion-style editor to keep it fresh without touching code.

### Highlights

- **3D hero scene** rendered with React Three Fiber — a retro computer, floating geometry, and a particle field with a camera rig that reacts to scroll.
- **Butter-smooth scrolling** powered by Lenis, orchestrated with GSAP ScrollTrigger and Framer Motion reveal animations.
- **Rich-text project pages** with a Tiptap editor, image uploads, links, placeholders, and drag-and-drop sorting via `@dnd-kit`.
- **Full admin dashboard** — authentication, messages inbox, project CRUD, skills manager, and site settings.
- **Contact form** with Zod validation, React Hook Form, and server-side persistence to Supabase.
- **Micro-interactions everywhere** — custom cursor trail, noise overlay, page transitions, confetti bursts, and hidden easter eggs.

---

## Tech stack

### Frontend
| Layer | Tools |
| --- | --- |
| Framework | **Next.js 16** (App Router, Server Components, Turbopack) |
| Language | **TypeScript 5**, **React 19** |
| Styling | **Tailwind CSS v4**, `class-variance-authority`, `tailwind-merge` |
| 3D / WebGL | **Three.js**, `@react-three/fiber`, `@react-three/drei` |
| Animation | **Framer Motion**, **GSAP**, Lenis smooth scroll |
| UI primitives | **Radix UI** (Dialog, Dropdown, Tabs, Toast, Tooltip, Select, Switch) |
| Forms | **React Hook Form**, **Zod** resolvers |
| Editor | **Tiptap 3** (StarterKit + Image, Link, Placeholder) |
| DnD | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Extras | `lucide-react` icons, `canvas-confetti` |

### Backend & infra
| Layer | Tools |
| --- | --- |
| Auth + DB | **Supabase** (Postgres, Row Level Security, Storage buckets) |
| SSR client | `@supabase/ssr` for secure cookie-based sessions |
| Middleware | Edge middleware guards the `/admin` routes |
| Migrations | Versioned SQL migrations in `supabase/migrations/` |

---

## Techniques & patterns

- **App Router with server components** — data fetching happens server-side; interactive islands are hydrated only where needed.
- **Scroll-driven 3D** — a custom camera rig reads normalised scroll progress to fly the camera through the 3D scene as the user reads.
- **Progressive enhancement** — 3D and heavy effects lazy-load; the page stays usable without them.
- **Type-safe end-to-end** — Zod schemas validate forms on the client, API routes, *and* at the DB boundary.
- **RLS-first security** — admin tables are locked down by Supabase Row Level Security policies, not just by UI gating.
- **Optimistic UI** — admin CRUD operations update the cache immediately and reconcile on response.
- **Accessible by default** — Radix primitives ship correct ARIA, keyboard nav, and focus traps out of the box.
- **Design system via CVA** — variant-driven components keep the visual language consistent.

---

## Project structure

```
src/
├── app/                     # Next.js App Router
│   ├── admin/               # Protected dashboard (login, messages, projects, skills, settings)
│   ├── api/                 # Route handlers (auth, contact, health)
│   ├── projects/[slug]/     # Dynamic project detail pages
│   ├── layout.tsx           # Root layout, fonts, global providers
│   └── page.tsx             # Landing page
├── components/
│   ├── sections/            # hero / about / skills / projects / contact
│   ├── three/               # R3F scene, camera rig, particles, retro computer
│   ├── effects/             # cursor trail, noise, page transitions, easter eggs
│   ├── layout/              # Nav, footer, shells
│   ├── ui/                  # Radix-based primitives (button, dialog, input, …)
│   └── admin/               # Dashboard-only components (editor, tables, forms)
├── hooks/                   # Custom React hooks
├── lib/                     # Supabase clients, utils, validation schemas
├── types/                   # Shared TS types
└── middleware.ts            # Auth gate for /admin
supabase/migrations/         # SQL schema + storage setup
```

---

<div align="center">

Built with care by [@stariik](https://github.com/stariik).
If this project inspires you, a ⭐ goes a long way.

</div>

