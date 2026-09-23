# Feedants Competition Details — Functional Full-Stack Module

[![Backend Status](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-0F6B72.svg)](http://localhost:5000)
[![Mobile Client](https://img.shields.io/badge/Mobile-React%20Native%20(Expo)-149389.svg)](http://localhost:8081)
[![Tests](https://img.shields.io/badge/Concurrency%20Tests-Passing-10B981.svg)](./server/tests/concurrency.test.js)

A production-grade, functional full-stack MVP of the **Feedants Competition Details** screen built for the Full Stack Development Internship technical evaluation. 

This is **not a static UI clone** — every single component, statistic, judge profile, countdown target, participant spot, and reward tier is dynamically retrieved from a Node.js/Express API and backed by MongoDB persistence with atomic concurrency controls.

---

## 📸 Reference Design vs Live Implementation

The screen closely follows the provided reference design with 1:1 fidelity:
- **Header**: Back action with bilingual language switcher (`ENG` / `हिंदी`).
- **Competition Header & Stats**: Title, tags, certificate perk, bold Prize Pool (`₹ 1,500`), Entry Fee (`₹ 99`), and dynamic capacity progress bar (`1 / 20 Booked`, `Only 19 spots left`).
- **Judge Card**: Judge Manju Dubey with avatar, experience, and clickable `Intro Video` popup player.
- **Urgency Countdown**: Real-time ticking countdown (`01d : 06h : 20m : 57s`) with `Hurry up!` badge.
- **Important Dates 2x2 Grid**: Register Before, Submission Starts, Submission Ends, Result Date.
- **Previous Winners Carousel**: Horizontal scroll cards with thumbnail, rank, and video preview.
- **Dynamic Tabs**: `About Competition` (with expandable highlights), `Judging Parameters` (with percentage weight bars), and `Rules & Eligibility`.
- **Rewards Tier**: 1st through 6th positions matching the ₹ 1,500 prize pool.
- **Security & Trust**: Razorpay payment badges, refund policy, referral link copy card with ₹10 discount bonus, testimonial teaser, and ad banner.
- **Adaptive Sticky Bottom CTA**: State-aware action bar transitioning between `Register Now (₹99)`, `Upload Submission (Registered)`, `Submission Opens Soon`, `Competition Full`, and `Registration Closed`.
- **Bottom Navigation Bar**: Global app tabs (`Home`, `Explore`, `+`, `Competitions`, `Profile`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)
- *Note*: MongoDB installation is **optional**. The backend includes an embedded in-memory MongoDB fallback (`mongodb-memory-server`) that launches automatically if no external MongoDB URI is supplied.

### 1. Clone & Setup
```bash
git clone <repository-url>
cd "React Native"
```

### 2. Start the Backend API
```bash
cd server
npm install
npm start
```
*The server will start on port `5000` and automatically seed initial data on first launch.*
- Health Check: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)
- Competition API: [http://localhost:5000/api/v1/competitions/classical-dance-2026](http://localhost:5000/api/v1/competitions/classical-dance-2026)

### 3. Start the React Native Client
Open a second terminal:
```bash
cd mobile
npm install
npm run web
```
*Open [http://localhost:8081](http://localhost:8081) in your browser for immediate web preview.*

> **To run on Android / iOS**: Run `npm start` in the `mobile` folder and scan the generated QR code using the **Expo Go** app on your physical mobile phone or start an Android emulator.

---

## 🛠 Required Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development

# Optional: MongoDB connection string (Atlas or local)
# If omitted or left blank, an embedded in-memory MongoDB runs automatically!
MONGO_URI=

JWT_SECRET=feedants-super-secret-key-2026
JWT_EXPIRES_IN=7d
```

### Mobile Frontend (`mobile/.env`)
```env
# URL to backend API
EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Initial State |
| :--- | :--- | :--- | :--- |
| **Demo Participant** | `demo@example.com` | `password123` | Pre-registered (tests Submission flow) |
| **Unregistered User** | `pooja@example.com` | `password123` | Unregistered (tests Registration & Spot Reservation) |
| **Guest** | *None* | *None* | Anonymous browsing |

> **Interactive Reviewer Toolbar**: At the top of the mobile screen, a dedicated reviewer toolbar allows 1-click user switching and competition lifecycle state toggling (`Open`, `Full`, `Closed`, `Results Published`).

---

## ⚡ Concurrency & Data Consistency Strategy

The assignment requires the system to handle thousands of concurrent users without data corruption or overbooking.

### The Problem
When 50 users attempt to reserve the final remaining spot simultaneously, naive read-modify-write patterns (`find` then `save`) cause race conditions where all 50 pass the capacity check and the competition ends up overbooked.

### The Solution: Atomic Conditional Reservation
We enforce capacity locking directly in the database engine using atomic conditional updates:
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
  throw new Error('All participation spots have been filled.'); // 409 COMPETITION_FULL
}
```

### Automated Concurrency Test
We wrote an automated test in `server/tests/concurrency.test.js`:
- Fires **25 simultaneous registration requests** against a competition with **only 1 spot left**.
- **Result**: Exactly **1 request succeeds** (`201`), **24 are rejected** (`409`), and the database participant count is strictly capped at **10**.

To run the concurrency test:
```bash
cd server
npm test
```

---

## 🧠 Architectural Decisions & Assumptions

### 1. Important Assumptions
1. **Single Registration Per User**: A user may only register once per competition. Enforced via MongoDB compound unique index `{ competitionId: 1, userId: 1 }`.
2. **Server-Authoritative Lifecycle**: The client never computes whether registration or submission is valid; all decisions (`canRegister`, `canSubmit`) are computed on the server based on immutable server clock timestamps.
3. **Client-Side Countdown**: The mobile countdown timer is strictly a presentation mechanism. Expired requests arriving at the server are rejected regardless of client timer state.
4. **Media Storage**: Media files are uploaded to cloud storage (or simulated CDN endpoints) and stored in MongoDB only as metadata/URLs, preventing large binary Blobs in database documents.

### 2. Major Technical Decisions
- **React Native with Expo & React Native Web**: Allows a single unified codebase to serve native mobile devices (iOS/Android) as well as desktop browsers with pixel-perfect responsive fidelity.
- **TanStack Query (React Query)**: Used for server state synchronization. Automatically refetches and updates participant counts, spots left, and button states upon registration or submission.
- **Embedded In-Memory MongoDB Fallback**: Allows immediate, zero-friction local evaluation without requiring MongoDB installation.

### 3. Trade-offs Considered
- **REST vs WebSockets**: REST with TanStack Query cache invalidation was chosen over persistent WebSockets for simplicity, predictability, and lower server connection overhead.
- **JavaScript vs TypeScript**: Clean JavaScript with comprehensive runtime validation schemas was chosen to optimize development velocity and avoid build-step friction during evaluation.

---

## 🔮 Production Roadmap & Improvements

If developed further for a production deployment with hundreds of thousands of users:
1. **Redis Caching & Distributed Locks**: Offload read queries (`GET /competitions/:id`) to Redis with a 5-second TTL, and use Redlock for distributed transactional locking across multiple API clusters.
2. **Real Payment Gateway Integration**: Wire up Razorpay Webhooks (`payment.captured`, `payment.failed`) to transition registrations from `PENDING` to `CONFIRMED`.
3. **Cloudinary / AWS S3 Direct Uploads**: Presigned S3 URLs allowing mobile clients to upload 1080p dance performance videos directly to cloud storage, triggering AWS MediaConvert transcoding pipelines for adaptive HLS streaming.
4. **Push Notifications**: Firebase Cloud Messaging (FCM) alerts for "Submission Window Open" and "Results Declared".

---

## 📁 Repository Structure

```
React Native/
├── mobile/                     # React Native Expo Frontend
│   ├── src/
│   │   ├── components/         # Modular UI Components
│   │   ├── constants/          # Theme, colors, typography
│   │   ├── hooks/              # useCountdown real-time timer
│   │   ├── screens/            # CompetitionDetailsScreen
│   │   └── services/           # Axios API client
│   ├── App.js                  # Main app entrypoint with TanStack Query
│   ├── app.json                # Expo config
│   └── package.json
│
├── server/                     # Express & MongoDB Backend
│   ├── src/
│   │   ├── config/             # Dual-mode DB connection (Atlas / Memory)
│   │   ├── controllers/        # Auth & Competition controllers
│   │   ├── middleware/         # JWT Auth & centralized error handler
│   │   ├── models/             # User, Competition, Registration, Submission
│   │   ├── routes/             # REST endpoints
│   │   ├── seed/               # Reference competition seed data
│   │   ├── services/           # Concurrency-safe business logic
│   │   └── server.js           # Server entrypoint
│   ├── tests/
│   │   └── concurrency.test.js # 25-request atomic capacity test
│   └── package.json
│
├── docs/                       # Architectural & API Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── concurrency.md
│
├── implementationplan.md       # Original specification roadmap
└── README.md                   # Complete evaluation guide
```
