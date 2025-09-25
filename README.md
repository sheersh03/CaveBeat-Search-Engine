# NovaSearch ⚡️

Next-gen search prototype focused on delightful UX, instant actions, and cinematic theming. Built with React, Vite, TailwindCSS, Framer Motion.

## ✨ Highlights

- **Fluid interface** – animated brand mark, polished dark/light themes, buttery toggle switches.
- **Smart filters** – time, region, SafeSearch, and site scopes dynamically reshape answers + results.
- **Quick Actions** – one-click summaries, comparisons, pros/cons, and step extractors that piggyback on current query context.
- **AI panels** – crafted mock responses with filter-aware phrasing and source callouts.
- **Modal helpers** – Feedback hub, Research canvas, Chat assistant, and Sign-in flows for richer storytelling.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

- Dev server runs at `http://localhost:5173` (Vite default).
- `npm run build` for production output. Preview with `npm run preview`.

## 🧭 Key Experiences

| Area | Description |
| --- | --- |
| Search Bar | AI lens, voice/image buttons, keyboard shortcut hints, applied-filter summary. |
| Sidebar Filters | Instant re-query hooks for time, region, SafeSearch, site/filetype scope. |
| Quick Actions | Context-aware utilities: summarise, compare, generate pros/cons, extract steps. |
| AI Answer Card | Animated loading dots, vibrant dark-mode typography, quick links to sources. |
| Modals | Feedback collector, research synthesiser, chatbot, and authentication mock. |

## 🛠 Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion 11
- React Router 6

## 🧪 Working Features

- Theme toggle with persisted preference.
- SafeSearch slider updates answer/results & adds context notice.
- Site/filetype prompt influences displayed snippets.
- Quick actions produce formatted insights based on active results.

## 🗺 Roadmap Ideas

- Wire quick actions to real LLM API calls.
- Bring in live search data sources.
- Add per-result explainability + highlight animations.
- Extend accessibility (focus outlines, screen reader content).

## 📸 Preview

> _Dark mode glow, filter panel, AI answer, quick actions in action._

## 🤝 Contributing

1. Fork & clone
2. `npm install`
3. Create feature branch
4. `npm run dev`
5. Open PR with screenshots/video of updates

## 📄 License

MIT
