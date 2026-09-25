# KHABAR — Comprehensive Codebase Technical Overview
**Project Name:** KHABAR — Restaurant & Food Delivery Platform  
**Tagline:** *Your Craving. Your Choice. • আপনার ক্ষুধা, আপনার পছন্দ।*  
**Document Type:** Senior Architectural Codebase Specification & File-by-File Breakdown  
**Target Audience:** Technical Clients, Lead Developers, System Architects, Code Reviewers  
**Codebase Version:** 1.0.0 Production-Ready Architecture (Vite + React 18 + TypeScript 5)

---

## 1. Executive Codebase Summary

KHABAR is an urban on-demand food delivery web application engineered for the Bangladesh market. It features a complete three-way business ecosystem (Customer Storefront, Kitchen Partner KDS/POS, Rider Courier Network, and Super Admin Operations Console) coupled with a multi-tenant client-side architecture and ten dedicated security engines.

### Verified Technology Stack (Ground Truth from Codebase)

| Layer | Actual Technology in Codebase | Version | Purpose / Evidence |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `18.3.1` | Functional components, Hooks (`useState`, `useEffect`, `useCallback`, `useContext`) |
| **Language** | TypeScript | `~5.7.3` (Compiler: `tsconfig.app.json`) | Strict static type definitions across entities, modals, and contexts |
| **Build & Dev Tool** | Vite | `^6.2.0` (`vite.config.ts`) | Lightning-fast HMR development server and Rollup production bundler |
| **Styling** | Tailwind CSS & PostCSS | `3.4.17` & `8.5.3` | Custom color palette (`brand-500: #ff5a36`, `brand-600: #ff4d2e`, `charcoal-900: #16191e`, `surface-warm: #faf9f5`) |
| **Iconography** | Lucide React | `^1.16.0` | Accessible, tree-shakeable SVG icons |
| **Effects & Confetti** | Canvas Confetti | `^1.9.4` | Particle celebration upon successful delivery handoff |
| **Class Utilities** | `clsx` & `tailwind-merge` | `2.1.1` & `3.0.2` | Dynamic CSS class concatenation |
| **Legacy/3D Dependencies** | Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP, Lenis | `0.174.0`, `8.17.10`, `9.121.4`, `3.12.7`, `1.1.20` | Retained from initial 3D hero prototype; active platform is driven by `KhabarContext` |
| **Cryptography** | W3C Web Cryptography API (`globalThis.crypto.subtle`) | Native Web Standard | PBKDF2-SHA256 password hashing (100,000 iterations), constant-time string comparison, crypto OTP |
| **State Management** | React Context API | Native React 18 | Centralized `KhabarContext` managing reactive business states and portal routing |
| **Persistence** | HTML5 `localStorage` | Browser Native | Language selection (`khabar_lang`) |
| **Data Layer** | In-Memory Canonical Catalog | TypeScript Data Modules | Initialized from `src/data/khabarData.ts` and `translations.ts` |
| **Backend & Database** | **Client-side In-Memory Mock** | N/A | **No production backend server (Express/Nest/Django) or remote database (PostgreSQL/MongoDB/Prisma) is actively deployed.** All business rules, transactions, and state transitions are executed by client-side security engines. |

---

## 2. Project Directory Tree & Structural Analysis

