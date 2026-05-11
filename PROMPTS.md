# LITERA — Enhanced Stitch Prompts for All Screens

> Generated using the `enhance-prompt` skill methodology.  
> Each prompt references the `DESIGN.md` design system and is structured for optimal Stitch generation.

---

## Screen 1: Homepage (Hero + Feature Overview)

A sophisticated, modern financial literacy education landing page for Bank Indonesia West Java. The aesthetic is "Refined Civic Modernism" — authoritative yet approachable, with deep navy and warm gold accents on an airy white canvas. A prominent hero slider dominates the viewport with clean top navigation above.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Mobile-first responsive
- Theme: Light, modern institutional, civic-premium
- Background: Cool Cloud White (#FAFBFD) for page body
- Hero Background: Deep Navy Gradient (linear-gradient 135deg, #003366 → #004A8F → #0066B3) with subtle Mega Mendung batik SVG pattern overlay at 5% opacity
- Primary Accent: Institutional Navy (#003366) for headings and navigation
- Secondary Accent: Ceremonial Gold (#C5A248) for CTA buttons and decorative accents
- Interactive: Bright Patriot Blue (#0066B3) for links and hover states
- Text Primary: Charcoal Ink (#1F2937)
- Text Secondary: Stone Gray (#6B7280)
- Font: Plus Jakarta Sans — ExtraBold for hero title, SemiBold for nav and labels, Regular for body
- Corners: Generously rounded (12–16px for cards and buttons)
- Shadows: Whisper-soft diffused shadows on cards, deepening on hover

**Page Structure:**
1. **Top Navigation Bar:** Cloud White background with subtle bottom shadow, fixed on scroll. Logo "LITERA" on the left in Institutional Navy with gold accent dot. Menu items: Beranda, Materi, Tentang Kami, Kontak. Right side: gold-bordered "Mulai Belajar" CTA button.
2. **Hero Slider Section:** Full-width, 85vh height. Deep navy gradient background with Mega Mendung cloud pattern watermark. Large hero title "Edukasi Literasi Keuangan Jawa Barat" in white ExtraBold Plus Jakarta Sans. Subtext explaining KPwBI West Java's mission. Two CTA buttons: "Jelajahi Materi" (gold filled), "Tentang Kami" (white ghost). 2D flat illustration of financial literacy concepts on the right side. Dot navigation at bottom (gold active, white inactive).
3. **Statistics Bar:** Four stat cards in a row — "Materi Edukasi", "Peserta Didik", "Wilayah Cakupan", "Tingkat Kepuasan" — with large numbers in navy and labels in stone gray on semi-transparent navy background.
4. **Featured Materials Grid:** H2 "Materi Pembelajaran" with gold accent underline. 3-column card grid of educational materials with thumbnail illustrations, category badges, titles, and brief descriptions. Cards have 16px rounded corners, soft shadow, hover lift effect.
5. **Why Financial Literacy Section:** Split layout — left side with 2D illustration, right side with 3 feature cards: "Literasi Digital", "Manajemen Keuangan", "Investasi Aman". Each card has a navy icon, bold title, and brief description.
6. **CTA Banner:** Full-width Institutional Navy background with Mega Mendung pattern. "Mulai Perjalanan Literasi Keuanganmu" in white heading, gold CTA button "Ikuti Post-Test".
7. **Footer:** Dark navy (#001A33) background with Mega Mendung pattern at 8% opacity. Three columns: LITERA branding + description, navigation links, contact info (KPwBI West Java address, phone, email). Bottom bar with copyright and Bank Indonesia logo. Mega Mendung wave decoration as a top border.

---

## Screen 2: Material Grid Page (Materi)

A clean, organized education materials catalog page for browsing financial literacy content. Grid-focused layout with filtering and categorization.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Mobile-first responsive
- Theme: Light, modern, educational catalog
- Background: Cloud White (#FAFBFD) body, Soft Parchment (#F5F3EF) card backgrounds
- Primary: Institutional Navy (#003366) for headings
- Accent: Ceremonial Gold (#C5A248) for category badges and active filters
- Interactive: Bright Patriot Blue (#0066B3) for links and filter interactions
- Text: Charcoal Ink (#1F2937) for titles, Stone Gray (#6B7280) for metadata
- Font: Plus Jakarta Sans throughout
- Cards: 16px rounded corners, soft shadow, hover lift animation

**Page Structure:**
1. **Top Navigation Bar:** Same as Homepage, with "Materi" nav item active (gold underline indicator).
2. **Page Header:** Left-aligned H1 "Materi Edukasi Keuangan" in Institutional Navy. Subtext describing the content library. Soft Mega Mendung watermark in background.
3. **Category Filter Bar:** Horizontal scrollable pill-shaped filter buttons: "Semua", "Literasi Digital", "Perencanaan Keuangan", "Investasi", "Perbankan", "UMKM". Active filter in Institutional Navy filled, inactive in bordered gray.
4. **Material Grid:** 3-column responsive grid (2 on tablet, 1 on mobile). Each card contains: Material thumbnail (2D illustration), category badge in gold, title in navy bold, 2-line description preview, reading time estimate in gray, "Baca Selengkapnya" link in patriot blue. Cards animate in with staggered fade-up on scroll.
5. **Pagination:** Centered pagination with number buttons. Active page in navy circle, hover in blue.
6. **Footer:** Same as Homepage.

---

## Screen 3: Material Detail Page (Reading + Post-Test)

An immersive reading page for individual financial literacy materials, with an integrated quiz component that appears after content completion.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Mobile-first responsive
- Theme: Light, focused reading experience
- Background: Cloud White (#FAFBFD), content area in true white (#FFFFFF)
- Primary: Institutional Navy (#003366) for article title
- Accent: Ceremonial Gold (#C5A248) for section dividers and quiz CTA
- Interactive: Bright Patriot Blue (#0066B3) for inline links
- Text: Charcoal Ink (#1F2937) at 18px with 1.7 line-height for maximum readability
- Font: Plus Jakarta Sans — Bold for headings, Regular for body
- Article: Max-width 720px centered layout for optimal reading

**Page Structure:**
1. **Top Navigation Bar:** Same as other pages with breadcrumb below: "Beranda > Materi > [Category] > [Title]".
2. **Article Header:** Full-width hero banner with category badge, article title in large navy ExtraBold, reading time and date metadata in gray. 2D illustration banner below.
3. **Article Content:** Centered, max-width 720px reading column. Rich text with proper heading hierarchy (H2, H3), bullet lists, callout boxes with blue-left-border accent, embedded optimized images. Content paragraphs in 18px Regular Plus Jakarta Sans with generous line-height.
4. **Content Completion Indicator:** A subtle progress bar at the top of the viewport (thin 3px gold bar) showing reading progress.
5. **Post-Test Section (conditionally rendered):** After reading, a section slides in with H2 "Uji Pemahaman Anda". Quiz question cards with numbered badges. Multiple choice answers as selectable cards. "Submit Jawaban" gold CTA button at the bottom.
6. **Score Modal:** Frosted glass overlay with centered result card. Animated circular progress ring showing score percentage. Color-coded: gold ring for ≥80%, amber for 50–79%, red for <50%. Congratulatory message and "Kembali ke Materi" button.
7. **Related Materials:** 3-card horizontal scroll of related materials below the quiz.
8. **Footer:** Same as other pages.

---

## Screen 4: About Page (Tentang Kami)

An informational page about KPwBI West Java and the LITERA platform mission. Trustworthy, professional tone with cultural identity.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Mobile-first responsive
- Theme: Light, institutional, culturally grounded
- Background: Cloud White (#FAFBFD) with Mega Mendung watermark sections
- Primary: Institutional Navy (#003366) 
- Accent: Ceremonial Gold (#C5A248) for highlights
- Text: Charcoal Ink (#1F2937), Stone Gray (#6B7280)
- Font: Plus Jakarta Sans

**Page Structure:**
1. **Top Navigation Bar:** "Tentang Kami" active.
2. **Hero Banner:** Institutional Navy gradient background with Mega Mendung pattern. "Tentang LITERA" in white bold heading. Subtext about the platform's purpose.
3. **Mission Section:** Split layout — 2D illustration left, mission statement right with H2 "Visi & Misi". Three mission points with gold-numbered list items.
4. **About KPwBI Section:** Information about Bank Indonesia Representative Office West Java. Professional tone with organizational details.
5. **Team / Division Section (optional):** Cards showing relevant divisions or contact persons.
6. **CTA Section:** Gold button "Mulai Belajar Sekarang" with navy background section.
7. **Footer:** Same.

---

## Screen 5: Contact Page (Kontak)

A sleek contact page with form, office information, and embedded Google Map.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Mobile-first responsive
- Theme: Light, accessible, professional
- Background: Cloud White (#FAFBFD)
- Primary: Institutional Navy (#003366) for heading
- Accent: Ceremonial Gold (#C5A248) for submit button
- Form: Soft Parchment (#F5F3EF) input backgrounds, Bright Patriot Blue (#0066B3) focus borders
- Text: Charcoal Ink (#1F2937)
- Font: Plus Jakarta Sans

**Page Structure:**
1. **Top Navigation Bar:** "Kontak" active.
2. **Page Header:** "Hubungi Kami" in navy bold heading with supportive subtext.
3. **Two-Column Layout:**
   - **Left: Contact Form** — Name, Email, and Message fields styled with parchment backgrounds and blue focus rings. "Kirim Pesan" gold CTA button at bottom. Form validates client-side.
   - **Right: Contact Information** — KPwBI West Java office address with icon, phone number with icon, email with icon. Styled as a card with subtle navy left-border accent.
4. **Google Maps Embed:** Full-width embedded map below the form section showing KPwBI West Java office location. 400px height with rounded corners and soft shadow.
5. **Footer:** Same.

---

> [!NOTE]
> All screens share the same navigation bar, footer, and design tokens defined in `DESIGN.md`. 
> Use the Mega Mendung batik pattern consistently as described in the design system — always subtle, always geometric, never competing with content.
