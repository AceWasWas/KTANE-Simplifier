# KTaNE Simplifier

A quick-reference web app for [Keep Talking and Nobody Explodes](https://www.keeptalkinggame.com/), built with Next.js.

## Overview

This tool digitizes the bomb defusal manual so the expert can quickly look up module instructions during a run. The landing page lists all 11 standard modules; each links to a dedicated page with the full disarming rules.

**Modules covered:**
1. Wires
2. The Button
3. Keypads
4. Simon Says
5. Who's on First
6. Memory
7. Morse Code
8. Complicated Wires
9. Wire Sequences
10. Mazes
11. Passwords

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS

## Project Structure

```
app/
├── data/modules.ts        # module content
├── layout.tsx             # root layout
├── page.tsx               # landing page
├── globals.css
└── modules/[slug]/
    └── page.tsx           # individual module pages
```

## Based On

KTaNE Bomb Defusal Manual v1, Verification Code 241
