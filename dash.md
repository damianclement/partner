1. Introduction & Goals 🎯
Purpose: This guide provides foundational UI/UX principles and specific component styling for the OBUS PARTNER dashboard.

Goals:

Consistency: Ensure a uniform look and feel across the entire dashboard.

Usability: Create an intuitive and efficient experience for administrators managing partners, agents, users, and systems.

Branding: Reinforce the OBUS PARTNER identity through the consistent application of brand colors and visual elements.

Clarity: Present complex data and management functions in an understandable way.

2. Layout Structure 📐
The dashboard will utilize a standard sidebar + top bar layout for easy navigation and access to primary functions.

Top Bar (Header):

Height: ~64px - 72px.

Background: #050934 (Main Brand Color).

Elements:

Left: OBUS PARTNER Logo (ensure high contrast, possibly white or light version).

Center (Optional): Global Search Bar.

Right: Notification Icon, User Profile Avatar/Menu (displaying username, role, logout option).

Text/Icons: White (#FFFFFF) or a very light grey for high contrast against the dark blue background.

Sidebar (Navigation):

Width: ~240px - 280px (Consider collapsible option for wider content view).

Background: #050934 (Main Brand Color).

Elements:

Top: OBUS PARTNER Logo (if not prominent enough in the top bar or for collapsed state).

Navigation Links: Vertical list of main dashboard sections (derived from API tags like Partner Management, Agent Management, User Management, Bus Systems, Bookings, Settings). Use icons alongside text.

Text/Icons (Default): A light grey or off-white (e.g., #E0E0E0) for readability.

Text/Icons (Active/Hover): White (#FFFFFF) or #FC7F05 (Minor Brand Color) for the active link background/indicator or icon color. Use subtle background highlighting on hover (slightly lighter shade of #050934).

Content Area:

Background: A light, neutral color (e.g., #F5F7FA or a very light grey) to make content stand out.

Padding: Consistent padding around the content area (e.g., 24px).

3. Color Palette 🎨
Use the brand colors strategically, complemented by neutrals and functional colors.

Primary: #050934 (Dark Blue/Navy)

Usage: Sidebar, Top Bar, Primary Buttons, Backgrounds for key sections/headers, Primary Text on light backgrounds.

Accent: #FC7F05 (Orange)

Usage: Call-to-Action Buttons (e.g., "Create New"), Active Navigation Indicators, Highlights, Focus Rings, Important Icons, possibly some Data Visualization elements. Use sparingly to draw attention.

Backgrounds:

Main Content: #F5F7FA (Light Grey/Off-white)

Cards/Containers: #FFFFFF (White)

Text:

Primary Text (on light bg): A very dark grey, close to black (e.g., #212121) or #050934.

Secondary Text: Mid Grey (e.g., #757575).

Text on Dark Backgrounds (#050934): White (#FFFFFF) or Light Grey (#E0E0E0).

Links: A standard blue or potentially #050934 underlined. Accent color #FC7F05 for critical links if needed.

Borders & Dividers: Light Grey (e.g., #E0E0E0).

Status Colors:

Success: Green (e.g., #4CAF50)

Error/Danger: Red (e.g., #F44336)

Warning: Yellow/Amber (e.g., #FFC107)

Info: Blue (e.g., #2196F3)

Active/Verified: Green or potentially the Accent #FC7F05 depending on context.

Inactive/Suspended: Grey (#757575) or Warning color.

4. Typography 📄
Choose a clean, readable sans-serif font family.

Font Family: Inter, Roboto, Lato, Open Sans (Choose one and use consistently).

Headings:

H1 (Page Titles): ~24px-32px, Bold (#050934)

H2 (Section Titles): ~20px-24px, Bold (#050934)

H3 (Card Titles): ~16px-18px, Semi-Bold (#050934)

Body Text: ~14px-16px, Regular (Dark Grey #212121)

Labels/Metadata: ~12px-14px, Regular or Medium (Mid Grey #757575)

Line Height: Generally 1.5x the font size for good readability.

5. Core Components 🧱
Style common components using the defined palette and typography.

Buttons:

Primary: Background #050934, Text #FFFFFF. Hover: Slightly lighter blue. Use for main positive actions (Save, Submit).

Accent/CTA: Background #FC7F05, Text #FFFFFF or #050934 (ensure contrast). Hover: Slightly darker orange. Use for primary page actions (Create Partner, New Agent).

Secondary/Default: Background #FFFFFF, Border #E0E0E0 or #050934, Text #050934. Hover: Light grey background. Use for secondary actions (Cancel, View Details).

Destructive: Background Red (#F44336), Text #FFFFFF. Use for actions like Delete, Revoke.

Style: Slightly rounded corners (e.g., 4px-6px border-radius). Consistent padding.

Forms:

Labels: 12px-14px, Medium weight, Mid Grey (#757575).

Inputs/Textareas: Background #FFFFFF, Border Light Grey (#E0E0E0). On focus: Border #FC7F05 or a standard blue. Height ~40px. Padding inside.

Dropdowns/Selects: Style similarly to inputs, include dropdown arrow icon.

Help Text: 12px, Regular, Light Grey (#9E9E9E).

Validation Errors: Use Red (#F44336) for text and/or border. Include clear error messages.

Tables: (Essential for managing users, partners, agents, bookings)

Headers: Background: Light Grey (#F5F7FA) or a very light shade of #050934. Text: #050934 or Mid Grey, Semi-Bold, ~12px-14px.

Rows: Alternating row colors (e.g., #FFFFFF and #F9F9F9) can aid readability for dense data. Border: Light Grey (#E0E0E0) between rows/columns.

Cell Padding: Consistent padding (e.g., 12px 16px).

Actions: Use icon buttons (Edit, Delete, View) for row-specific actions.

Cards/Containers:

Background: #FFFFFF.

Border: Optional, Light Grey (#E0E0E0).

Shadow: Subtle box-shadow for depth.

Padding: Consistent internal padding (e.g., 16px or 24px).

Header (Optional): Use H3 styling, potentially with a light grey background or bottom border.

Badges/Tags: (Useful for Status, Tier, Type)

Use status colors with contrasting text (often white).

Slightly rounded corners. Small font size (10px-12px), uppercase maybe. Padding around text.

Example: ACTIVE badge with green background. DIAMOND tier with #FC7F05 background.

Modals:

Overlay: Semi-transparent dark background.

Modal Container: White background, subtle shadow, rounded corners.

Header, Content, Footer structure. Close button (X icon).

6. Iconography ✨
Set: Choose a consistent icon library (e.g., Material Symbols, Font Awesome, Feather Icons).

Usage: Use icons in the sidebar navigation, buttons (especially icon-only buttons in tables), info tips, and status indicators.

Sizing: Maintain consistent sizing (e.g., 18px, 20px, 24px).

Color: Match the color of the associated text or use contextually appropriate colors (e.g., brand colors, status colors).

7. Spacing & Grid 📏
System: Use a consistent spacing system (e.g., 8pt grid). All margins, padding, and dimensions should be multiples of 8px (8, 16, 24, 32, 40...).

Consistency: Apply spacing rules uniformly across all elements and layouts.

8. Interaction States 👇
Provide clear visual feedback for interactive elements.

Hover: Change background color (slightly lighter/darker), text decoration (underline links), or add a subtle shadow/border.

Focus: Use distinct focus rings (outline), often using the Accent color #FC7F05 or a standard blue, especially for accessibility (keyboard navigation).

Active: Show a pressed state for buttons (e.g., slightly darker background or inset shadow). Highlight active navigation links.

Disabled: Reduce opacity (e.g., 50%), use light grey colors for background/text, and use a 'not-allowed' cursor.

9. Accessibility (A11y) ♿
Color Contrast: Ensure sufficient contrast between text and background colors (WCAG AA minimum). Use contrast checkers. Pay attention to text on #050934 and #FC7F05.

Keyboard Navigation: All interactive elements must be navigable and operable using a keyboard. Ensure logical focus order.

Semantic HTML: Use appropriate HTML tags (buttons for actions, links for navigation, proper heading structure).

Labels: Ensure all form fields have clear, associated labels.

Alt Text: Provide descriptive alt text for images if used.