# UI/UX Design Guidelines

This document outlines the visual system, design tokens, and layout guidelines for **Smart Civic AI**.

---

## 🎨 1. Color Palette

The platform uses a premium, high-contrast monochrome design system (inspired by Stripe and Vercel). Colors are declared as CSS custom variables inside [css/style.css](css/style.css):

| Variable Name | Color Code | Role / Usage |
|---|---|---|
| `--color-primary` | `#09090b` | Zinc 950. Used for headers, footers, main titles, and primary visual elements. |
| `--color-primary-hover` | `#27272a` | Zinc 800. Used for button hover states. |
| `--color-primary-light` | `#f4f4f5` | Zinc 100. Used for backgrounds, input focus states, and card borders. |
| `--color-secondary` | `#2563eb` | Brand blue. Used for navigation links and active highlights. |
| `--color-accent-green` | `#10b981` | Accent green. Represents SDG 11. Used for primary success indicators. |
| `--color-bg-light` | `#fafafa` | Light gray background. Used for page backgrounds. |
| `--color-bg-card` | `#ffffff` | Pure white. Used for card backgrounds. |
| `--color-text-dark` | `#09090b` | Zinc 950. Used for primary text to ensure readability. |
| `--color-text-muted` | `#71717a` | Zinc 500. Used for helper text, labels, and borders. |

---

## 🔤 2. Typography

The platform uses native system font stacks to ensure compatibility, fast loading, and full offline support:

```css
--font-system: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

### Font Scales:
- **Hero Title**: `2.8rem` (Mobile: `1.8rem`), Bold/800
- **Page Titles / Form Headers**: `1.5rem` (Mobile: `1.2rem`), Bold/800
- **Section Headers**: `1.15rem`, Bold/700
- **Body Text**: `0.95rem` (Line height: `1.5`)
- **Helper Captions**: `0.85rem`

---

## 🔲 3. Layouts & Spacing

- **Containers**: Center content using `.container` with a maximum width of `1100px` and side paddings of `24px`.
- **Card Spacing**: Cards are styled with:
  - `border-radius: 12px` (large cards) or `8px` (standard items).
  - Minimal border lines: `1px solid var(--color-border)`.
  - Grid gutters: `24px` for layouts.

---

## 🔘 4. Inputs & Buttons

- **Form Fields**: Styled with:
  - `padding: 10px 14px`
  - `border: 1px solid var(--color-border)`
  - Active focus states: `border-color: var(--color-border-focus)` and `box-shadow: 0 0 0 2px rgba(9, 9, 11, 0.08)` to provide clear visual cues for keyboard navigation.
- **Buttons**:
  - Minimum height: `40px` to provide accessible hit targets.
  - Transition duration: `all 0.15s ease-in-out` on hover and active states.
  - Hover states should slightly change background colors.

---

## 📊 5. Visual Timeline

The tracking timeline is designed for ease of use:
- **Nodes**: Rendered as circles containing step numbers.
- **Color Coding**:
  - **Completed steps**: Black background with white checkmarks.
  - **Active steps**: Primary black border.
  - **Future steps**: Muted gray border.
- **Layout**: Renders horizontally on desktop screen sizes and transitions to a vertical layout on mobile viewports (< 768px) to fit portrait screens.
