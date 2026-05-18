# Prisma Studio - Portfolio Design Document

## 1. Project Overview
**Project Name**: Prisma Studio (Portfolio of Marcus Chen)
**Type**: Single Page Application (SPA) Web Portfolio
**Framework**: Next.js 16 (App Router)
**Language**: TypeScript, React 19
**Styling**: Tailwind CSS v4
**Animation**: Motion (Framer Motion v12)

This project is a modern, cinematic portfolio designed for a visual artist/director. It heavily features video backgrounds, scroll-based text animations, and an immersive dark-mode aesthetic with noise texture overlays.

---

## 2. Architecture & File Structure

```text
d:\WorkSpace\Portfolio\
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles, CSS variables, and noise texture classes
│   │   ├── layout.tsx       # Root layout defining HTML/Body structure
│   │   └── page.tsx         # Main portfolio page containing all sections
│   └── components/
│       └── animations.tsx   # Reusable Framer Motion animation components
├── public/                  # Public assets (if any)
├── package.json             # Dependencies and scripts
├── tailwind.config.* / postcss.config.* # Tailwind v4 setup
└── tsconfig.json            # TypeScript configuration
```

---

## 3. UI/UX Design System

### 3.1. Color Palette
The portfolio utilizes a dark, cinematic theme with warm beige/off-white accents:
- **Background**: `#000000` (Pure Black)
- **Primary Accent**: `#DEDBC8` (Warm Beige / Primary)
- **General Text**: `#E1E0CC` (Off-white)
- **Cards/Containers**: `#101010` to `#212121` (Deep Charcoal to Dark Gray)
- **Borders**: `rgba(255, 255, 255, 0.05)` (Subtle white translucent)
- **Selection Color**: Background `primary/30`, Text `white`

### 3.2. Typography
- **Sans-Serif (Default)**: `Almarai` (Clean, modern UI text, descriptions, and UI elements)
- **Serif**: `Instrument Serif` (Used for elegant, italicized highlights in the story section)

### 3.3. Textures & Effects
- **Noise Overlay**: SVG fractal noise is applied over sections (`.noise-overlay`, `.bg-noise`) to give a grainy, film-like texture to the application.
- **Glass/Translucency**: Gradients fading into transparent (`bg-gradient-to-b from-black/30 via-transparent to-black/60`) are used to ensure text legibility over videos.

---

## 4. Components & Animations

### 4.1. Custom Animation Components (`src/components/animations.tsx`)
1. **`WordsPullUp`**: 
   - Animates words sliding up (`y: "20%" -> 0`) and fading in as they enter the viewport.
   - Used for massive hero titles (e.g., "Prisma").
2. **`WordsPullUpMultiStyle`**: 
   - Similar to `WordsPullUp` but supports multiple text segments with different CSS classes (e.g., mixing regular sans-serif with italic serif).
   - Used in the About section and Section headers.
3. **`ScrollRevealText` & `AnimatedLetter`**: 
   - A scroll-tied animation that binds opacity of individual letters to the user's scroll position.
   - Used for the biography paragraph.

### 4.2. Page Sections (`src/app/page.tsx`)

#### **Section 1: Hero**
- **Layout**: Full-screen (`100vh`) with rounded borders, containing a background looping video.
- **Navbar**: Floating top navigation (`navLinks`) centered with a semi-transparent black background.
- **Content**: Massive animated "Prisma" typography taking up the majority of the screen, paired with a right-aligned description paragraph and a "Join the lab" CTA button with an animated arrow.

#### **Section 2: About / The Story**
- **Layout**: Centered card (`max-w-6xl`) with deep dark gray background (`#101010`).
- **Content**: Features the `WordsPullUpMultiStyle` to introduce the artist (Marcus Chen) with mixed typography styles, followed by the `ScrollRevealText` paragraph detailing their experience.

#### **Section 3: Features / Workflow**
- **Header**: Animated multi-styled text stating "Studio-grade workflows...".
- **Grid Layout**: A responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
- **Cards**:
  - **Video Card**: Shows a looping video preview that scales on hover.
  - **`FeatureCard`**: Reusable component detailing features (Storyboard, Smart Critiques, Immersion Capsule). It includes:
    - Slide-in animation using `motion.div`.
    - An icon container, title, list of items with checkmarks (`lucide-react`).
    - A "Learn more" link with an arrow that animates on hover.

#### **Footer**
- Minimalistic border-top layout with left and right aligned text.

---

## 5. Dependencies

- **Framework**: `next@16.2.6`, `react@19.0.0`
- **Styling**: `tailwindcss@4.1.14`
- **Icons**: `lucide-react`
- **Animations**: `motion` (Framer Motion wrapper for React 19)
- **AI Tooling**: `@google/genai` (Configured but not visibly utilized in the frontend layout)