```text
c:\Resturent website/
├── .env.example                     # Environment configuration template (API URLs, MFS IDs, rate limits)
├── .gitignore                       # Git exclusion rules (credentials, logs, node_modules, dist)
├── .oxlintrc.json                   # Fast static linter configuration
├── index.html                       # HTML5 entrypoint, Google Fonts, Content Security Policy (CSP) meta tags
├── package.json                     # Project manifest, npm scripts, dependencies
├── package-lock.json                # Deterministic dependency lockfile
├── postcss.config.js                # PostCSS plugins (Tailwind CSS, Autoprefixer)
├── README.md                        # Project documentation and architectural overview
├── SECURITY.md                      # Security vulnerability reporting policy
├── SECURITY_AUDIT.md                # 14-point STRIDE/OWASP vulnerability assessment
├── SECURITY_IMPLEMENTATION_REPORT.md# Detailed technical hardening report
├── tailwind.config.js               # Design system tokens (colors, fonts, shadows, borders)
├── tsconfig.app.json                # TypeScript project compilation options
├── tsconfig.json                    # TypeScript root project references
├── tsconfig.node.json               # Node compilation settings for Vite config
├── vercel.json                      # Vercel deployment configuration & HTTP security defense headers
├── vite.config.ts                   # Vite bundler configuration with @vitejs/plugin-react
│
├── public/                          # Static web assets served at root
│
└── src/                             # Application source code
    ├── main.tsx                     # DOM mounting entrypoint (createRoot -> StrictMode -> App)
    ├── App.tsx                      # Top-level view router & role-gated modal orchestrator
    ├── App.css                      # App-level styling rules
    ├── index.css                    # Tailwind CSS directives (@tailwind base, components, utilities)
    │
    ├── assets/                      # Static raster and SVG images
    │   ├── hero.png                 # Food banner imagery
    │   ├── react.svg                # React framework logo
    │   └── vite.svg                 # Vite tooling logo
    │
    ├── context/                     # Global State Management
    │   ├── KhabarContext.tsx        # PRIMARY STATE STORE: 2,006 lines governing the entire platform
    │   └── StoreContext.tsx         # Legacy context for 3D restaurant prototype
    │
    ├── data/                        # Canonical Business Data & Dictionaries
    │   ├── khabarData.ts            # Dhaka restaurant catalog, menus, locations, categories, coupons, riders
    │   ├── menuData.ts              # Legacy 3D prototype dishes and Dhaka delivery zones
    │   └── translations.ts          # Comprehensive English (en) & Bengali (bn) localization dictionary
    │
    ├── security/                    # 10 Enterprise Security Engines (Hardened Business Logic)
    │   ├── crypto.ts                # Web Cryptography PBKDF2, HMAC-SHA256, timingSafeEqual, numeric OTP
    │   ├── auth.ts                  # PBKDF2 credentials, account lockout (5 tries/15 min), session tokens
    │   ├── rbac.ts                  # 4 user roles, 33 granular permissions, BOLA/IDOR tenant guard
    │   ├── orderEngine.ts           # Authoritative price recalculation, VAT, OTP generation, FSM state guard
    │   ├── couponEngine.ts          # Promo validation, minimum order check, single-use per customer ledger
    │   ├── paymentSecurity.ts       # Idempotency token cache, MFS txn prefixing, refund role check
    │   ├── validation.ts            # Bangladeshi phone regex, email RFC check, XSS sanitization, integer bounds
    │   ├── rateLimiter.ts           # Sliding-window in-memory rate limiter for logins, orders, and coupons
    │   ├── auditLogger.ts           # Structured tamper-evident security audit log buffer (500 entries)
    │   ├── fileSecurity.ts          # File upload size validation (5 MB cap) and MIME type filtering
    │   └── testSecurity.ts          # Automated unit test suite verifying all 10 security modules
    │
    ├── utils/                       # Utility Helpers
    │   └── audio.ts                 # Web Audio API synthesizer for sound effects (clicks, chimes, whoosh)
    │
    └── components/                  # UI Components Layer
        ├── common/                  # Atomic & reusable feedback components
        │   ├── EmptyState.tsx       # Placeholder UI for empty bags, orders, and favorites
        │   ├── ErrorState.tsx       # Fallback UI for missing data or network issues
        │   ├── SkeletonLoader.tsx   # Shimmering loading placeholders
        │   └── Toast.tsx            # Global notification popup alert
        │
        ├── layout/                  # Shell Navigation & Structural Layouts
        │   ├── Header.tsx           # Global top header, location picker, search bar, language & portal dropdown
        │   ├── Footer.tsx           # Multi-column footer with Dhaka payment badges & quick navigation
        │   ├── LocationModal.tsx    # Dhaka neighborhood selection dialog (Mirpur, Dhanmondi, Gulshan, etc.)
        │   └── MobileBottomNav.tsx  # Sticky bottom navigation bar for mobile smartphones
        │
        ├── modals/                  # Customer Interaction Overlays
        │   ├── AuthModal.tsx        # Customer login, registration, and OTP verification dialog
        │   ├── CartDrawer.tsx       # Slide-out food bag drawer with free delivery meter and coupon form
        │   ├── FoodDetailModal.tsx  # Portion customizer (sizes, sauces, add-on toppings, instructions)
        │   ├── NotificationDrawer.tsx # Slide-out system alerts and promotional notifications center
        │   ├── ReviewModal.tsx      # 5-star multi-criteria post-delivery rating dialog
        │   └── RoleGateModal.tsx    # Password challenge dialog for switching to Admin, Partner, or Rider
        │
        ├── views/                   # Full-Page Screen Controllers (Routed via currentView)
        │   ├── HomeView.tsx         # Hero banner carousel, categories, popular restaurants, budget deals
        │   ├── RestaurantsView.tsx  # 4-column restaurant directory with search and multi-tag filtering
        │   ├── RestaurantDetailView.tsx # Restaurant header, menu category navigation, food items grid, reviews
        │   ├── OffersView.tsx       # Promo vouchers, copyable coupon codes, discount banners
        │   ├── CheckoutView.tsx     # 3-step checkout: saved address, ASAP/scheduled slot, payment method
        │   ├── OrderTrackingView.tsx# Live Dhaka route map, 6-stage timeline stepper, rider chat drawer
        │   ├── OrdersHistoryView.tsx# Past order history, re-order trigger, review invocation
        │   ├── FavoritesView.tsx    # Saved bookmarked restaurants and quick ordering
        │   ├── ProfileView.tsx      # Customer profile details, saved addresses, payment methods
        │   ├── ReservationView.tsx  # Table reservation booking form for family dawats
        │   ├── HelpCenterView.tsx   # FAQ accordion and customer support ticket creation
        │   ├── AdminDashboardView.tsx # Enterprise operations hub: dispatch, restaurants, riders, audit logs
        │   ├── RestaurantPartnerView.tsx # Kitchen POS/KDS: 3-column Kanban, stock toggle, reviews reply
        │   └── RiderDeliveryView.tsx# Rider courier HUD: online/offline toggle, GPS stepper, OTP delivery drop
        │
        ├── shared/                  # Reusable Administrative UI Widgets
        │   ├── AppShell.tsx         # Unified sidebar layout for Admin, Kitchen Partner, and Rider portals
        │   ├── ChartCard.tsx        # Custom SVG line & bar chart visualization card
        │   ├── ConfirmationDialog.tsx # Modal dialog for destructive action verification
        │   ├── DataTable.tsx        # Paginated data table with sorting, search, and action columns
        │   ├── FilterBar.tsx        # Reusable search and chip filter control bar
        │   ├── StatCard.tsx         # Metric KPI card with trend indicators (up/down percentage)
        │   └── StatusBadge.tsx      # Semantic color-coded badge for orders, riders, and stocks
        │
        ├── admin/                   # Admin Operations Modals
        │   └── AdminModals.tsx      # Global search modal, Add Restaurant, Add Dish, Create Offer modals
        │
        ├── partner/                 # Kitchen Partner Modals
        │   └── PartnerModals.tsx    # Kitchen order details modal, Customer review reply modal
        │
        ├── rider/                   # Rider Courier Modals
        │   └── RiderModals.tsx      # Incoming order broadcast, OTP delivery verification, SOS emergency modal
        │
        ├── canvas/                  # 3D Three.js Visual Canvas (Prototype Artifacts)
        │   ├── CameraController.tsx # Camera orbit animation controller
        │   ├── ExperienceCanvas.tsx # Three.js Canvas mounting component
        │   ├── FloatingParticles.tsx# Ambient dust particle effects
        │   ├── HeroBurgerModel.tsx  # Procedural 3D mesh burger model
        │   ├── HeroKacchiModel.tsx  # Procedural 3D mesh Kacchi Biryani degh
        │   ├── Menu3DObjects.tsx    # 3D food items
        │   └── RestaurantEnvironment.tsx # 3D lighting, shadows, and environment
        │
        └── ui/                      # 3D Storytelling & Legacy UI Scenes
            ├── CustomCursor.tsx     # Custom interactive mouse cursor
            ├── DeliveryTrackerModal.tsx # Legacy delivery modal
            ├── ProductInspectorModal.tsx# Legacy 3D item inspector
            ├── Scene01Awakening.tsx # Storytelling sequence scene 1
            ├── Scene01Hero.tsx      # Storytelling sequence hero
            ├── Scene02FoodReveal.tsx# Storytelling sequence scene 2
            ├── Scene02KacchiReveal.tsx # Kacchi reveal scene
            ├── Scene03ExplosionLabels.tsx # Exploded view ingredients scene
            ├── Scene03KacchiExplosion.tsx # Exploded Kacchi pot scene
            ├── Scene04InteriorTransition.tsx # Dining room transition scene
            ├── Scene06MenuSection.tsx # Legacy menu scene
            ├── Scene09StorySection.tsx # Brand storytelling scene
            ├── Scene10ReservationSection.tsx # Legacy reservation scene
            └── ToastNotification.tsx # Legacy toast notification
```

