# Feedants Competition Details  Full-Stack Mobile & Web Module

[![Backend Status](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB%20Atlas-0F6B72.svg)](http://localhost:5000)
[![Mobile Client](https://img.shields.io/badge/Mobile-React%20Native%20(Expo)-149389.svg)](http://localhost:8081)
[![Bilingual](https://img.shields.io/badge/Localization-ENG%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A4%8F-F59E0B.svg)](./mobile/src/context/LanguageContext.jsx)
[![Tests](https://img.shields.io/badge/Concurrency%20Tests-Passing%20(100%25)-10B981.svg)](./server/tests/concurrency.test.js)

A production-grade, functional full-stack MVP of the **Feedants Competition Details** screen built for the Full Stack Development Internship technical evaluation.
Every single component, statistic, judge profile, countdown target, participant spot, and reward tier is dynamically retrieved from a Node.js/Express API and backed by live MongoDB persistence with atomic concurrency controls, live search, and dynamic full-stack English/Hindi localization.

---

## 📸 Reference Design vs Live Implementation

The screen follows the provided reference design with 1:1 pixel fidelity:
- **Top Header**: Back navigation with interactive bilingual language switcher (**ENG** / **हिंदी**).
- **Competition Header & Stats**: Dynamic title, tags, merit certificate badge, bold Prize Pool (`₹ 1,500`), Entry Fee (`₹ 99`), and dynamic capacity progress bar (`1 / 20 Booked`, `Only 19 spots left`). If registrations are closed, the spots bar automatically hides in favor of the status badge.
- **Judge Card**: Guru Manju Dubey with avatar, experience, and clickable `Intro Video` popup player.
- **Urgency Countdown**: Real-time ticking countdown (`01d : 06h : 20m : 57s`) with `Hurry up!` badge.
- **Important Dates 2x2 Grid**: Register Before, Submission Starts, Submission Ends, Result Date.
- **Previous Winners Carousel**: Horizontal scroll cards with thumbnail, rank, and video preview modal.
- **Dynamic Tabs**: `About Competition` (with expandable highlights), `Judging Parameters` (with percentage weight bars), and `Rules & Eligibility`.
- **Rewards Tier**: 1st through 6th positions matching the ₹ 1,500 prize pool.
- **Security & Trust**: Razorpay payment badges, refund policy, referral link copy card with ₹10 discount bonus, testimonial teaser, and ad banner.
- **Adaptive Sticky Bottom CTA**: State-aware action bar transitioning between `Register Now (₹99)`, `Upload Submission (Registered)`, `Submission Window Pending`, `Competition Full`, and `Registration Closed`.
- **Explore & Real-Time Search**: Search bar with auto-focus keyboard opening, keyword filtering across titles, categories, tags, judges, and lifecycle states.
- **Interactive Reviewer Toolbar**: 1-click test toolbar at the top allowing instant switching between demo users and lifecycle states (`Open`, `Full`, `Closed`, `Results Published`) and 1-click registration reset.

---

## 🚀 Step-by-Step Local Setup Guide

Follow these steps to run the complete full-stack project on your local machine.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **Expo Go App** (optional, installed on Android or iOS if testing on a physical phone)
- A web browser (Google Chrome, Microsoft Edge, etc.)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Roy-code5k/React_Native_Registration.git
cd React_Native_Registration
```

---

### Step 2: Start the Backend Server

The backend runs on **port 5000** and connects to MongoDB Atlas.

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* Verify or configure environment variables in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://...  # MongoDB Atlas connection string
   JWT_SECRET=feedants-super-secret-key-2026
   JWT_EXPIRES_IN=7d
   ```
   > **Note**: If `MONGO_URI` is omitted or left blank, the server automatically boots an embedded in-memory database (`mongodb-memory-server`) with zero external configuration!

4. Start the server:
   ```bash
   npm start
   ```
5. Confirm the server is running by visiting:
   - Health Check: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)
   - Competition Endpoint: [http://localhost:5000/api/v1/competitions/classical-dance-2026](http://localhost:5000/api/v1/competitions/classical-dance-2026)

---

### Step 3: Start the Mobile Client (React Native / Expo)

1. Open a **second terminal** and navigate to the `mobile` folder:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `mobile/.env`:
   - **For Web Browser Testing** (`http://localhost:8081`):
     ```env
     EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
     ```
   - **For Physical Mobile Phone Testing (Expo Go)**:
     Set `EXPO_PUBLIC_API_URL` to your computer's local Wi-Fi IP (find it using `ipconfig` on Windows or `ifconfig` on macOS):
     ```env
     EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_WIFI_IP>:5000/api/v1
     ```

4. Launch the Metro Bundler:
   ```bash
   npx expo start -c
   ```

5. **Viewing the App**:
   - **On Web Browser (Fastest & Zero Setup)**: Press **`w`** in the terminal or open [http://localhost:8081](http://localhost:8081) directly in your browser.
   - **On Physical Phone (Expo Go)**:
     1. Connect your phone to the **same Wi-Fi network** as your computer.
     2. Open the **Expo Go** app and scan the QR code displayed in the terminal.
     3. *If on different Wi-Fi or cellular networks*: run `npx expo start --tunnel`.

---

## 🔑 Demo Accounts & Reviewer Toolbar

To make evaluating all edge cases effortless, the app features an **Interactive Demo Toolbar** pinned at the top:

- **Lifecycle Switcher**: 1-click buttons to cycle the active competition between:
  - `🟢 Open`: Spots available, countdown active, "Register Now (₹99)".
  - `🔴 Full`: Capacity filled (20/20), CTA disabled with "Competition Full".
  - `⚪ Closed`: Registration deadline passed, spots bar hidden, CTA disabled.
  - `🟣 Results`: Winners declared with previous winners carousel.
- **Reset Demo Button**: Resets the current user's registration and submission state in MongoDB on demand so you can test the reservation flow repeatedly.

---

## ⚡ Concurrency & Spot Overbooking Prevention

The assignment requires the system to handle thousands of concurrent users attempting to register for limited spots without race conditions or overbooking.

### The Problem
In standard read-modify-write patterns (`find()` then `save()`), multiple requests check capacity concurrently before any write commits. If 25 users click "Register" for the last spot simultaneously, all 25 see `remainingSpots > 0`, leading to 24 overbooked spots.

### The Solution: Atomic Conditional Reservation
Capacity enforcement is executed directly at the database engine level via MongoDB atomic conditional operators:
```javascript
const updatedComp = await Competition.findOneAndUpdate(
  {
    _id: competitionId,
    participantCount: { $lt: competition.maxParticipants } // ATOMIC CAPACITY GUARD
  },
  {
    $inc: { participantCount: 1 }                          // ATOMIC INCREMENT
  },
  { new: true }
);

if (!updatedComp) {
  throw new Error('All participation spots have been filled.'); // HTTP 409 COMPETITION_FULL
}
```

### Automated Concurrency Test
We implemented an automated test in [server/tests/concurrency.test.js](file:///c:/Users/hritu/OneDrive/Desktop/React%20Native/server/tests/concurrency.test.js):
- Launches **25 simultaneous registration requests** against a competition with **only 1 spot left**.
- **Result**: Exactly **1 request succeeds** (`201 Created`), **24 requests fail safely** (`409 Conflict`), and total participants in MongoDB strictly caps at the limit.
- Run the test locally:
  ```bash
  cd server
  npm test
  ```

---

## 🌐 Full-Stack Dynamic Localization (ENG / हिंदी)

Unlike client-only mock toggles, this application implements **Approach 3: Full-Stack Dynamic Localization**:
1. **Database-Driven Content**: MongoDB Atlas stores authentic Hindi translations under the `translations.hi` schema (title, category, judge bio, judging criteria, eligibility rules, rewards).
2. **Backend API Routing**: Endpoints `GET /competitions/:id?lang=hi` and `GET /competitions?lang=hi` merge localized Hindi fields over base documents dynamically.
3. **Reactive Frontend Context**: [LanguageContext.jsx](file:///c:/Users/hritu/OneDrive/Desktop/React%20Native/mobile/src/context/LanguageContext.jsx) manages global language state and synchronizes with **TanStack React Query** (`queryKey: ['competition', competitionSlug, authToken, language]`), instantly updating UI labels, dates, countdowns, and database content with zero page reload.

---

## 🧠 Core Architecture & Design Decisions

### 1. Important Assumptions Made
1. **Single Registration Per User**: A user may only register once per competition. This is guaranteed at the database level by a compound unique index `{ competitionId: 1, userId: 1 }` on the `registrations` collection.
2. **Server-Authoritative Lifecycle**: The client never determines whether registration or submission is open. All lifecycle flags (`canRegister`, `canSubmit`, `reason`) are computed exclusively on the server based on immutable server clock timestamps.
3. **Client Countdown as Presentation Only**: The mobile countdown timer provides urgency UI only. If an expired request arrives at the backend, the server rejects it regardless of the client timer's visual state.
4. **Cloud Media Separation**: Performance video uploads and intro videos are stored as secure HTTPS URLs (cloud storage/CDN), preventing large binary files from overloading the MongoDB database.
5. **Auto-Detected Host IP**: Physical mobile devices dynamically extract the development host IP from `NativeModules.SourceCode.scriptURL`, while Web browsers use `localhost` directly to bypass CORS.

### 2. Major Technical Decisions
- **React Native with Expo & React Native Web**: A single unified JavaScript codebase delivers identical 60fps performance on native iOS/Android devices and desktop web browsers.
- **TanStack React Query v5**: Utilized for all server-state caching, automatic cache invalidation on mutations (register, submit, switch language), and optimistic background re-fetching.
- **Dual-Mode MongoDB Configuration**: Production connects to MongoDB Atlas; if no credentials are provided, `mongodb-memory-server` spins up an in-memory database automatically, ensuring reviewers can run the backend without setting up a local database.
- **Express + Helmet + Permissive CORS**: Pre-configured with `crossOriginResourcePolicy: false` to allow seamless local network requests between physical phones and developer laptops.

### 3. Trade-offs Considered
- **REST APIs with React Query vs WebSockets**:
  - *Decision*: REST with smart cache invalidation.
  - *Rationale*: Persistent WebSockets add server memory overhead and connection complexity. Given registration and submission are transactional actions, REST requests with atomic guards provide higher reliability and lower operational costs.
- **Embedded Document Translations vs Separate Collection**:
  - *Decision*: Embedded `translations.hi` sub-schema within the `Competition` document.
  - *Rationale*: Avoids expensive `$lookup` database joins on every query, maintaining sub-millisecond retrieval speeds while providing a clean fallback to English if a field translation is missing.
- **Vanilla CSS / StyleSheet vs Tailwind/NativeWind**:
  - *Decision*: Native `StyleSheet.create` with a centralized design token system (`COLORS`, typography).
  - *Rationale*: Eliminates third-party styling build dependencies, avoiding version conflicts between React Native Web and native compilation targets.

### 4. What Would Be Improved for Production
If expanding this system for high-scale commercial production:
1. **Distributed Caching & Rate Limiting (Redis)**:
   - Implement Redis for caching competition catalog reads (`GET /competitions`) with a 10-second TTL.
   - Utilize Redlock for distributed reservation locks across multi-region API server clusters.
2. **Real Payment Gateway Integration**:
   - Integrate Razorpay / Stripe webhooks with webhook signature verification. Registrations would start in `PAYMENT_PENDING` and transition to `CONFIRMED` upon receiving the verified `payment.captured` webhook.
3. **Direct S3 Pre-Signed Video Uploads**:
   - Implement AWS S3 pre-signed URLs allowing participants to upload 1080p/4K video performances directly to cloud storage, triggering AWS Elemental MediaConvert for adaptive HLS transcoding.
4. **Push Notifications (Firebase Cloud Messaging)**:
   - Dispatch background push notifications when the submission window opens, when 24 hours remain before deadline, and when judge scores/results are published.
5. **Automated End-to-End Testing**:
   - Add Maestro or Detox end-to-end test suites covering the complete registration, payment simulation, and video submission user journey on both iOS and Android.

---

## 📁 Repository Directory Structure

```
React_Native_Registration/
├── mobile/                           # React Native Expo Client
│   ├── src/
│   │   ├── components/               # Modular UI Components
│   │   │   ├── CompetitionHeader.jsx # Title, prize pool, entry fee, spots bar
│   │   │   ├── CompetitionTabs.jsx   # About, judging criteria, rules
│   │   │   ├── CountdownCard.jsx     # Real-time ticking countdown
│   │   │   ├── DemoToolbar.jsx       # Reviewer quick-switch toolbar
│   │   │   ├── ImportantDatesCard.jsx# 2x2 critical dates grid
│   │   │   ├── JudgeCard.jsx         # Judge profile & video popup
│   │   │   ├── PreviousWinnersCarousel.jsx # Winners cards carousel
│   │   │   ├── ReferralAndPaymentInfo.jsx  # Trust badges & referral copy
│   │   │   ├── RewardsList.jsx       # Ranked prize breakdown
│   │   │   ├── StickyBottomActionBar.jsx   # State-aware CTA & bottom nav
│   │   │   ├── SubmissionModal.jsx   # Video entry upload modal
│   │   │   ├── TopHeader.jsx         # Back navigation & language toggle
│   │   │   └── VideoModal.jsx        # HTML5 video preview modal
│   │   ├── constants/                # Theme tokens (COLORS, typography)
│   │   ├── context/
│   │   │   └── LanguageContext.jsx   # ENG/HI dictionary & useLanguage hook
│   │   ├── hooks/
│   │   │   └── useCountdown.js       # Real-time countdown calculation
│   │   ├── screens/
│   │   │   ├── CompetitionDetailsScreen.jsx # Main competition screen
│   │   │   ├── ExploreScreen.jsx     # Live search & filter screen
│   │   │   ├── HomeScreen.jsx        # Events catalog screen
│   │   │   ├── AuthScreen.jsx        # Sign in / Sign up screen
│   │   │   └── ProfileScreen.jsx     # User profile & stats screen
│   │   └── services/
│   │       └── api.js                # Axios client with dynamic IP resolution
│   ├── App.js                        # App root with QueryClient & LanguageProvider
│   ├── app.json                      # Expo app configuration
│   └── package.json
│
├── server/                           # Node.js & Express REST API
│   ├── src/
│   │   ├── config/                   # Dual-mode DB connection (Atlas & Memory)
│   │   ├── controllers/              # Auth & Competition request handlers
│   │   ├── middleware/               # Centralized error handler & JWT auth
│   │   ├── models/                   # Mongoose schemas (Competition, User, etc.)
│   │   ├── routes/                   # Modular API route definitions
│   │   ├── seed/                     # Seed script with authentic translations
│   │   ├── services/                 # Atomic concurrency logic
│   │   └── server.js                 # Express server bootstrapper
│   ├── tests/
│   │   └── concurrency.test.js       # 25-request atomic overbooking test
│   └── package.json
│
└── README.md                         # Comprehensive setup & architecture guide
```
