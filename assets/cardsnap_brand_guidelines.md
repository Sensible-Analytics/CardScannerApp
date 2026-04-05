# CardSnap Brand Guidelines

App name: CardSnap  
Tagline: Scan a card. Save a contact. Done.  
Version: 1.0  

---

## Brand Personality

CardSnap is a utility app. It does one thing and it does it fast. The brand reflects that: confident, clean, direct. Nothing decorative, nothing in the way. The visual language says "this works, right now, without reading anything."

Three words that drive every design decision: **instant**, **trustworthy**, **effortless**.

---

## Colour System

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `brand-primary` | `#0066FF` | Primary buttons, active states, links, logo background, selected indicators |
| `brand-primary-dark` | `#003DB3` | Pressed/active state of primary buttons, focus rings |
| `brand-primary-light` | `#E6F0FF` | Tinted backgrounds, selected row highlights, chip fills |

### Neutral Palette

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#111827` | Headings, body text, field values |
| `text-secondary` | `#6B7280` | Labels, hints, placeholder descriptions |
| `text-tertiary` | `#9CA3AF` | Disabled text, placeholder text in empty fields |
| `surface-primary` | `#FFFFFF` | Card backgrounds, modal surfaces, input backgrounds |
| `surface-secondary` | `#F5F7FA` | Screen backgrounds |
| `surface-tertiary` | `#EAECF0` | Dividers, pressed cell background |
| `border-default` | `#E5E7EB` | Input borders, row dividers |
| `border-strong` | `#D1D5DB` | Active input borders (unfocused) |

### Semantic Palette

| Token | Hex | Usage |
|---|---|---|
| `success` | `#10B981` | Contact saved confirmation, connected integration badge |
| `success-light` | `#D1FAE5` | Success banner background |
| `warning` | `#F59E0B` | Low-confidence OCR field indicator, review badge |
| `warning-light` | `#FEF3C7` | Warning banner background |
| `danger` | `#EF4444` | Error states, delete actions |
| `danger-light` | `#FEE2E2` | Error banner background |

### Dark Mode Overrides

Every colour token has a dark mode value. The light values above are defaults. Override using the system `colorScheme` API — never hardcode dark colours, always use the token.

| Light token | Dark value |
|---|---|
| `surface-primary` | `#1C1C1E` |
| `surface-secondary` | `#111111` |
| `surface-tertiary` | `#2C2C2E` |
| `text-primary` | `#F9FAFB` |
| `text-secondary` | `#9CA3AF` |
| `border-default` | `#374151` |
| `brand-primary-light` | `#0A1F4D` |

---

## Typography

### Type Scale

| Role | Size | Weight | Line Height | Token |
|---|---|---|---|---|
| Screen title | 28pt | 700 | 34pt | `type-screen-title` |
| Section heading | 22pt | 700 | 28pt | `type-heading` |
| Card name | 20pt | 600 | 26pt | `type-name` |
| Body | 16pt | 400 | 24pt | `type-body` |
| Label | 13pt | 500 | 18pt | `type-label` |
| Caption | 12pt | 400 | 16pt | `type-caption` |
| Button | 16pt | 600 | 20pt | `type-button` |
| Small button | 14pt | 500 | 18pt | `type-button-sm` |

### Font Family

Use the system font on both platforms. Do not ship a custom typeface.

```ts
// src/theme/typography.ts
export const fontFamily = {
  regular:  'System',                               // maps to SF Pro Text on iOS, Roboto on Android
  medium:   Platform.select({ ios: 'System', android: 'Roboto-Medium' }),
  bold:     Platform.select({ ios: 'System', android: 'Roboto-Bold' }),
  semiBold: Platform.select({ ios: 'System', android: 'Roboto-Medium' }),
};
```

System fonts render crisply at every size, load with zero overhead, and users trust them implicitly. A custom font adds ~300KB to bundle size and introduces rendering variance across OS versions.

---

## Spacing System

Base unit: **4pt**. All spacing values are multiples of 4.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4pt | Icon-to-label gap, tight pairs |
| `space-2` | 8pt | Inline element gap |
| `space-3` | 12pt | Icon padding, compact list item padding |
| `space-4` | 16pt | Standard padding inside cards and inputs |
| `space-5` | 20pt | Section padding horizontal |
| `space-6` | 24pt | Screen horizontal padding |
| `space-8` | 32pt | Between sections |
| `space-10` | 40pt | Large vertical breathing room |
| `space-12` | 48pt | Bottom safe area buffer |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6pt | Badges, chips, small tags |
| `radius-md` | 10pt | Input fields, small cards |
| `radius-lg` | 14pt | Buttons, field rows in lists |
| `radius-xl` | 20pt | Bottom sheets, modal cards |
| `radius-full` | 9999pt | Pills, toggle tracks, avatar circles |

---