---

## 3. Important Folder Deep Dive

### 1. `src/context/`
- **What it contains:** Central state providers for the entire application (`KhabarContext.tsx` and legacy `StoreContext.tsx`).
- **Why it exists:** Provides a single source of truth for global states: current active view, user session, selected neighborhood, food cart, order history, table bookings, favorites, portal mode, and notifications.
- **What depends on it:** All 14 page views (`HomeView`, `RestaurantsView`, `AdminDashboardView`, etc.), layout components (`Header`, `Footer`), and all modal components.
- **Connection to the rest:** Injected at the root in `App.tsx` via `<KhabarProvider>`. Components call the custom hook `useKhabar()` to access state variables and mutating actions.

### 2. `src/security/`
- **What it contains:** 10 modular security and business validation engines (`crypto.ts`, `auth.ts`, `rbac.ts`, `orderEngine.ts`, `couponEngine.ts`, `paymentSecurity.ts`, `validation.ts`, `rateLimiter.ts`, `auditLogger.ts`, `fileSecurity.ts`).
- **Why it exists:** Food delivery platforms handle sensitive operations (financial transactions, coupon codes, delivery OTPs, restaurant menu modifications). Because this application runs in the browser, these engines prevent client-side manipulation (e.g. price tampering, BOLA/IDOR between restaurants, brute-force coupon redemption).
- **What depends on it:** `KhabarContext.tsx` delegates critical actions (`placeOrder`, `applyCoupon`, `verifyOTP`, `loginWithPassword`, `updateOrderStatus`, `completeDeliveryWithOTP`) to these engines.
- **Connection to the rest:** Serves as the authoritative "backend simulation layer", strictly validating every user mutation before state is updated.

