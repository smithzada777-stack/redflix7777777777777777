---
name: Pitch Velocity
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#ebbbb4'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#b18780'
  outline-variant: '#603e39'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#690100'
  primary-container: '#ff5540'
  on-primary-container: '#5c0000'
  inverse-primary: '#c00100'
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#929090'
  on-tertiary-container: '#2a2a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#930100'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-xl:
    fontFamily: Epilogue
    fontSize: 80px
    fontWeight: '900'
    lineHeight: 88px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-edge: 64px
  section-gap: 120px
---

## Brand & Style

The design system is engineered to evoke the high-octane atmosphere of elite football. The brand personality is aggressive, prestigious, and performance-oriented, targeting fans and athletes who seek intensity. 

The visual style blends **High-Contrast / Bold** aesthetics with elements of **Brutalism**. This is achieved through oversized typography, asymmetric container shapes that mimic the speed of the game, and a dark-mode foundation that allows the "Intense Red" to vibrate with energy. Motion is implied through slanted containers (parallelograms), overlapping elements, and high-motion photography that breaks the bounds of standard grid containers.

## Colors

The palette is dominated by a "Stadium Dark" environment to emphasize focus and power.
- **Primary (Intense Red):** Used exclusively for calls to action, active states, and critical data points. It represents the heartbeat and adrenaline of the sport.
- **Secondary/Tertiary (Obsidian & Carbon):** These dark tones provide depth and layering, allowing foreground content to "pop" without the harshness of pure black in large areas.
- **Neutral:** A crisp, slightly cool white used for high-impact typography to ensure maximum legibility against dark backgrounds.

## Typography

This design system utilizes a dual-font strategy to balance editorial impact with athletic readability. 
- **Epilogue** is the voice of the system, used for massive headlines and displays. Its tight kerning and heavy weights create a sense of urgency and "loudness."
- **Lexend** handles all functional text. Given its roots in readability and athletic contexts, it provides a clear, motivating structure for body copy and UI labels. 

Always use **Uppercase** for headers and buttons to maintain the "shouted" energy of a stadium environment.

## Layout & Spacing

The layout follows a **12-column fluid grid** with generous outer margins to frame the content like a pitch. 
- **Dynamic Asymmetry:** Inspired by the reference image, key blocks (like the header or hero feature) should use asymmetric border radii or "sheared" edges (slanted by 5-8 degrees) to create a sense of forward motion.
- **Layered Overlaps:** Elements such as player cutouts and floating stat cards should break the vertical rhythm, overlapping multiple sections to lead the eye downward.

## Elevation & Depth

Depth is achieved through **Tonal Layers** rather than soft shadows.
- **Surface Level 0:** The deep black/charcoal background.
- **Surface Level 1:** Slightly lighter gray containers (#1A1A1A) with 1px borders in a darker red or subtle gray.
- **High-Velocity Glow:** Use "Outer Glows" in the Primary Red for active elements or "Hero" player cutouts to simulate stadium lighting.
- **Glassmorphism:** Use sparingly for floating stats cards (15% opacity white with 20px background blur) to keep the UI modern and layered.

## Shapes

The shape language is **Rounded but Geometric**. 
- Standard containers use a 0.5rem (8px) radius to maintain a modern, technical feel.
- **Feature Blocks:** Use hyper-rounded corners (1.5rem to pill-shaped) for specific "accent" containers, like the unique header shape seen in the reference, to provide a distinctive visual signature that contrasts against the sharp angles of football graphics.

## Components

- **Primary Buttons:** Solid Intense Red background, white uppercase text (Lexend Bold), with a 4px offset "hard shadow" in black to give it a tactile, "pressable" look.
- **Stat Cards:** Use oversized Epilogue numbers. Include a small "trend" indicator (sparkline or arrow) in red.
- **Navigation:** Minimalist and top-aligned. Active states are indicated by a thick (4px) red underline that extends beyond the width of the text.
- **Player Profiles:** Use large cut-out images that break the container boundaries. Backgrounds for these cards should feature subtle halftone patterns or "motion lines" to reinforce the energy of the sport.
- **Live Match Ticker:** A high-contrast black bar with scrolling text or rapid-fire score updates, using a monospaced variant of Lexend for a "digital scoreboard" feel.