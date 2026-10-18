# ZakaTy — Free Online Tools Platform & Digital Business Profiles

**ZakaTy** is a modern, privacy-first web application combining a 100% free online PDF and image utilities platform with a professional digital business card and profile builder inspired by the functionality of HiHello.

---

## 1. Project Identity & Founder Information

- **Brand Name:** ZakaTy
- **Logo:** Modern gradient heart symbol with an integrated stylized letter 'Z'
- **Founder:** ABDESSAMIA ABDERRAZAK
- **Country of Residence:** Spain
- **Contact Email:** [abderrazak.abdessamia5@gmail.com](mailto:abderrazak.abdessamia5@gmail.com)
- **Supported Languages:** English, Arabic (with native Right-to-Left layout & Cairo typography), French, and Spanish
- **Core Principle:** 100% Client-side file processing — your documents and photographs never leave your device.

---

## 2. Core Features & Architecture

### A. PDF Processing Engine (`pdf-lib` + `pdfjs-dist`)
1. **Merge PDF:** Combine multiple PDF documents with drag-and-drop reordering.
2. **Split & Extract PDF:** Extract specific pages or custom ranges (e.g. `1, 3-5`).
3. **Images to PDF (Critical Bug Prevention):**
   - Strictly accepts genuine images (JPEG, PNG, WebP).
   - Validates binary magic byte headers (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, `RIFF...WEBP` for WebP).
   - Immediately detects and rejects PDF files renamed to `.jpg` or `.png`.
   - Reorder images, rotate orientation, and embed with natural aspect ratio or standard A4 page layout.
4. **PDF to JPG/PNG:** Renders individual PDF pages to high-resolution images using HTML5 Canvas.
5. **Compress PDF:** Streamlines object streams to reduce file footprint without degrading text clarity.
6. **Watermark, Rotate & Numbering:** Apply customizable diagonal watermark stamps, rotate pages (90°, 180°, 270°), and add "Page X of Y" headers/footers.

### B. Image Processing Engine (HTML5 Canvas + Browser APIs)
1. **Format Converter:** Seamlessly convert between JPEG, PNG, and WebP with transparency preservation.
2. **Resize:** Scale by exact pixel dimensions with aspect ratio lock or preset percentages (25%, 50%, 75%, 100%).
3. **Crop & Transform:** Visual cropping with presets (1:1 square, 4:3 classic, 16:9 widescreen) plus 90° rotation and horizontal/vertical flipping.

### C. QR Code Generator & Scanner (`qrcode` + `jsQR`)
1. **Generator:** Create high-resolution QR codes for websites, digital profiles, Google Maps locations, Google Reviews, Wi-Fi networks, and contact vCards.
2. **Custom Branding:** Foreground & background color customization, center ZakaTy heart-Z logo embedding, and export to high-res PNG or vector SVG.
3. **Scanner:** Real-time device camera scanning loop and image file drag-and-drop decoder.

### D. NFC Business Card Writer
1. **Web NFC API Integration:** Detects device compatibility (`NDEFReader`) and writes permanent NDEF URL records to physical NFC tags (NTAG213, NTAG215, NTAG216).
2. **Cross-Platform Compatibility Guide:** Provides a step-by-step 1-click URL copy workflow for iPhone users using free tools like "NFC Tools" (since Safari reserves direct browser NFC writing).

### E. Digital Business Profile Builder (HiHello-style)
1. **Standalone Public URL:** Each profile has its own human-readable, independent URL route: `https://YOUR-DOMAIN.com/#/p/your-slug` or `/p/your-slug`.
2. **Comprehensive Customization:**
   - Name, title, company, category, bio, and company mission.
   - Profile photo upload, company logo, and cover banner.
   - Direct call phone, WhatsApp chat, email, website link, and address.
   - Real vector brand icons for LinkedIn, Instagram, Facebook, TikTok, YouTube, X, Telegram, and GitHub.
   - Google Business integration: direct buttons for "Leave a Google Review" and "Find us on Google Maps".
   - 6 theme color accents (Indigo, Rose, Emerald, Amber, Cyan, Slate).
3. **Save Contact (vCard 3.0):** Generates compliant `.vcf` files with proper character escaping for Apple Contacts, Google Contacts, and Outlook.
4. **Local & Cloud Persistence:** Profiles and analytics (views, vCard downloads, shares) are preserved persistently.

---

## 3. Automated Unit Testing

Core logic is decoupled into pure modules and tested using Node's native test runner (`node:test`):

```bash
# Run unit tests
node --test src/utils/*.test.ts
```

Tests cover:
- Magic byte detection for JPEG, PNG, WebP, and PDF.
- Rejection of PDF files disguised as `.jpg` images.
- URL slug generation and reserved keyword protection (`admin`, `api`, `login`, etc.).
- vCard 3.0 string formatting and special character escaping.

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Build production bundle
npm run build

# Run TypeScript linter
npm run lint
```

---

## 5. Free Hosting & Deployment Guide

### Option 1: Cloudflare Pages / Vercel / Netlify (Recommended Free Tier)
1. Connect your GitHub repository to Cloudflare Pages or Vercel.
2. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Deploy! Both providers provide free HTTPS certificates and global CDN distribution.

### Option 2: Google Cloud Run (Container / Full-Stack)
1. Build the container image or deploy directly using Google Cloud Build.
2. Set environment variables in the Cloud Run configuration console.
3. Bind your custom domain via Google Cloud Run Domain Mappings.

### Connecting a Custom Domain:
1. Purchase your desired domain (e.g. from Namecheap, Cloudflare Registrar, or Google Domains).
2. In your DNS manager, add:
   - `CNAME` record pointing `@` or `www` to your hosting provider's assigned endpoint.
3. SSL certificates are provisioned automatically via Let's Encrypt / Cloudflare Edge SSL.

---

## 6. Google Sign-In Setup Guide

1. Navigate to the **Google Cloud Console** (`https://console.cloud.google.com`).
2. Go to **APIs & Services** ➔ **Credentials**.
3. Click **Create Credentials** ➔ **OAuth Client ID**.
4. Select **Web application**.
5. Add your domain to **Authorized JavaScript origins** (e.g. `https://zakaty.tools` and `http://localhost:3000`).
6. Copy the generated **Client ID** and either:
   - Enter it in the **Admin Console** under the **Google OAuth & Keys** tab, OR
   - Set it as `VITE_GOOGLE_CLIENT_ID` in your `.env` file.

---

## 7. Security & Legal Pre-Launch Checklist

- [x] Client-side processing ensured for all PDF and image manipulations.
- [x] Strict magic byte inspection active to reject spoofed files.
- [x] GDPR & Spanish LOPD-GDD compliant Privacy Policy published.
- [x] Essential cookie consent banner without deceptive patterns.
- [x] Public contact email verified and configurable from the Admin panel.
- [x] Founder identity and Spanish country of residence transparently stated.
- [x] Digital profile URLs protected against reserved system routing paths.
