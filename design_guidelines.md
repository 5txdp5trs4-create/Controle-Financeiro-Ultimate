# Design Guidelines: Controle Financeiro Ultimate

## Design Approach

**Reference-Based Design** inspired by modern fintech applications (Mobills, Mint, Nubank, YNAB) with emphasis on data clarity, intuitive navigation, and professional financial interface aesthetics. The design prioritizes information hierarchy, quick data scanning, and user confidence in financial management.

## Core Design Principles

1. **Data-First Hierarchy**: Financial information takes visual priority over decorative elements
2. **Glanceable Metrics**: Key numbers (balance, totals) immediately scannable
3. **Trust & Clarity**: Professional, clean interface that inspires confidence in financial data
4. **Efficient Interactions**: Minimal steps between viewing data and taking action

---

## Typography System

**Primary Font**: Inter or Roboto via Google Fonts CDN
**Accent Font**: DM Sans or Manrope for headings

**Type Scale**:
- **Display Numbers** (Financial values): 32px-48px, font-weight: 700, tabular-nums
- **H1** (Tab titles): 24px, font-weight: 600
- **H2** (Section headers): 20px, font-weight: 600
- **H3** (Card titles): 16px, font-weight: 600
- **Body Large** (Transaction amounts): 18px, font-weight: 500
- **Body** (General text): 14px, font-weight: 400
- **Small** (Labels, metadata): 12px, font-weight: 400
- **Tiny** (Captions): 11px, font-weight: 400

**Number Treatment**: Use monospaced tabular numerals for all currency values to maintain vertical alignment in lists and tables. Format as R$ 1.234,56 (Brazilian standard).

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16, 20** (as in p-2, gap-4, space-y-6, mt-8, mb-12, py-16, px-20)

**Container Structure**:
```
Mobile: Full width with px-4 padding
Tablet/Desktop: Max-width 1280px (max-w-7xl) centered
```

**Grid System**:
- **Transaction Lists**: Single column on mobile, remains single column on desktop for readability
- **Summary Cards**: grid-cols-2 on mobile, grid-cols-4 on desktop
- **Chart Grid**: grid-cols-1 on mobile, grid-cols-2 on desktop (for dual chart display)
- **Goal Progress**: Single column throughout for focus

**Bottom Navigation Bar**:
- Fixed height: h-16 (64px)
- 5 equal-width tabs with icons and labels
- Icons: 24px from Material Icons CDN
- Active state: Bold icon with visual indicator (underline or filled icon)
- Persistent across all views

**Top Month Selector** (Início, Histórico, Estatísticas tabs):
- Sticky header, h-14 (56px)
- Center-aligned month/year text (18px, semibold)
- Left/right arrow buttons (40px × 40px touch targets)
- Horizontal padding: px-4

---

## Component Library

### 1. Summary Cards
**Structure**: Rounded container (rounded-xl) with internal padding p-4
- **Icon**: Top-left, 20px, inside subtle circular background (40px diameter)
- **Label**: 12px, uppercase, letter-spacing wide
- **Value**: 28px-32px, bold, tabular numerals
- **Change Indicator**: Small pill showing percentage change with arrow icon

### 2. Transaction List Items
**Height**: min-h-16, padding py-3 px-4
**Layout**: Flexbox with space-between
- **Left Section**: 
  - Icon in circular background (32px diameter)
  - Category text (14px, medium)
  - Description (12px, muted)
- **Right Section**:
  - Amount (16px, bold, tabular)
  - Date (11px, muted)
  - Action buttons (edit/delete) appearing on hover/tap

**Recurring Transaction Badge**: Small chip next to date showing recurrence type (e.g., "Mensal")

### 3. Charts (Canvas-based)
**Container**: Background panel with rounded-xl, padding p-6
**Title**: Above chart, 18px semibold, mb-4
**Legend**: Below or beside chart, 12px with colored indicators
**Responsive Sizing**: 
- Mobile: Full width, aspect-ratio 16:9
- Desktop: Constrained to max 600px width for readability

**Chart Types**:
- **Bar Charts**: For monthly evolution, investment gains/losses
- **Pie/Doughnut Charts**: Category distribution, investment portfolio
- **Line Charts**: Balance evolution over time

### 4. Form Inputs
**Input Fields**:
- Height: h-12 (48px)
- Border radius: rounded-lg
- Padding: px-4
- Font size: 16px (prevents zoom on iOS)
- Labels: 14px, mb-2, font-medium

**Currency Inputs**: 
- Prepend "R$" symbol inside input
- Right-aligned text
- Tabular numerals

**Select Dropdowns**: Match text input styling with chevron-down icon