## Elevation and Shadow

Do not use drop shadows on interactive elements. Use background colour contrast to create hierarchy instead.

The only permitted use of shadow is on bottom sheets and modals.

```ts
// Bottom sheet shadow — iOS and Android
export const sheetShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 8,   // Android
};
```

---

## Icon System

Use **Feather Icons** via `react-native-vector-icons/Feather`. Do not mix icon families. Do not use emoji as icons.

### Standard Sizes

| Context | Size | Stroke |
|---|---|---|
| Navigation bar | 24pt | 1.5pt |
| List row leading | 20pt | 1.5pt |
| Button icon | 18pt | 1.5pt |
| Inline / badge | 14pt | 1.5pt |

### Colour Rule

Icons inherit the colour of the text they accompany. Never use a different colour for an icon and its adjacent label unless the icon is a status indicator (success/warning/danger).

### Required Icons and Their Names

| Screen element | Feather name |
|---|---|
| Settings button | `settings` |
| Torch off | `zap` (outlined) |
| Torch on | `zap` (filled `#F59E0B`) |
| Upload from gallery | `image` |
| Back navigation | `arrow-left` |
| Name field | `user` |
| Company field | `briefcase` |
| Title / role field | `award` |
| Email field | `mail` |
| Phone field | `phone` |
| Website field | `globe` |
| Address field | `map-pin` |
| Save to Contacts | `user-plus` |
| Share vCard | `share-2` |
| Send to CRM | `send` |
| Success state | `check-circle` |
| Scan again | `refresh-cw` |
| Integrations | `grid` |
| Connected indicator | `check` |
| Disconnect | `x` |

---

## Component Specifications

### Primary Button

```
Height:          52pt
Border radius:   radius-lg (14pt)
Background:      brand-primary (#0066FF)
Background pressed: brand-primary-dark (#003DB3)
Background disabled: surface-tertiary (#EAECF0)
Text:            type-button, white
Text disabled:   text-tertiary
Padding H:       space-6 (24pt)
Min width:       full width of parent minus 2 × screen padding
```

### Secondary Button (outlined)

```
Height:          52pt
Border radius:   radius-lg
Border:          1.5pt, brand-primary
Background:      transparent
Background pressed: brand-primary-light (#E6F0FF)
Text:            type-button, brand-primary
```

### Tertiary Button (text only)

```
Height:          44pt
Background:      transparent
Text:            type-button-sm, brand-primary
Underline:       none
```

### Input Field Row (Review screen)

```
Height:          56pt min (grows with content)
Background:      surface-primary
Border bottom:   1pt, border-default
Border bottom focused: 2pt, brand-primary
Icon:            20pt Feather, text-secondary
Icon focused:    20pt Feather, brand-primary
Label:           type-caption, text-secondary, 8pt above field
Value text:      type-body, text-primary
Placeholder:     type-body, text-tertiary
Padding H:       space-4 (16pt)
Low confidence:  3pt left border, warning (#F59E0B)
```

### Section Header

```
Text:            type-caption, text-secondary, UPPERCASE, letter-spacing 0.8pt
Padding bottom:  space-2 (8pt)
Padding top:     space-8 (32pt) first section: space-4 (16pt)
Background:      surface-secondary
```

### List Row (Settings / Integrations)

```
Height:          52pt
Background:      surface-primary
Background pressed: surface-tertiary
Border bottom:   1pt, border-default (last row: none)
Leading icon:    20pt Feather, text-secondary, 16pt left margin
Label:           type-body, text-primary
Value / accessory: text-secondary or brand-primary, right margin 16pt
```

### Success Checkmark Animation

```
Circle:          72pt diameter, success (#10B981)
Checkmark:       white, 3pt stroke, round caps
Animation 1:     Circle stroke draws 0° → 360°, duration 400ms, ease-out
Animation 2:     Checkmark draws, duration 300ms, ease-out, 100ms delay after circle
Animation 3:     Whole group scale 0.8 → 1.0, spring, stiffness 120 damping 14
Auto-dismiss:    Navigate after 1500ms total
```

### Low-Confidence Field Indicator

```
Left border:     3pt solid, warning (#F59E0B)
Icon colour:     warning (#F59E0B)
Background:      transparent (do not tint the row background)
No tooltip:      the border is sufficient — do not add explanatory text
```

### Offline Banner

```
Height:          36pt
Background:      surface-tertiary
Text:            type-caption, text-secondary
Leading dot:     6pt circle, success (#10B981) if scanning works offline
Padding H:       space-6 (24pt)
Position:        between viewfinder and scan button, not at top of screen
```

### Toast / Inline Error

```
Height:          auto, min 44pt
Border radius:   radius-md (10pt)
Border left:     4pt, danger (#EF4444)
Background:      danger-light (#FEE2E2)
Text:            type-body, danger (#EF4444)
Padding:         space-4 (16pt)
```