### 3. `src/data/`
- **What it contains:** Static dataset definitions and dictionaries (`khabarData.ts`, `translations.ts`).
- **Why it exists:** Provides authentic Dhaka restaurant data (Sultan's Dine, Takeout, Chillox, Kacchi Bhai, Pizza Burg), real street addresses, Bengali translations, dish pricing, and mock platform entities (riders, transactions, inventory).
- **What depends on it:** `KhabarContext.tsx` initializes state arrays from this data; `orderEngine.ts` uses it as the immutable pricing truth.
- **Connection to the rest:** Supplies initial mock records that are cloned into component state and filtered for rendering.

### 4. `src/components/views/`
- **What it contains:** 14 page-level view controllers representing each screen of the application.
- **Why it exists:** Encapsulates the UI and interaction logic for specific user workflows (e.g. checkout, live map tracking, admin dispatch, kitchen KDS).
- **What depends on it:** `App.tsx` conditionally renders these views inside `<main>` based on the `currentView` state.
- **Connection to the rest:** Consumes `useKhabar()` for data and actions, and renders atomic child components from `src/components/common/`, `src/components/shared/`, and `src/components/modals/`.

### 5. `src/components/modals/`
- **What it contains:** Dialog overlays and slide-out drawers (`AuthModal`, `CartDrawer`, `FoodDetailModal`, `NotificationDrawer`, `ReviewModal`, `RoleGateModal`).
- **Why it exists:** Allows non-intrusive interactions (customizing burger toppings, reviewing cart totals, verifying role credentials) without losing page scroll context.
- **What depends on it:** Mounted globally at the bottom of `App.tsx`, controlled by boolean flags in `KhabarContext`.

---

## 4. File-by-File Technical Overview (Important Source Files)

### File: `src/main.tsx`
- **Purpose:** Browser DOM entrypoint for the React application.
- **Responsibility:** Locates `#root` in `index.html`, instantiates the React 18 `createRoot` container, and mounts root providers within `StrictMode`.
- **Used by:** Loaded directly by `index.html` via `<script type="module" src="/src/main.tsx">`.
- **Depends on:** `react`, `react-dom/client`, `./index.css`, `./App`, `./context/StoreContext`.
- **Output:** Renders `<StrictMode><StoreProvider><App /></StoreProvider></StrictMode>`.
- **Connection:** Boots the entire application lifecycle in the user's web browser.

### File: `src/App.tsx`
- **Purpose:** Top-level view router, layout coordinator, and modal container.
- **Responsibility:** Determines whether the customer shell (`Header`, `Footer`, `MobileBottomNav`) should be displayed, routes `currentView` to the corresponding page view component, and mounts all modal overlays.
- **Used by:** `src/main.tsx`.
- **Depends on:** `KhabarProvider`, `useKhabar`, and all components in `src/components/views/`, `src/components/layout/`, and `src/components/modals/`.
- **Output:** Complete responsive HTML layout with active view body and dialogs.
- **Important Code:**
  ```tsx
  const isCustomerPortal = portalMode === 'customer' && !['admin', 'partner', 'rider'].includes(currentView);
  // Conditionally hides customer Header/Footer when inside Admin, Partner, or Rider dashboards
  ```

### File: `src/context/KhabarContext.tsx`
- **Purpose:** Core central state container and business logic hub (2,006 lines).
- **Responsibility:** Manages all application state variables, provides helper methods for mutating state, integrates security engines, and exposes the `useKhabar()` hook.
- **Used by:** Virtually every view, modal, and layout component in the project.
- **Depends on:** `src/data/khabarData.ts`, `src/data/translations.ts`, and all 10 modules in `src/security/`.
- **Output:** Exposes `KhabarContext.Provider` and typed `KhabarContextType` value object.
- **Important Functions:**
  - `addToCart()`: Adds items to cart, checks for multi-restaurant conflicts, clamps quantities.
  - `placeOrder()`: Authoritatively validates inputs, checks rate limits, calculates financials, executes payment verification, generates OTP, and schedules simulated order lifecycle progression.
  - `applyCoupon()`: Checks rate limits, validates promo eligibility against subtotal via `couponEngine`.
  - `completeDeliveryWithOTP()`: Rider OTP verification that confirms physical customer handoff.
  - `setPortalMode()`: Role-gated portal switcher triggering `RoleGateModal` if unauthenticated.

### File: `src/security/crypto.ts`
- **Purpose:** Hardware-accelerated cryptographic utilities using the W3C Web Cryptography API.
- **Responsibility:** Salted password hashing, constant-time string comparison, secure random token generation, and numeric OTP generation.
- **Used by:** `src/security/auth.ts`, `src/security/orderEngine.ts`, `src/security/paymentSecurity.ts`, `src/security/fileSecurity.ts`.
- **Depends on:** `globalThis.crypto.subtle` and `crypto.getRandomValues()`.
- **Output:** `hashPassword()`, `verifyPassword()`, `timingSafeEqual()`, `generateSecureNumericOTP()`, `generateSecureRandomToken()`, `createHMACSHA256()`.
- **Important Code:**
  ```typescript
  export const timingSafeEqual = (a: string, b: string): boolean => {
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return mismatch === 0;
  };
  ```

### File: `src/security/auth.ts`
- **Purpose:** User authentication, credentials verification, and account lockout management.
- **Responsibility:** Pre-hashes demo accounts with PBKDF2, validates login credentials, locks accounts after 5 failed attempts for 15 minutes, generates and verifies dynamic 4-digit OTPs.
- **Used by:** `src/context/KhabarContext.tsx`, `src/components/modals/AuthModal.tsx`, `src/components/modals/RoleGateModal.tsx`.
- **Depends on:** `./crypto`, `./rateLimiter`, `./auditLogger`, `./validation`, `./rbac`.
- **Output:** Singleton instance `authService` implementing `loginWithPassword`, `requestOTP`, `verifyOTP`, `registerCustomer`.

### File: `src/security/rbac.ts`
- **Purpose:** Central Role-Based Access Control matrix and tenant isolation.
- **Responsibility:** Defines 4 roles (`CUSTOMER`, `RESTAURANT`, `RIDER`, `ADMIN`), 33 permissions, and asserts tenant resource ownership to prevent BOLA/IDOR attacks.
- **Used by:** `src/context/KhabarContext.tsx`, `src/components/views/AdminDashboardView.tsx`, `src/components/views/RestaurantPartnerView.tsx`.
- **Depends on:** `./auditLogger`.
- **Output:** `hasPermission()`, `assertPermission()`, `assertCanManageRestaurant()`, `assertCanAccessOrder()`.
- **Important Code:**
  ```typescript
  export const assertCanManageRestaurant = (user: AuthenticatedUser | null, restaurantId: string): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Super Admin has global override
    if (user.role === 'RESTAURANT' && user.restaurantId === restaurantId) return true;
    return false; // Blocks cross-restaurant manipulation
  };
  ```

### File: `src/security/orderEngine.ts`
- **Purpose:** Server-authoritative order financial calculations and Finite State Machine (FSM).
- **Responsibility:** Re-computes item prices from canonical menu records, calculates 5% Bangladesh VAT, manages free delivery thresholds (৳600), generates 4-digit delivery completion OTPs, and validates order status transitions.
- **Used by:** `src/context/KhabarContext.tsx`.
- **Depends on:** `src/data/khabarData.ts`, `./couponEngine`, `./auditLogger`, `./crypto`.
- **Output:** Singleton `orderEngine` exposing `calculateOrderFinancials()` and `validateStatusTransition()`.

### File: `src/security/couponEngine.ts`
- **Purpose:** Promotional coupon validation and single-use redemption enforcement.
- **Responsibility:** Verifies promo expiration dates, validates minimum order subtotals, computes flat or percentage discounts (with caps), and records redemptions per customer phone number.
- **Used by:** `src/context/KhabarContext.tsx`, `src/security/orderEngine.ts`.
- **Depends on:** `src/data/khabarData.ts`, `./auditLogger`.
- **Output:** Singleton `couponEngine` exposing `validateCoupon()` and `recordRedemption()`.

### File: `src/security/paymentSecurity.ts`
- **Purpose:** Financial payment integrity and replay attack prevention.
- **Responsibility:** Manages idempotency keys, generates unique transaction references (`BKH-...`, `NGD-...`, `CRD-...`, `COD-...`), and restricts refund operations strictly to the `ADMIN` role.
- **Used by:** `src/context/KhabarContext.tsx`.
- **Depends on:** `./crypto`, `./auditLogger`, `./rbac`.
- **Output:** Singleton `paymentSecurity` exposing `verifyPaymentTransaction()` and `assertCanRefund()`.

### File: `src/security/validation.ts`
- **Purpose:** Input validation and Cross-Site Scripting (XSS) neutralization.
- **Responsibility:** Validates Bangladeshi phone numbers (`+8801[3-9]XXXXXXXX`), checks RFC email standards, enforces password strength, and sanitizes untrusted text strings.
- **Used by:** `KhabarContext.tsx`, `auth.ts`, `AdminDashboardView.tsx`, `ReservationView.tsx`.
- **Output:** `validateBDPhone()`, `validateEmail()`, `sanitizeText()`, `sanitizeHtml()`, `validateInteger()`, `validateReservationDate()`.

### File: `src/security/rateLimiter.ts`
- **Purpose:** In-memory sliding-window rate limiter protecting sensitive actions.
- **Responsibility:** Tracks timestamp arrays per action key; blocks bursts exceeding defined thresholds (e.g. 5 login attempts/min, 3 orders/min, 10 coupon checks/min).
- **Used by:** `KhabarContext.tsx`, `auth.ts`.
- **Output:** Singleton `rateLimiter` and `RATE_LIMITS` configuration dictionary.

### File: `src/security/auditLogger.ts`
- **Purpose:** Structured, tamper-evident security audit logging buffer.
- **Responsibility:** Records security-relevant events (logins, order creations, coupon redemptions, access denials, refunds) with timestamps, actor IDs, roles, and severity levels.
- **Used by:** All security engines and `KhabarContext.tsx`.
- **Output:** Singleton `auditLogger` holding up to 500 recent entries; consumed by `AdminDashboardView.tsx`.

---

## 5. Major UI Components Technical Breakdown

### Component 1: `Header` (`src/components/layout/Header.tsx`)
- **Purpose:** Top primary navigation bar for the customer portal.
- **Props:** None (consumes `useKhabar()`).
- **Internal State:** `isProfileMenuOpen` (boolean), `isPortalDropdownOpen` (boolean).
- **Events:**
  - Clicking Location opens `LocationModal`.
  - Submitting Search updates `searchQuery` and routes to `restaurants`.
  - Clicking "বাং / EN" calls `toggleLanguage()`.
  - Clicking Bag opens `CartDrawer`.
  - Switching Portal triggers role verification via `RoleGateModal`.
- **Child Components:** Lucide icons (`MapPin`, `Search`, `ShoppingBag`, `Globe`, `User`, `Compass`, `ChefHat`, `Bike`).
- **Parent Component:** `MainAppContent` in `src/App.tsx`.
- **Conditional Rendering:** Hidden when `portalMode` is `admin`, `partner`, or `rider`.

### Component 2: `FoodDetailModal` (`src/components/modals/FoodDetailModal.tsx`)
- **Purpose:** Customizer bottom-sheet/dialog for portion sizes, signature sauces, add-on toppings, and kitchen instructions.
- **Props:** None (consumes `inspectingFood` from `useKhabar()`).
- **Internal State:**
  - `quantity`: Number (clamped between 1 and 50).
  - `selectedSize`: String ('Regular', 'Double Patty', 'Jumbo').
  - `sizeExtraPrice`: Extra cost for selected size.
  - `selectedSauces`: Array of selected sauce names.
  - `selectedAddOns`: Array of selected `AddOnOption` objects.
  - `instructions`: Customer text notes.
- **Important Logic:** Recalculates total price dynamically: `(item.price + sizeExtraPrice + addOnsTotal) * quantity`.
- **Side Effect:** Calls `addToCart(...)` on confirmation and dismisses modal.

### Component 3: `CartDrawer` (`src/components/modals/CartDrawer.tsx`)
- **Purpose:** Slide-out shopping bag drawer with free delivery progress meter and voucher form.
- **Props:** None (consumes `useKhabar()`).
- **Internal State:** `couponInput` (string), `couponError` (string).
- **Important Logic:**
  - Calculates progress towards ৳600 free shipping threshold: `min(100, (subtotal / 600) * 100)`.
  - Renders quick add-on suggestions (Borhani, Shahi Firni, French Fries).
  - Handles coupon submission with rate-limiting feedback.
- **Side Effects:** Navigates to `checkout`, calls `removeFromCart`, `updateCartQuantity`, `clearCart`.

### Component 4: `AdminDashboardView` (`src/components/views/AdminDashboardView.tsx`)
- **Purpose:** Comprehensive operations management console for platform administrators (1,887 lines).
- **Props:** None (consumes `useKhabar()`).
- **Internal State:**
  - `activeNav`: Tab switcher (`overview`, `orders`, `restaurants`, `approvals`, `menu`, `riders`, `coupons`, `payments`, `security-audit`, `settings`).
  - Search and filter queries for orders, restaurants, dishes, audit logs.
  - `confirmDialog`: Controls confirmation modal for destructive operations.
- **Important Logic:** Computes real-time platform KPIs (Total Revenue ৳1.28M+, Total Orders 8,490+, Active Kitchens, Active Fleet).
- **Child Components:** `AppShell`, `StatCard`, `ChartCard`, `DataTable`, `StatusBadge`, `FilterBar`, `ConfirmationDialog`, and modals from `AdminModals.tsx`.

### Component 5: `RestaurantPartnerView` (`src/components/views/RestaurantPartnerView.tsx`)
- **Purpose:** Kitchen Display System (KDS) and restaurant management dashboard (1,118 lines).
- **Props:** None (consumes `useKhabar()`).
- **Internal State:**
  - `activeNav`: Tabs (`kds`, `menu`, `inventory`, `reservations`, `reviews`, `analytics`).
  - `selectedOutletId`: Outlets filtered strictly by `authenticatedUser.restaurantId` (multi-tenant isolation).
  - `soundEnabled`: Boolean for kitchen audio alerts.
- **Important Logic:**
  - 3-Column Kanban board:
    1. *Incoming Orders:* Accept & Cook.
    2. *Preparing in Kitchen:* Mark Ready for Pickup.
    3. *Ready for Rider:* Handover to Rider.
  - Dish stock toggle (In Stock / Sold Out).
- **Child Components:** `AppShell`, `StatCard`, `DataTable`, `StatusBadge`, `OrderDetailsModal`, `ReplyReviewModal`.

### Component 6: `RiderDeliveryView` (`src/components/views/RiderDeliveryView.tsx`)
- **Purpose:** Courier dispatch HUD for motorcycle delivery riders in Dhaka (1,259 lines).
- **Props:** None (consumes `useKhabar()`).
- **Internal State:**
  - `activeTab`: Tabs (`mission`, `trips`, `wallet`, `help`).
  - `deviceMode`: Toggle between desktop layout and mobile phone frame.
  - Modals: `isSOSOpen`, `isWithdrawOpen`, `isOTPOpen`, `tripCelebration`.
- **Important Logic:**
  - 4-Stage Delivery Stepper:
    1. Heading to Restaurant -> 2. Arrived at Restaurant -> 3. Food Picked Up -> 4. Delivered with Customer OTP.
  - Requires valid 4-digit OTP from customer to finalize delivery.
  - Triggers canvas-confetti upon trip completion and credits ৳120 to rider wallet.

---

## 6. Important Functions Breakdown

### Function 1: `orderEngine.calculateOrderFinancials()`
- **File:** `src/security/orderEngine.ts` (Lines 43–149)
- **Purpose:** Prevents client-side cart tampering by authoritatively calculating all prices directly from the canonical restaurant catalog.
- **Input:**
  - `clientCartItems`: Array of cart items from client.
  - `couponCode`: Optional coupon code string.
  - `baseDeliveryFee`: Base delivery fee for the selected area.
  - `customerPhone`: Customer phone number for coupon eligibility check.
- **Process:**
  1. Iterates through each client item; verifies existence in `RESTAURANTS` catalog.
  2. Verifies dish availability (`isAvailable === true`).
  3. Re-computes item single price: `authoritativeDish.price + sum(validAddOns.price)`.
  4. Multiplies by clamped quantity (1–50) to compute authoritative subtotal.
  5. Validates coupon code via `couponEngine.validateCoupon()`.
  6. Computes delivery fee (৳0 if subtotal >= ৳600 or free shipping coupon; otherwise `baseDeliveryFee`).
  7. Calculates 5% Bangladesh restaurant VAT on discounted food subtotal.
  8. Sums `subtotal - discount + deliveryFee + vat`.
  9. Generates secure 4-digit numeric OTP via `generateSecureNumericOTP(4)`.
- **Output:** Object `{ success: boolean, totals: AuthoritativeOrderTotals, error?: string }`.
- **Called By:** `KhabarContext.placeOrder()` and reactive cart calculation in `KhabarContext`.

### Function 2: `KhabarContext.placeOrder()`
- **File:** `src/context/KhabarContext.tsx` (Lines 883–1018)
- **Purpose:** Orchestrates complete order placement workflow with fraud prevention and progressive delivery simulation.
- **Input:** `formData: CheckoutFormData` (recipient name, phone, address, area, landmark, schedule, payment method, idempotencyKey).
- **Process:**
  1. Enforces rate limit: `rateLimiter.checkLimit('order:create', 3, 60000)`.
  2. Validates phone: `validateBDPhone(formData.customerPhone)`.
  3. Sanitizes recipient name and address strings: `sanitizeText(..., 250)`.
  4. Calls `orderEngine.calculateOrderFinancials()`.
  5. Calls `paymentSecurity.verifyPaymentTransaction()`.
  6. If coupon applied, calls `couponEngine.recordRedemption()`.
  7. Constructs immutable `OrderRecord` with generated delivery OTP.
  8. Prepends to `orders` array, sets `activeTrackingOrder`, clears cart, navigates to `tracking`.
  9. Emits audit log to `auditLogger`.
  10. Triggers simulated status progression timers (8s -> `PREPARING`, 18s -> `PICKED_UP`, 30s -> `ON_THE_WAY`).
- **Output:** Created `OrderRecord` or `null` if validation failed.
- **Side Effect:** Modifies cart, orders, active view, notifications, and audit log.

### Function 3: `KhabarContext.completeDeliveryWithOTP()`
- **File:** `src/context/KhabarContext.tsx` (Lines 1793–1847)
- **Purpose:** Finalizes an active order delivery by verifying the customer's 4-digit physical OTP.
- **Input:** `orderId: string`, `otp: string`.
- **Process:**
  1. Finds target order in `orders`.
  2. Compares input OTP with `targetOrder.orderDeliveryOTP` (or demo fallback '2026').
  3. If incorrect, displays error toast and returns `false`.
  4. Advances order status to `DELIVERED`.
  5. Credits ৳120 to rider `walletBalance`.
  6. Prepends new trip record to `riderDeliveries`.
  7. Logs `RIDER_DELIVERY_COMPLETED` in `auditLogger`.
- **Output:** `boolean` (`true` if verified, `false` otherwise).
- **Called By:** `RiderDeliveryView.tsx` via `OTPVerificationModal`.

### Function 4: `authService.loginWithPassword()`
- **File:** `src/security/auth.ts` (Lines 153–216)
- **Purpose:** Authenticates user credentials using constant-time PBKDF2 hash verification with progressive account lockout protection.
- **Input:** `identifier: string` (email or phone), `plaintextPass: string`.
- **Process:**
  1. Checks rate limiter: `rateLimiter.checkLimit('auth:login:...' , 5, 60000)`.
  2. Looks up account in internal map.
  3. Checks if account is locked (`now < account.lockedUntil`); returns lockout time remaining if locked.
  4. Calls `verifyPassword(plaintextPass, account.passwordHash)`.
  5. If invalid: increments `failedLoginAttempts`; if >= 5, sets `lockedUntil = now + 15 minutes` and logs warning.
  6. If valid: resets `failedLoginAttempts`, generates 32-byte session token, returns authenticated user object.
- **Output:** Promise resolving to `{ success: boolean, user?: AuthenticatedUser, error?: string }`.
- **Called By:** `KhabarContext.loginWithPassword()`, `RoleGateModal`, and `AuthModal`.

---

## 7. Build, Scripts & Tooling Summary

From `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

- **`npm run dev`:** Starts the Vite development server with Hot Module Replacement (HMR) on `http://localhost:5173/`.
- **`npm run build`:** Executes TypeScript type-checking (`tsc -b`), followed by Vite/Rollup production bundling into `dist/`.
- **`npm run preview`:** Boots a local HTTP server serving the production `dist/` bundle to test performance before deployment.

### Production Build Metrics (Verified from Terminal Execution)
- Modules Transformed: `1,941 modules`
- `dist/index.html`: `2.07 kB` (gzip: `1.05 kB`)
- `dist/assets/index-BG5m4i3N.css`: `82.28 kB` (gzip: `13.27 kB`)
- `dist/assets/index-C0HA_Voy.js`: `695.18 kB` (gzip: `167.97 kB`)
- Total Build Duration: `~58.5s`
- Zero TypeScript compiler errors (`tsc -b` exits with code 0).
