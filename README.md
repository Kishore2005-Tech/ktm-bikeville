# KTM Bikeville

A cinematic, animation-driven showcase site for KTM motorcycles — built as an interactive bike configurator with fluid shared-element transitions between browsing and detail views.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

KTM Bikeville reimagines a motorcycle catalog as an immersive, scroll-driven experience. Visitors are guided through a full-screen frame-by-frame hero sequence, browse the lineup in a 3D carousel, and drop into a detailed spec sheet for each bike — all stitched together with GSAP-powered shared-element (FLIP) animations so the transition between screens feels like one continuous motion rather than a page swap.

## Features

- **Frame-by-frame hero scroll — a pinned, scroll-scrubbed image sequence (300 frames) tells the brand story in three beats, synced to `ScrollTrigger`.
- **3D bike carousel** — browse the KTM lineup (Super Adventure, Super Duke, EXC-F, Enduro, RC series) via a Swiper-powered carousel.
- **Shared-element detail transitions** — selecting a bike animates its image and card directly into the detail screen using GSAP's `Flip` plugin, with no jarring cuts.
- **Live configurator** — swap wheel finishes and preview color/material variants on the bike image in real time.
- **Full spec sheets** — engine, power, torque, weight, fuel capacity, and seat height for every model.
- **Smooth-scroll experience** — powered by [Lenis](https://github.com/darkroomengineering/lenis) for buttery inertial scrolling throughout.
- **Promo ticker, header, and footer** — supporting UI for offers, navigation, and social links.
- **Fully responsive** — built mobile-first with Vite's fast dev/build pipeline.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Animation | GSAP 3 (`Flip`, `ScrollTrigger`), Framer Motion |
| Smooth scroll | Lenis |
| Carousel | Swiper |
| Linting | oxlint |
| Testing | Playwright |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Kishore2005-Tech/ktm-bikeville.git
cd ktm-bikeville
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

Production-ready files are output to the `dist/` directory.

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
ktm-bikeville/
├── public/
│   ├── bikes/            # Bike product images
│   ├── hero scroll/       # Frame sequence for the scroll-driven intro
│   ├── bike stunts/       # Supporting media
│   └── scroll/            # Additional scroll assets
├── src/
│   ├── components/        # Header, Footer, Carousel, Detail screen, Loader, etc.
│   ├── data/
│   │   └── bikes.js       # Bike catalog: specs, pricing, wheel variants
│   ├── lib/                # Custom hooks (useLenis, useReveal, useTilt, scrollTo)
│   ├── App.jsx             # Screen orchestration + FLIP transition logic
│   └── main.jsx            # App entry point
├── index.html
├── vite.config.js
└── package.json
```

## How It Works

The app is built around two screens — a **carousel** view and a **detail** view — managed entirely in `App.jsx`. When a bike is selected, GSAP's `Flip` plugin captures the current DOM state of the shared image/card element, React swaps the active screen, and `Flip` animates the element from its old position/size to its new one. This gives the illusion of a single element flying across the layout, rather than two separate screens replacing each other.

## Roadmap

- [ ] Add a cart / enquiry flow
- [ ] Expand the bike catalog with more models
- [ ] Add dealer locator integration
- [ ] Improve accessibility (keyboard navigation for carousel and configurator)

## Contributing

Contributions are welcome. If you'd like to propose a change:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

## License

This project is intended as a portfolio / demonstration project. Add a `LICENSE` file (MIT recommended) if you plan to open-source it formally.

## Author

**Kishore** — [GitHub](https://github.com/Kishore2005-Tech)
