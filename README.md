# Livedigit Premium Quotation Builder

A clean, modern, premium, and fully functional quotation builder web application built with **Vite, React 19, JavaScript (JSX), and Tailwind CSS**.

Designed for digital agencies, software consultancies, and modern service businesses to generate professional quotations with live pricing calculations and instant executive PDF generation.

---

## ✨ Features

- **Executive UI/UX**: SaaS-grade typography (Inter), clean card aesthetics, subtle border styling, and refined Livedigit corporate branding.
- **Interactive Quotation Table**:
  - Exact 5-column architecture: *Services*, *Quantity*, *Basic Plan*, *Advanced Plan*, *Amount*.
  - Plan selection cards for Basic vs. Advanced tiers with instant price updates.
  - Stepper controls `(-) / (+)` with direct numeric input and minimum quantity enforcement (`qty >= 1`).
  - Preloaded with 8 core sample services (Website Design, Web Development, SEO, Google Ads, Meta Ads, Social Media, Content Creation, Website Maintenance).
- **Service Catalog & Custom Scope**:
  - Modal catalog to browse and add predefined services.
  - Full support to add custom bespoke services with custom Basic and Advanced pricing.
  - Real-time duplicate entry prevention and removal controls.
  - Elegant empty state with 1-click restore.
- **Dynamic Price Summary & Indian Tax (GST)**:
  - Real-time Subtotal, Discount (% or fixed ₹), Taxable Amount, GST (0%, 5%, 12%, 18%, 28%), and Grand Total.
  - Safe discount bounds (never produces a negative taxable amount).
  - Indian Rupee (`₹`) formatting using the `en-IN` locale.
  - Automatic **Amount in Words** generator (e.g., *"Rupees One Lakh Sixty-Five Thousand Two Hundred Only"*).
  - 1-click summary copy to clipboard for WhatsApp/Email sharing.
- **Executive PDF Quotation Generation**:
  - Generated using `jspdf` and `jspdf-autotable`.
  - High-resolution corporate logo branding.
  - Multi-column issuer & client metadata cards.
  - Clean A4 grid table with auto-wrapping, unit prices, quantities, and totals.
  - Bank and remittance details block.
  - Numbered Terms & Conditions, notes, and authorized signatory line.
  - Page numbering (*"Page X of Y"*) and compliance footer.
  - Smart pre-generation field validation (verifies client name & services).
  - Interactive live preview modal before download.
- **Persistence & State Resilience**:
  - LocalStorage persistence prevents data loss on page refresh.
  - Safe reset confirmation dialog to prevent accidental erasure.
- **Fully Responsive**:
  - Fluid desktop layout with sticky pricing sidebar.
  - Proportional tablet layout.
  - Mobile card view with touch-friendly plan toggles and floating bottom total bar.

---

## 🛠️ Tech Stack

- **Framework**: Vite + React 19 (ESM, JSX)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Document Engine**: jsPDF & jsPDF-AutoTable
- **Delight Effects**: canvas-confetti

---

## 📁 Project Architecture

```
quotation-builder/
├── public/
│   └── livedigit-logo.png
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AddServiceModal.jsx     # Predefined catalog + custom service modal
│   │   ├── CustomerDetails.jsx     # Client & quotation reference inputs
│   │   ├── Header.jsx              # Brand header with primary actions
│   │   ├── PdfPreviewModal.jsx     # Embedded interactive PDF preview
│   │   ├── PriceSummary.jsx        # Subtotal, discount, GST, and totals card
│   │   ├── QuotationTable.jsx      # Main quotation table & empty state
│   │   ├── ResetConfirmModal.jsx   # Safe reset confirmation dialog
│   │   ├── ServiceRow.jsx          # Desktop table row & mobile card view
│   │   ├── TermsAndNotes.jsx       # Customizable terms, notes & bank info
│   │   └── Toast.jsx               # Feedback notifications
│   ├── data/
│   │   ├── logoBase64.js           # Embedded brand assets for PDF engine
│   │   └── serviceCatalog.js       # Centralized service catalog and defaults
│   ├── utils/
│   │   ├── calculations.js         # Single source of truth math engine
│   │   ├── formatters.js           # en-IN currency and words formatter
│   │   └── pdfGenerator.js         # Executive A4 PDF builder
│   ├── App.jsx                     # Top-level state and orchestration
│   ├── index.css                   # Global styles & Tailwind directives
│   └── main.jsx                    # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Running the Project

```bash
# Navigate to the project directory
cd "C:\Users\user\.gemini\antigravity\scratch\quotation-builder"

# Start the development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.
