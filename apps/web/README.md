# Task.IO - Web Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load custom fonts.

## Design System

### Color Palette

Our application uses a carefully curated color palette with semantic naming for consistency across the application. All colors are defined in `src/app/globals.css`.

#### Quick Reference

| Tailwind Class | Hex Code | Visual Reference |
|----------------|----------|------------------|
| `bg-primary` / `text-primary` | `#273F4F` | 🟦 Dark blue-grey |
| `bg-secondary` / `text-secondary` | `#7C99AC` | 🔵 Medium blue-grey |
| `bg-muted` / `text-muted` | `#92A9BD` | 💙 Light blue-grey |
| `bg-background` / `text-background` | `#D3DEDC` | ⬜ Very light grey-blue |
| `bg-accent` / `text-accent` | `#FFEFEF` | 🌸 Light pink |
| `bg-card` / `text-card` | `#F5F7F6` | ⚪ Off-white |

#### Primary Colors

| Color Token | Hex Code | Description | Usage |
|------------|----------|-------------|-------|
| `primary` | `#273F4F` | Dark blue-grey | Primary buttons, headings, main text, active states |
| `primary-foreground` | `#FFFFFF` | Pure white | Text on primary colored backgrounds |
| `secondary` | `#7C99AC` | Medium blue-grey | Secondary buttons, hover states |
| `secondary-foreground` | `#FFFFFF` | Pure white | Text on secondary colored backgrounds |
| `muted` | `#92A9BD` | Light blue-grey | Sidebar background, muted elements |
| `muted-foreground` | `#273F4F` | Dark blue-grey | Text on muted backgrounds |
| `accent` | `#FFEFEF` | Light pink | Accent elements, highlights |
| `accent-foreground` | `#273F4F` | Dark blue-grey | Text on accent backgrounds |
| `background` | `#D3DEDC` | Very light grey-blue | Main page background |
| `foreground` | `#FFFFFF` | Pure white | Main text color on background |

#### UI Element Colors

| Color Token | Hex Code | Description | Usage |
|------------|----------|-------------|-------|
| `card` | `#F5F7F6` | Off-white | Card backgrounds |
| `card-foreground` | `#273F4F` | Dark blue-grey | Text on cards |
| `border` | `#92A9BD` | Light blue-grey | Borders and dividers |
| `input` | `#92A9BD` | Light blue-grey | Input field borders |
| `ring` | `#7C99AC` | Medium blue-grey | Focus rings |

#### Usage Examples

```jsx
// Using color tokens with Tailwind CSS
<div className="bg-background text-foreground">
  <h1 className="text-primary">Heading</h1>
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Primary Button
  </button>
  <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
    Secondary Button
  </button>
</div>
```

**Important Notes:**
- ✅ **DO** use semantic color tokens (e.g., `bg-primary`, `text-secondary`)
- ❌ **DON'T** use arbitrary color values (e.g., `bg-[#273F4F]`, `text-[#7C99AC]`)
- This ensures consistency and makes theme changes easier in the future

### Typography

The application uses two custom Google Fonts:

| Font | Variable | Usage | Weights Available |
|------|----------|-------|-------------------|
| **Lexend Deca** | `font-lexend` | Body text, general UI | 100-900 |
| **Belanosima** | `font-belanosima` | Headings, logo, display text | 400, 600, 700 |

#### Usage Examples

```jsx
// Default body text uses Lexend Deca (applied globally)
<p>This uses Lexend Deca by default</p>

// For headings and logo, use Belanosima
<h1 className="font-belanosima">Logo or Heading</h1>
```

### Component Library

This project uses [shadcn/ui](https://ui.shadcn.com/) components with custom theming based on our color palette. All shadcn components automatically inherit our design tokens.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
