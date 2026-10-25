---
name: Shohoj Commerce
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#006b2e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873c'
  on-tertiary-container: '#f7fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#66ff8e'
  tertiary-fixed-dim: '#3de273'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005322'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a trustworthy, modern, and effortless digital retail experience tailored for Bengali bilingual commerce. The brand personality balances hyper-functional clarity with welcoming commercial warmthâ€”positioning the platform as dependable, transparent, and approachable across Tier-1 urbanites and emerging regional digital shoppers.

The aesthetic fuses **Modern Neo-Utility** with **Clean Editorial Commerce**:
- **Clarity over decorative noise**: Crisp off-white surfaces, generous white space, and deliberate content clustering prevent visual exhaustion during extended shopping sessions.
- **Micro-tactile feedback**: Smooth micro-interactions, subtle borders, and gentle physical weight provide reassurance during critical conversion flows like cart additions, flash deals, and one-tap checkout.
- **Bilingual harmony**: Structural accommodations natively support script density, vertical accents, and glyph metrics of Bengali typography alongside Western alphanumeric layouts.

## Colors

The palette leverages high-trust emerald greens reinforced by energetic signal accents, optimized for daylight legibility and high optical conversion rates:

- **Primary (`#059669` / Base `#10B981`)**: Represents financial trust, freshness, and order completion. Used for primary CTAs, active operational indicators, checkout confirmations, and top-tier navigation focus.
- **Secondary (`#F97316`)**: An urgent, luminous coral used selectively for discount tags, countdown timers, clearance markers, and low-inventory notices.
- **Tertiary (`#25D366`)**: Reserved specifically for native customer engagement channelsâ€”primarily one-tap WhatsApp commerce and instant customer support hooks.
- **Neutral Core (`#0F172A`)**: Deep ink slate providing sharp contrast against canvas surfaces without the clinical severity of pure `#000000`.
- **Canvas & Surface Layering**: Base canvas sits on `#F8FAFC`, layered with clean `#FFFFFF` for product card containers and input fields, contrasted with `#E2E8F0` for structural dividing strokes.

## Typography

Typography pairing matches geometric modernity with script-compatible legibility. **Plus Jakarta Sans** powers structural display, titles, and labels, while **Noto Sans** ensures Bengali Matra lines, conjunct characters, and dual-script numeral rendering stay balanced without horizontal clipping.

### Usage Rules
- **Line Heights**: Elevated line-height ratios (minimum 1.5x on body copy) accommodate extended Bengali vowel signs (Kar) and subscript clusters without vertical overlapping.
- **Price Displays**: Currency indicators (`à§³` / `BDT`) must pair `label-md` with `headline-sm` or `headline-md` tabular numerals to prevent layout shifting during price updates.
- **Bilingual Consistency**: Latin and Bengali counterparts maintain equivalent visual scale across both the consumer storefront and dense inventory tables in the admin view.

## Layout & Spacing

The layout is grounded on an adaptive fluid grid structured around 8px base micro-increments:

- **Mobile (< 768px)**: 4-column layout with `1rem` (16px) margins and gutters. Product feeds collapse into a 2-column density grid. Sticky bottom navigation bars handle checkout summaries and navigational routing.
- **Tablet (768px â€“ 1024px)**: 8-column layout with `2rem` (32px) margins and `1rem` gutters. Admin navigation converts to a compact rail format.
- **Desktop (â‰¥ 1025px)**: 12-column layout maxed out at 1360px container width with `1.5rem` (24px) gutters. The Admin dashboard shifts to an expanded 260px fixed sidebar with fluid content management workbenches.

## Elevation & Depth

Visual hierarchy uses subtle tonal elevation and crisp boundary definition instead of heavy shadows:

- **Surface Levels**:
  - `Surface 0 (Background)`: Base `#F8FAFC`.
  - `Surface 1 (Card/Container)`: Solid `#FFFFFF` bordered by a 1px solid stroke (`#E2E8F0`).
  - `Surface 2 (Dropdowns & Floating Overlays)`: Pure `#FFFFFF` elevated with a double-layered soft shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
  - `Surface 3 (Modal / Sticky Checkout Sheet)`: Layered over a semi-transparent `#0F172A` backdrop blur (opacity 40%, backdrop blur 6px), cast with `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Micro-Borders**: Interactive states do not jump in size; they swap from the neutral `#E2E8F0` stroke to a 1.5px `#059669` highlight.

## Shapes

