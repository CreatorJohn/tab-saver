# Neumorphic Popup Redesign Specification

**Date:** 2026-04-27
**Status:** Approved
**Topic:** Redesigning the extension popup to a modern, fancy Neumorphic style.

## 1. Overview
The goal is to replace the current flat UI with a tactile, dashboard-like interface where elements appear to be integrated into the surface through depth and shadows.

## 2. Visual Aesthetic
### Color Palette
- **Base Background:** `#e0e0e0` (Soft neutral gray)
- **Light Shadow:** `#ffffff` (Top-left)
- **Dark Shadow:** `#bebebe` (Bottom-right)
- **Primary Accent:** `#3b82f6` (Blue - used sparingly for highlights)
- **Text (Primary):** `#333333`
- **Text (Secondary):** `#666666`

### Layout
- **Width:** Fixed `350px`
- **Padding:** `24px` for the main container
- **Corner Radius:** `16px` for main containers, `12px` for tab cards

## 3. Components
### Buttons
- **Style:** Raised (convex) effect using dual shadows.
- **Interaction:** 
  - `active` (pressed) state transitions to an `inset` shadow.
  - Smooth transition: `0.2s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Primary Buttons:** High contrast labels on the soft gray surface.

### Tab Cards
- **Style:** Individually raised cards.
- **Layout:** Left-aligned title and URL, right-aligned trash icon.
- **Delete Feedback:** Visual "sink" effect (opacity fade + scale down to 0.95) when removed.

### Empty State
- **Style:** An inset (concave) area with centered text "Your dashboard is clear".
- **Icon:** Minimalist grayscale icon.

## 4. Technical Details
- **Styling:** Pure CSS (using variables for shadow values to maintain consistency).
- **Icons:** Minimalist SVG icons.
- **Scrollbar:** Custom styling for `::-webkit-scrollbar` (width: `4px`, color: match background).

## 5. Success Criteria
1. Popup width is exactly `350px`.
2. Buttons visibly "depress" when clicked.
3. Tab cards have a distinct 3D depth against the background.
4. UI feels tactile and responsive.
