# Neumorphic Popup Spec

**Date:** 2026-04-27
**Status:** Approved
**Topic:** Modern Neumorphic UI redesign.

## 1. Overview
Tactile dashboard interface. Elements integrated into surface via depth/shadows.

## 2. Visuals
### Colors
- **Base:** `#e0e0e0` (Gray)
- **Light Shadow:** `#ffffff` (TL)
- **Dark Shadow:** `#bebebe` (BR)
- **Accent:** `#3b82f6` (Blue)
- **Text:** `#333333` / `#666666`

### Layout
- **Width:** `350px`
- **Padding:** `24px`
- **Radius:** `16px` (main) / `12px` (cards)

## 3. Components
### Buttons
- **Style:** Raised (convex).
- **Interaction:** `active` -> `inset` shadow. `0.2s` transition.

### Tab Cards
- **Style:** Individually raised.
- **Delete:** "Sink" effect (opacity fade + scale 0.95).

### Empty State
- **Style:** Inset (concave). "Your dashboard is clear".

## 4. Tech
- **Styling:** Pure CSS vars.
- **Scrollbar:** Custom width `4px`.

## 5. Success
1. `350px` width.
2. Buttons "depress".
3. 3D depth for cards.
4. Tactile feel.
