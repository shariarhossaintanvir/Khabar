# KHABAR (খাবার) — Bangladesh Food Delivery Web Platform
> **"Your Craving. Your Choice."**

A complete, modern, and production-ready food delivery web application designed specifically for the Bangladesh market. Built with React 18, TypeScript, Tailwind CSS, and Vite.

---

## 🌟 Highlights & Features

- **🎨 Original Visual Identity**: Warm Coral Red-Orange (`#FF4D2E`), Deep Charcoal (`#16191E`), and clean warm surface backgrounds (`#FAF9F5`). Zero Foodpanda magenta pink copying.
- **🌐 Full Bilingual Support**: Live one-tap toggle between **English** and **বাংলা (Bengali)** across all components, navigation, menus, and checkout stages.
- **📍 Dhaka Hyperlocal Location Picker**: Instant area selection (*Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Mohammadpur, Bashundhara R/A, Old Dhaka*).
- **🍛 Authentic Bangladeshi Catalog**: Top verified Dhaka restaurant brands (*Takeout, Sultan's Dine, Kacchi Bhai, Chillox, Pizza Burg, Rahman Biryani, Tehari Ghar, Star Kabab, Mezban Bari, Sweet Dreams*).
- **🍔 Customization Modal**: Real-time portion size selectors, signature sauces (*Naga Fire, Garlic Mayo*), and extra toppings (*Cheddar Slice, Beef Bacon, Fried Egg*).
- **🛒 Smart Cart Drawer**: Free delivery progress meter (free above ৳600 threshold), upsell add-ons, and promo coupon system (`KHABAR50`, `FIRSTORDER`, `FREESHIP`, `BIRYANI100`).
- **💳 Bangladesh Payment System**: Supports **bKash (1-tap)**, **Nagad**, **Credit/Debit Cards**, and **Cash on Delivery (COD)**.
- **🗺️ Live GPS Order Tracking**: Animated SVG Dhaka road map with moving rider motorbike, 5-stage timeline, and interactive simulated Rider Chat.
- **⭐ Post-Order Reviews**: 5-star multi-criteria breakdown (Food quality, Delivery speed, Packaging, Value).
- **📅 Table Reservations**: Family dawat booking system with seating preferences (*Indoor AC, Outdoor Terrace, Private VIP*).
- **🏢 Multi-Portal Business Ecosystem**:
  - **Admin Dashboard Console**: Real-time orders dispatch, hourly surge analytics chart, restaurant open/close toggles, and support tickets queue.
  - **Kitchen Partner POS**: 3-column live Kitchen Display System (New, Preparing, Ready), dish stock availability toggles, and table reservations.
  - **Rider Delivery App**: Online/Offline duty toggle, simulated GPS navigation HUD, 4-step delivery stepper, and weekly earnings ledger.

---

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Inter*, and *Hind Siliguri* for Bengali)
- **Currency**: Bangladeshi Taka (`৳` BDT)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/khabar-food-delivery.git
   cd khabar-food-delivery
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables (optional):
   ```bash
   cp .env.example .env.local
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy

- All sensitive keys, certificates, local `.env` files, logs, and build artifacts are strictly excluded via `.gitignore`.
- No credentials or API secrets are committed to this repository.

---

## 📄 License

This project is licensed under the MIT License.