The interface balances soft friendliness with structured efficiency:

- **Base Radius (`0.5rem` / 8px)**: Applied across product cards, inputs, modal containers, and admin data panels to retain clean architectural lines.
- **Pill Radius (`9999px`)**: Reserved for deal badges, promotional stickers, status chips, cart quantity toggles, and floating WhatsApp access points.
- **Interactive Consistency**: Outer product cards feature 12px (`rounded-lg`), while inner elements like image containers follow nested math at 8px (`rounded-md`).

## Components

### Buttons
- **Primary**: Solid `#059669` background with white text, 8px corner radius, bold label typography (`label-lg`), and active scaling down to `98%` on press.
- **Secondary / WhatsApp**: `#25D366` background with high-contrast `#FFFFFF` or slate text, paired with native messaging icons for direct communication.
- **Sale & Action Alerts**: Vibrant coral `#F97316` background reserved for fast checkout triggers ("à¦à¦–à¦¨à¦‡ à¦•à¦¼)ª8)àx)ªÈ^H›ÝÈŠK‚‚ˆÈÈÈ›ÙXÝØ\™Â‹HØ\™Ú\ÜÚ\ÈZ[Ûˆ\™HÑ‘‘‘‘‘˜Ú]H\ÑL‘NŒ›Ü™\‹‚‹H›Ø][™ÈÛÜ˜[Ø[H[ÈÜ[Y
LÌ	H8)¦ø)¯¸)ç
K]ZXÚË\Ø]™HX\XÝ[ÛˆÜ\šYÚ‚‹H[XYÙH›Û™HÛˆH]]YÑŒQQŽX˜XÚÙÜ›Ý[™Ú][ˆ\ÜXÝ˜][ÈÙˆNŒK‚‹H›ÝÛHXÝ[ÛœÈ™X]\™H]ZXÚËXYÛÝ[\ˆ[È]^[™Û[ÛÝHÚ[ˆ™\ÜÙY‚‚ˆÈÈÈÚ\È	ˆ˜YÙ\Â‹H[\Ú\Y
›Ý[™YY[
HYÜÈ\Ú[™È\Ý[[ÈÚ]X]Ú[™ÈØ]\˜]Y^‚ˆH›\ÚØ[NˆÑ‘‘ÑQ˜XÚÙÜ›Ý[™Ú]ÑPMNØ^‚ˆH[ˆÝØÚÎˆÑPÑ‘X˜XÚÙÜ›Ý[™Ú]ÌNMŽX^‚ˆHYZ[ˆÜ™\ˆ[™[™ÎˆÑ‘QŒÐÍØ˜XÚÙÜ›Ý[™Ú]ÑMÍÌ˜^‚‚ˆÈÈÈ›Ü›H[œ]È	ˆÙX\˜Ú‹H[œ]ÈÚ]]HZ[š[][HÝXÚ\™Ù]ZYÚÚ]Ñ‘‘‘‘‘˜˜XÚÙÜ›Ý[™[™ÐÐ‘QLXÝ][™K‚‹HXÝ]™HÝ]\È™X]\™HHœÌNMŽXš[™ÈÚ]ÛÙÜ™Y[ˆ[Ù™œÙ]‚‹H›Ø][™ÈÙX\˜ÚXY\ˆÛÛZ[œÈš[[™ÝX[XÙZÛ\ˆ^
¸)ª¸)¨ø)ãx)«È8)¥¸)àx) x)§8)àx)ª‹‹ˆÈÙX\˜Ú›ÙXÝË‹‹ˆ˜
K‚‚ˆÈÈÈYZ[ˆ\Ú›Ø\™ÛÛ\Û™[Â‹H
Š‘]HX›\ÊŠŽˆ™Xœ˜K[\ÜÈ^[Ý]\Ú[™È\Üš^›Û[›Ü™\œËÛÛ\XÝÙ[Y[™È
ÜXÙK\ÛX™\XØ[ÜXÙK[YÜš^›Û[
K[™ÝXÚÞHXY\œË‚‹H
Š“Y]šXÈØ\™ÊŠŽˆZ[š[X[Ø\™ÈÚ]š[X\žH˜[YH\Ü^\È[ˆXY[™K[YXØÛÛ\[šYYžH\™XÝ[Û˜[[™XØ]ÜœÈ
Ü™Y[ˆ™[™\œ›ÝÜÈ›Üˆ™]™[YKÛÜ˜[[™XØ]ÜœÈ›Üˆ™]\›œÊK