**Buttons**:
- **Primary**: h-12, rounded-lg, px-6, 16px semibold text
- **Secondary**: Same size, outlined variant
- **Icon Buttons**: 40px × 40px square with centered 20px icon
- Touch targets minimum 44px × 44px on mobile

**Category Selector**: Grid of icon buttons (grid-cols-4 mobile, grid-cols-6 desktop) with icon + label below

**Recurrence Options**: Radio button group styled as segmented control or dropdown

### 5. Goal Progress Cards
**Structure**: Card with padding p-6, rounded-xl
- **Header**: Goal name (16px semibold) + target amount
- **Progress Bar**: h-3, rounded-full, with filled portion showing progress
- **Stats Row**: Current amount / Target amount, small text
- **Percentage**: Large (24px) on right side

### 6. Investment Portfolio Display
**Investment Item**:
- Split layout: Investment name + type | Amount + return rate
- Editable inline or via modal
- Return calculator showing estimated monthly gain

**Portfolio Chart**: Pie chart showing asset allocation by type

### 7. Salary Calculator Section
**Layout**: Grouped form fields in card
- **Gross Salary**: Large input (R$ X.XXX,XX)
- **Benefits Grid**: 2-column on mobile, 4-column on desktop (Vale-refeição, Vale-alimentação, Bônus, Outros)
- **Deductions**: Repeatable input rows with % or R$ toggle
- **Net Salary Display**: Highlighted calculation result (read-only, 32px bold)

### 8. Modals/Dialogs
**Transaction Modal**:
- Centered overlay with backdrop blur
- Max-width: 480px on desktop, full-width on mobile
- Padding: p-6
- Close button (X) top-right
- Form fields with generous spacing (space-y-4)

**Confirmation Dialogs** (for recurring transaction edits):
- Compact, max-width 400px
- Clear action buttons (Esta / Todas futuras)

### 9. Filter Controls
**Horizontal Tabs**: For type selection (Todas / Receitas / Despesas)
**Search Bar**: h-10, rounded-full, with search icon
**Date Range Picker**: Two date inputs side-by-side
**Apply/Reset Buttons**: Small, secondary style

### 10. Settings Screen
**User Profile Card**:
- Avatar (80px circle) + Name + Email
- Logout button below

**Theme Toggle**:
- Large toggle switch with sun/moon icons
- 24px icon size

**Action Buttons**:
- Full-width buttons with icons
- h-14, rounded-lg
- Export: Download icon
- Clear Data: Trash icon with warning state

**Footer Credits**:
- Text center-aligned
- 11px, muted
- Separated by horizontal line above
- Links in text

---

## Interactions & Animations

**Tab Transitions**: Fade in/out (200ms ease) when switching tabs
**Card Entry**: Stagger fade-up animation (100ms delay between items)
**Theme Toggle**: Smooth 300ms transition on all color properties
**Number Changes**: Count-up animation for balance updates (subtle, 500ms)
**Button States**: Scale slightly (0.98) on press, no elaborate hover effects
**Chart Animations**: Simple fade-in on load, no complex data transitions

**Loading State**: Optional initial splash screen (1s) showing "Controle Financeiro Ultimate" with subtle fade effect

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

**Mobile Adaptations**:
- Bottom nav bar always visible
- Month selector compact (smaller arrows, abbreviated month names acceptable)
- Charts full-width with scrollable legends
- Transaction list items stack all info vertically
- Modals slide up from bottom instead of center overlay

**Touch Interactions**:
- All interactive elements minimum 44px touch target
- Swipe gestures for month navigation (optional enhancement)
- Pull-to-refresh on transaction list (optional)

---

## Accessibility

- **Focus States**: 2px outline on all interactive elements
- **Color Independence**: Never rely solely on color (use icons + text)
- **Screen Reader**: Proper ARIA labels on all icons and charts
- **Keyboard Navigation**: Full tab-through support
- **High Contrast**: Ensure 4.5:1 contrast ratio for text

---

## Content Strategy

**Empty States**: 
- Friendly illustrations or icons (100px size)
- Helpful text: "Nenhuma transação ainda" + CTA button
- Actionable: "Adicione sua primeira transação"

**Error States**: Clear, non-technical Portuguese messages

**Success Feedback**: Toast notifications (top-right, 4s duration) for actions like "Transação adicionada com sucesso"

**Financial Tone**: Professional but approachable, using clear Brazilian Portuguese terminology

---

## Images

This finance application is data-driven and does not require photographic imagery. All visual elements are:
- **Icons**: Material Icons via CDN (20-24px standard sizes)
- **Charts**: Canvas-rendered graphs
- **Decorative**: Minimal geometric patterns in empty states only

No hero images needed. Focus entirely on data visualization clarity.