---

## Animation Principles

### Durations

| Type | Duration | Easing |
|---|---|---|
| Micro (icon swap, colour change) | 120ms | ease-out |
| Transition (screen enter/exit) | 280ms | ease-in-out |
| Confirmation (success checkmark) | 400ms | ease-out |
| Spring (scale, bounce) | use spring config | stiffness 120, damping 14 |

### What to Animate

Animate only these properties: `opacity`, `transform` (scale, translate), `backgroundColor` (colour transitions only).

Never animate: `width`, `height`, `padding`, `margin`, `border-radius`. These cause layout recalculation and drop frames.

### Haptic Map

| Event | Haptic type |
|---|---|
| Document scanner captures image | `impactMedium` |
| OCR complete — ReviewScreen loads | `notificationSuccess` |
| Contact saved | `notificationSuccess` |
| Error (save failed, permission denied) | `notificationError` |
| Toggle switch | `impactLight` |
| Destructive action | `impactHeavy` |

---

## Logo Usage Rules

### Minimum Size

| Context | Minimum size |
|---|---|
| App icon on device | 29 × 29pt (Settings row) |
| In-app header | 32 × 32pt |
| Marketing material | 48 × 48pt |
| Print | 15mm × 15mm |

### Clear Space

Always maintain clear space equal to 25% of the icon width on all four sides. If the icon is 100pt wide, clear space is 25pt on every side. No other graphic element, text, or edge may enter this zone.

### Permitted Backgrounds

The icon is designed for a solid `#0066FF` background. When placing on other backgrounds:

| Background | Treatment |
|---|---|
| White or light grey | Use icon as-is |
| Dark surfaces | Use icon as-is — the blue reads well on dark |
| Coloured backgrounds | White version only (see below) |
| Photography | Place icon on a solid white 10pt padded container first |

### White Version

For coloured backgrounds, invert the logo: white background fill, blue card and brackets.

```
Background: white
Card body: #0066FF
Placeholder lines on card: #99BBFF
Viewfinder brackets: #0066FF, 90% opacity
Shutter dot: #0066FF
```

### Do Not

- Do not rotate the logo
- Do not change the tilt angle of the card (-4°)
- Do not recolour the background to any colour other than `#0066FF` or white
- Do not add a drop shadow to the icon
- Do not stretch or distort proportions
- Do not add text adjacent to the icon on a background that makes it hard to read
- Do not place the icon inside a second rounded container — it has its own corner radius

---

## App Store Assets

### Required Icon Sizes (iOS)

| Use | Size |
|---|---|
| App Store | 1024 × 1024px |
| iPhone home screen | 60 × 60pt @3x (180 × 180px) |
| iPhone Settings | 29 × 29pt @3x (87 × 87px) |
| iPad home screen | 76 × 76pt @2x (152 × 152px) |
| Spotlight | 40 × 40pt @3x (120 × 120px) |

### Required Icon Sizes (Android)

| Use | Size |
|---|---|
| Play Store | 512 × 512px |
| Launcher (xxxhdpi) | 192 × 192px |
| Launcher (xxhdpi) | 144 × 144px |
| Launcher (xhdpi) | 96 × 96px |
| Notification | 24 × 24dp @2x (48 × 48px) — white on transparent only |

Produce all sizes from the source SVG. Do not rasterise from a small PNG.

---

## Voice and Tone

### Writing Principles

- Write in plain English. No jargon.
- Use active voice. "Scan a card" not "A card can be scanned."
- Be direct. One sentence does the job of three.
- Never use exclamation marks.
- Never say "please" or "sorry" in UI copy — it adds friction.

### Button Labels

| Action | Label |
|---|---|
| Start scan | Scan Card |
| Confirm save | Save to Contacts |
| Export | Share as vCard |
| Push to CRM | Send to App |
| Retry scan | Scan Again |
| Open system settings | Open Settings |
| Connect an integration | Connect |
| Disconnect | Disconnect |
| Cancel | Cancel |

Never use: "Submit", "Confirm", "OK", "Proceed", "Continue"

### Error Messages

Always tell the user what to do next, not what went wrong technically.

| Situation | Message |
|---|---|
| Camera permission denied | Camera access is off. Open Settings to allow it. |
| Contacts permission denied | Contacts access is off. Open Settings to allow it. |
| OCR returned nothing | Could not read the card. Try better lighting or scan again. |
| Network error on CRM push | Could not reach [App Name]. Check your connection and try again. |
| Invalid API key | Connection failed. Check your API key in Settings. |

### Empty State Labels

| Field | Placeholder |
|---|---|
| Name | Add name |
| Company | Add company |
| Title | Add title |
| Email | Add email address |
| Phone | Add phone number |
| Website | Add website |
| Address | Add address |
