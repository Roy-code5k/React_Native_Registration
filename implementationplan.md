# Feedants Competition Details --- MVP Implementation Plan

## 1. Objective

Build the Feedants Competition Details screen as a functional full-stack
MVP, not a static UI clone.

The application must use:

-   React Native
-   JavaScript
-   Node.js
-   Express.js
-   MongoDB
-   Mongoose

Recommended supporting stack:

-   Expo
-   Expo Router
-   TanStack Query
-   Axios
-   JWT
-   bcrypt
-   Zod
-   Helmet
-   express-rate-limit
-   Jest
-   Supertest

The backend is authoritative for competition state, lifecycle,
registration eligibility, capacity, and submission eligibility.

------------------------------------------------------------------------

## 2. MVP Scope

### Competition information

The screen must dynamically display:

-   Competition title
-   Category
-   Tags
-   Certificate information
-   Prize pool
-   Entry fee
-   Maximum participants
-   Current participants
-   Remaining spots
-   Judge profile
-   Judge intro video
-   Registration dates
-   Submission dates
-   Result date
-   Previous winners
-   Competition description
-   Judging parameters
-   Rules
-   Eligibility
-   Rewards

### Authentication

-   User registration
-   User login
-   JWT authentication
-   Current-user endpoint
-   Secure password hashing

### Registration

-   Register for a competition
-   Prevent duplicate registration
-   Prevent registration before the registration window
-   Prevent registration after the deadline
-   Prevent registration when the competition is full
-   Update participant count
-   Safely handle concurrent registration requests

### Submission

-   Allow only registered users to submit
-   Enforce submission start/end dates
-   Validate uploaded media
-   Prevent duplicate submission
-   Persist submission state

### Mobile states

-   Loading
-   Error
-   Upcoming
-   Registration open
-   Registration closed
-   Full
-   Registered
-   Submission not started
-   Submission open
-   Submitted
-   Judging
-   Results published
-   Cancelled

------------------------------------------------------------------------

## 3. Out of MVP Scope

Do not allow these features to delay the core implementation:

-   Admin dashboard
-   Full judging platform
-   Real winner-selection engine
-   Production payment settlement
-   Full referral/commission system
-   Push notifications
-   Chat
-   Social feed
-   WebSockets
-   Redis
-   Microservices
-   Kubernetes
-   Advanced analytics
-   Recommendation engine
-   Full multilingual system
-   Production video transcoding

These can be listed as future production improvements.

------------------------------------------------------------------------

## 4. Architecture

``` text
React Native / Expo
        |
        | HTTPS / JSON
        v
Express REST API
        |
        +-------------------+
        |                   |
        v                   v
   Service Layer        Middleware
        |
        v
     Mongoose
        |
        v
    MongoDB Atlas
```

Feature flow:

``` text
CompetitionDetailsScreen
        |
        v
TanStack Query
        |
        v
Axios API Client
        |
        v
Express Controller
        |
        v
Competition Service
        |
        v
Mongoose
        |
        v
MongoDB
```

The architecture should follow:

``` text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

Controllers should remain thin. Business rules belong in services.

------------------------------------------------------------------------

## 5. Core Principle

The client displays state; the server enforces rules.

For example, the mobile application may display:

``` text
Register Now
```

but the backend must independently verify:

1.  User is authenticated.
2.  Competition exists.
3.  Registration window is open.
4.  Competition has capacity.
5.  User is not already registered.
6.  Required payment state is valid.

The client must never be trusted to enforce deadlines or capacity.

------------------------------------------------------------------------

## 6. Project Structure

``` text
feedants-competition/
|
├── mobile/
│   ├── app/
│   │   ├── _layout.jsx
│   │   ├── index.jsx
│   │   ├── (auth)/
│   │   │   ├── login.jsx
│   │   │   └── register.jsx
│   │   └── competition/
│   │       └── [id].jsx
│   |
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   │   └── competition/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── api/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── utils/
│   │   └── constants/
│   |
│   ├── assets/
│   └── package.json
|
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── seed/
│   │   └── app.js
│   ├── server.js
│   └── package.json
|
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── business-rules.md
|
├── README.md
└── .gitignore
```

------------------------------------------------------------------------

## 7. Database Design

### 7.1 Users

``` js
{
  _id,
  name,
  email,
  passwordHash,
  profileImage,
  createdAt,
  updatedAt
}
```

Unique index:

``` text
email
```

------------------------------------------------------------------------

### 7.2 Competitions

``` js
{
  _id,
  title,
  category,
  tags: [],
  description,
  prizePool,
  entryFee,
  maxParticipants,
  participantCount,

  registrationStartsAt,
  registrationEndsAt,
  submissionStartsAt,
  submissionEndsAt,
  resultDate,

  judge: {
    name,
    image,
    designation,
    experience,
    introVideo
  },

  previousWinners: [
    {
      name,
      position,
      image,
      video
    }
  ],

  judgingParameters: [
    {
      name,
      description,
      weight
    }
  ],

  rules: [],
  eligibility: [],

  rewards: [
    {
      position,
      title,
      amount
    }
  ],

  status,
  createdAt,
  updatedAt
}
```

------------------------------------------------------------------------

### 7.3 Registrations

``` js
{
  _id,
  competitionId,
  userId,
  status,
  paymentStatus,
  amountPaid,
  registeredAt,
  createdAt,
  updatedAt
}
```

Unique compound index:

``` text
{ competitionId: 1, userId: 1 }
```

This prevents the same user from registering twice for the same
competition.

------------------------------------------------------------------------

### 7.4 Submissions

``` js
{
  _id,
  competitionId,
  userId,
  mediaUrl,
  thumbnailUrl,
  fileName,
  fileSize,
  mimeType,
  caption,
  status,
  submittedAt,
  createdAt,
  updatedAt
}
```

Unique compound index:

``` text
{ competitionId: 1, userId: 1 }
```

Use this if the MVP permits only one submission per participant.

------------------------------------------------------------------------

## 8. Competition Lifecycle

Use server-side timestamps to determine lifecycle.

``` text
UPCOMING
   ↓
REGISTRATION_OPEN
   ↓
SUBMISSION_OPEN
   ↓
JUDGING
   ↓
RESULT_PUBLISHED
```

Additional state:

``` text
CANCELLED
```

Rules:

``` text
UPCOMING:
now < registrationStartsAt

REGISTRATION_OPEN:
registrationStartsAt <= now <= registrationEndsAt

SUBMISSION_OPEN:
now > registrationEndsAt
AND now >= submissionStartsAt
AND now <= submissionEndsAt

JUDGING:
submissionEndsAt < now < resultDate

RESULT_PUBLISHED:
now >= resultDate
```

The exact lifecycle calculation should live in the competition service.

------------------------------------------------------------------------

## 9. API Design

Base path:

``` text
/api/v1
```

### Authentication

``` http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Competition

``` http
GET /api/v1/competitions/:id
```

Optional:

``` http
GET /api/v1/competitions
```

### Registration

``` http
POST /api/v1/competitions/:id/register
GET  /api/v1/competitions/:id/registration
```

### Submission

``` http
POST /api/v1/competitions/:id/submission
GET  /api/v1/competitions/:id/submission
PUT  /api/v1/competitions/:id/submission
```

------------------------------------------------------------------------

## 10. Competition API Response

The competition endpoint should return a UI-ready representation instead
of exposing raw database documents.

Example:

``` json
{
  "success": true,
  "data": {
    "id": "abc123",
    "title": "Feedants Classical Dance",
    "category": "Dance",
    "tags": ["Dance", "Multi-Win"],
    "prizePool": 1500,
    "entryFee": 99,

    "participants": {
      "current": 1,
      "maximum": 20,
      "remaining": 19
    },

    "lifecycle": {
      "state": "REGISTRATION_OPEN",
      "registrationEndsAt": "...",
      "submissionStartsAt": "...",
      "submissionEndsAt": "...",
      "resultDate": "..."
    },

    "userState": {
      "registered": false,
      "submissionStatus": "NOT_SUBMITTED"
    },

    "actions": {
      "canRegister": true,
      "canSubmit": false
    }
  }
}
```

------------------------------------------------------------------------

## 11. Authentication

Registration:

``` text
Request
  ↓
Validate input
  ↓
Hash password using bcrypt
  ↓
Create user
  ↓
Generate JWT
  ↓
Return token
```

Login:

``` text
Email + Password
  ↓
Find user
  ↓
bcrypt.compare()
  ↓
Generate JWT
  ↓
Return token
```

Protected requests:

``` text
Authorization: Bearer <token>
```

JWT middleware should populate:

``` text
req.user
```

------------------------------------------------------------------------

## 12. Registration Business Logic

Flow:

``` text
POST /competitions/:id/register
          |
          v
Authenticate user
          |
          v
Find competition
          |
          v
Validate lifecycle
          |
          v
Check capacity
          |
          v
Check duplicate registration
          |
          v
Payment validation
          |
          v
Atomically reserve capacity
          |
          v
Create registration
          |
          v
Commit transaction
          |
          v
Return updated state
```

Important invariants:

``` text
participantCount <= maxParticipants
```

and:

``` text
one user + one competition = one registration
```

------------------------------------------------------------------------

## 13. Concurrency Strategy

This is a mandatory part of the MVP because the assignment explicitly
mentions concurrent users.

Example:

``` text
Capacity = 20
Current = 19

User A ─┐
User B ─┼──> Register simultaneously
User C ─┘
```

Only one request may reserve the final spot.

Use:

1.  Atomic capacity condition.
2.  MongoDB transaction for competition + registration changes.
3.  Unique registration index.

Conceptual transaction:

``` text
START TRANSACTION

1. Verify competition.
2. Verify registration window.
3. Atomically increment participant count only if capacity exists.
4. Create registration.
5. Commit.

If any step fails:
    Abort transaction.
```

Expected result:

``` text
Successful registrations: 1
Final participant count: 20
```

Never:

``` text
Final participant count: 21
```

------------------------------------------------------------------------

## 14. Submission Business Logic

Flow:

``` text
POST /competitions/:id/submission
          |
          v
Authenticate
          |
          v
Find competition
          |
          v
Check registration
          |
          v
Check submission window
          |
          v
Validate media
          |
          v
Upload media
          |
          v
Create submission
          |
          v
Return submission state
```

Rules:

-   User must be authenticated.
-   User must be registered.
-   Submission window must be open.
-   Media type must be allowed.
-   Media size must be within limits.
-   User can submit only once in MVP.
-   Submission after deadline is rejected.

------------------------------------------------------------------------

## 15. Media Storage

Do not store video binaries in MongoDB.

Recommended optional MVP integration:

``` text
React Native
    ↓
Cloudinary
    ↓
media URL
    ↓
MongoDB
```

MongoDB stores metadata and URLs.

If time is limited, implement the submission business logic first using
a test/mock media URL, then add Cloudinary after the core workflow is
stable.

------------------------------------------------------------------------

## 16. Payment Strategy

The reference design contains an entry fee.

For MVP, payment should be isolated behind a service abstraction:

``` text
PaymentService
├── createPayment()
├── verifyPayment()
└── refundPayment()
```

Start with:

``` text
MockPaymentService
```

or Razorpay Test Mode if time permits.

Do not allow payment implementation to delay the core competition
workflow.

------------------------------------------------------------------------

## 17. React Native Component Architecture

Main screen:

``` text
CompetitionDetailsScreen
│
├── CompetitionHeader
├── CompetitionStats
├── JudgeCard
├── CountdownCard
├── ImportantDates
├── PreviousWinners
├── CompetitionTabs
│   ├── About
│   ├── Judging Parameters
│   └── Rules & Eligibility
├── RewardsList
├── Disclaimer
├── PaymentInfo
├── ReferralCard
└── BottomAction
```

Each component should receive data through props.

Competition-specific values must not be embedded directly inside
components.

------------------------------------------------------------------------

## 18. Bottom CTA State Machine

The bottom action should respond to backend state.

### Not registered

``` text
Register Now
₹99
```

### Registered, submission not started

``` text
Registered
Submission Opens Soon
```

### Registered, submission open, no submission

``` text
Upload Submission
```

### Submission uploaded

``` text
Submission Uploaded
```

### Registration closed and user not registered

``` text
Registration Closed
```

### Results published

``` text
View Results
```

------------------------------------------------------------------------

## 19. Countdown

Backend provides:

``` text
registrationEndsAt
```

Mobile calculates:

``` text
remaining = registrationEndsAt - currentTime
```

Display:

``` text
DD : HH : MM : SS
```

Implement:

``` text
useCountdown.js
```

Requirements:

-   Updates every second.
-   Stops after expiry.
-   Cleans up interval on unmount.
-   Uses server-provided target timestamp.
-   Never decides whether an API operation is authorized.

------------------------------------------------------------------------

## 20. TanStack Query

Use TanStack Query for server state.

Competition:

``` text
useQuery(["competition", competitionId])
```

Registration:

``` text
useMutation()
```

After registration:

``` text
invalidate competition query
```

This causes the UI to update with:

-   New participant count.
-   New remaining spots.
-   Registered state.
-   New available actions.

------------------------------------------------------------------------

## 21. Error Handling

Use a consistent backend format:

``` json
{
  "success": false,
  "error": {
    "code": "COMPETITION_FULL",
    "message": "All participation spots have been filled."
  }
}
```

Important codes:

``` text
AUTH_REQUIRED
INVALID_CREDENTIALS
VALIDATION_ERROR
COMPETITION_NOT_FOUND
REGISTRATION_NOT_STARTED
REGISTRATION_CLOSED
COMPETITION_FULL
ALREADY_REGISTERED
NOT_REGISTERED
SUBMISSION_NOT_STARTED
SUBMISSION_CLOSED
ALREADY_SUBMITTED
INVALID_FILE
PAYMENT_FAILED
INTERNAL_ERROR
```

Mobile must translate these into useful UI feedback.

------------------------------------------------------------------------

## 22. Validation

### User

-   Valid name.
-   Valid email.
-   Minimum password length.
-   Unique email.

### Competition

-   Valid timestamps.
-   Registration start before registration end.
-   Submission start before submission end.
-   Result date after submission end.
-   Positive participant capacity.
-   Non-negative entry fee.
-   Rewards total equals prize pool.

### Registration

-   Valid user.
-   Valid competition.
-   Registration open.
-   Capacity available.
-   User not already registered.

### Submission

-   User registered.
-   Submission window open.
-   Valid MIME type.
-   Valid file size.
-   No previous submission.

------------------------------------------------------------------------

## 23. Security

Implement:

-   bcrypt password hashing.
-   JWT authentication.
-   Protected routes.
-   Request validation.
-   Helmet.
-   CORS.
-   Rate limiting.
-   Environment variables.
-   Centralized error handling.
-   No password hashes in API responses.
-   No secrets committed to Git.
-   Server-side lifecycle enforcement.

------------------------------------------------------------------------

## 24. Environment Variables

### Server

``` env
PORT=5000
NODE_ENV=development

MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Mobile

``` env
EXPO_PUBLIC_API_URL=
```

Provide:

``` text
.env.example
```

for both projects.

------------------------------------------------------------------------

## 25. Seed Data

Create:

``` text
server/src/seed/seed.js
```

Seed:

### Demo user

``` text
Name: Demo User
Email: demo@example.com
Password: password123
```

### Main competition

Use the supplied design as the source for:

-   Feedants Classical Dance
-   Dance
-   Multi-Win
-   Prize pool
-   Entry fee
-   Capacity
-   Judge
-   Dates
-   Previous winners
-   Rewards
-   Rules
-   Judging parameters

Also seed test competitions for:

``` text
REGISTRATION_OPEN
SUBMISSION_OPEN
REGISTRATION_CLOSED
FULL
RESULT_PUBLISHED
```

This allows every UI state to be demonstrated.

------------------------------------------------------------------------

## 26. Development Phases

### Phase 1 --- Repository Setup

Tasks:

-   Create GitHub repository.
-   Create mobile directory.
-   Create server directory.
-   Create docs directory.
-   Initialize Git.
-   Add README.
-   Add .gitignore.
-   Add .env.example.

Deliverable:

``` text
Clean repository with mobile and server projects.
```

------------------------------------------------------------------------

### Phase 2 --- Mobile Foundation

Tasks:

-   Create Expo React Native application.
-   Configure JavaScript.
-   Configure Expo Router.
-   Add navigation.
-   Add theme/constants.
-   Add TanStack Query provider.
-   Add Axios client.

Deliverable:

``` text
Mobile app launches successfully.
```

------------------------------------------------------------------------

### Phase 3 --- Backend Foundation

Tasks:

-   Initialize Node project.
-   Install Express.
-   Configure environment.
-   Configure MongoDB.
-   Add health endpoint.
-   Add centralized error handling.
-   Add middleware.

Deliverable:

``` text
GET /api/v1/health
```

works.

------------------------------------------------------------------------

### Phase 4 --- Database

Tasks:

-   Create User model.
-   Create Competition model.
-   Create Registration model.
-   Create Submission model.
-   Create indexes.
-   Create seed script.

Deliverable:

``` text
MongoDB contains usable seed data.
```

------------------------------------------------------------------------

### Phase 5 --- Authentication

Tasks:

-   Registration endpoint.
-   Login endpoint.
-   Current-user endpoint.
-   bcrypt.
-   JWT middleware.
-   Protected routes.

Deliverable:

``` text
User can register, login, and access protected endpoints.
```

------------------------------------------------------------------------

### Phase 6 --- Competition API

Implement:

``` http
GET /api/v1/competitions/:id
```

Backend calculates:

-   Lifecycle.
-   Remaining spots.
-   User registration state.
-   Submission state.
-   Available actions.

Deliverable:

``` text
Complete competition data is available dynamically.
```

------------------------------------------------------------------------

### Phase 7 --- UI Implementation

Build in this order:

1.  Header.
2.  Competition statistics.
3.  Judge card.
4.  Countdown.
5.  Important dates.
6.  Previous winners.
7.  Tabs.
8.  Rewards.
9.  Disclaimer.
10. Referral/payment information.
11. Bottom CTA.

Deliverable:

``` text
UI visually follows the reference design.
```

------------------------------------------------------------------------

### Phase 8 --- API Integration

Tasks:

-   Connect Axios.
-   Fetch competition using TanStack Query.
-   Remove hardcoded competition values.
-   Implement loading state.
-   Implement error state.
-   Implement retry.
-   Implement pull-to-refresh.

Deliverable:

``` text
Competition screen is backend-driven.
```

------------------------------------------------------------------------

### Phase 9 --- Registration

Tasks:

-   Registration endpoint.
-   Lifecycle validation.
-   Capacity validation.
-   Duplicate protection.
-   Transaction.
-   Participant count update.
-   TanStack Query mutation.
-   Query invalidation.

Deliverable:

``` text
User can register and UI changes immediately.
```

------------------------------------------------------------------------

### Phase 10 --- Concurrency

Tasks:

-   Atomic capacity reservation.
-   MongoDB transaction.
-   Unique registration index.
-   Concurrent request test.

Deliverable:

``` text
Capacity cannot be exceeded.
```

------------------------------------------------------------------------

### Phase 11 --- Submission

Tasks:

-   Submission endpoint.
-   Registration validation.
-   Date validation.
-   File validation.
-   Duplicate prevention.
-   Submission state.

Deliverable:

``` text
Registered users can submit during the correct window.
```

------------------------------------------------------------------------

### Phase 12 --- Lifecycle

Test:

``` text
UPCOMING
REGISTRATION_OPEN
SUBMISSION_OPEN
JUDGING
RESULT_PUBLISHED
CANCELLED
```

Deliverable:

``` text
UI changes correctly based on competition lifecycle.
```

------------------------------------------------------------------------

### Phase 13 --- Error and Edge States

Implement:

-   Loading.
-   API error.
-   Not found.
-   Full competition.
-   Registration closed.
-   Submission not started.
-   Submission closed.
-   Already registered.
-   Already submitted.
-   Unauthorized.

------------------------------------------------------------------------

### Phase 14 --- Testing

Backend tests:

-   Auth.
-   Competition.
-   Registration.
-   Submission.
-   Validation.
-   Concurrency.

Manual mobile tests:

-   Navigation.
-   Login.
-   Competition loading.
-   Registration.
-   Refresh.
-   Submission.
-   Countdown.
-   Error states.

------------------------------------------------------------------------

### Phase 15 --- Visual Polish

After functionality is stable:

-   Typography.
-   Spacing.
-   Colors.
-   Cards.
-   Borders.
-   Shadows.
-   Icons.
-   Safe areas.
-   Horizontal scrolling.
-   Bottom CTA.
-   Animations.

------------------------------------------------------------------------

### Phase 16 --- Documentation

Create:

``` text
docs/
├── architecture.md
├── api.md
├── database.md
└── business-rules.md
```

README must include:

-   Project overview.
-   Setup.
-   Environment variables.
-   Running mobile.
-   Running server.
-   API endpoints.
-   Database structure.
-   Business rules.
-   Concurrency approach.
-   Assumptions.
-   Technical decisions.
-   Trade-offs.
-   Production improvements.
-   Demo credentials.

------------------------------------------------------------------------

### Phase 17 --- Demo Recording

Target 2--3 minutes.

Suggested sequence:

``` text
1. Login.
2. Open competition.
3. Show dynamic competition data.
4. Show countdown.
5. Register.
6. Show registered state.
7. Refresh.
8. Show persisted state.
9. Show submission state.
10. Demonstrate a closed/full state.
11. Briefly show backend/database.
```

------------------------------------------------------------------------

## 27. Testing Matrix

  Scenario                   Expected Result
  -------------------------- ------------------------------
  Valid registration         Account created
  Duplicate email            Rejected
  Valid login                JWT returned
  Invalid password           Rejected
  Valid competition          Details returned
  Invalid competition        404
  Registration open          Registration allowed
  Registration not started   Rejected
  Registration closed        Rejected
  Competition full           Rejected
  Duplicate registration     Rejected
  Successful registration    Participant count increments
  Concurrent registration    Capacity never exceeded
  Unregistered submission    Rejected
  Submission not started     Rejected
  Submission open            Allowed
  Submission closed          Rejected
  Duplicate submission       Rejected
  API failure                Error state
  Refresh                    Latest server state loaded
  Results published          Results state displayed

------------------------------------------------------------------------

## 28. Acceptance Criteria

### Backend

-   [ ] Express server starts.
-   [ ] MongoDB connects.
-   [ ] Authentication works.
-   [ ] Competition API works.
-   [ ] Registration works.
-   [ ] Submission works.
-   [ ] Validation works.
-   [ ] Error handling works.
-   [ ] Database indexes exist.
-   [ ] Capacity is concurrency-safe.
-   [ ] Tests pass.

### Mobile

-   [ ] App launches.
-   [ ] Login works.
-   [ ] Competition loads from backend.
-   [ ] No competition-specific data is hardcoded.
-   [ ] Countdown works.
-   [ ] Registration state works.
-   [ ] Submission state works.
-   [ ] Loading state works.
-   [ ] Error state works.
-   [ ] Retry works.
-   [ ] Refresh works.
-   [ ] UI closely matches the supplied design.

### Documentation

-   [ ] README is complete.
-   [ ] Setup instructions exist.
-   [ ] Environment variables documented.
-   [ ] API documented.
-   [ ] Database documented.
-   [ ] Business rules documented.
-   [ ] Concurrency strategy documented.
-   [ ] Assumptions documented.
-   [ ] Trade-offs documented.
-   [ ] Future improvements documented.

------------------------------------------------------------------------

## 29. Important Assumptions

1.  A user can register only once per competition.
2.  A participant can submit one video in the MVP.
3.  Competition lifecycle is determined by server-side timestamps.
4.  The mobile countdown is only a presentation mechanism.
5.  The server is authoritative for all competition actions.
6.  Competition capacity must never be exceeded.
7.  Registration records are stored separately from competition
    documents.
8.  Media binaries are not stored in MongoDB.
9.  Payment may use mock/test behavior in the MVP.
10. Real-time WebSocket updates are not required for MVP.

------------------------------------------------------------------------

## 30. Technical Trade-offs

### JavaScript instead of TypeScript

Chosen because TypeScript is not required and the assignment can be
implemented effectively with JavaScript plus runtime validation.

### REST instead of WebSockets

Chosen because the MVP does not require continuous real-time updates.
Refetching and pull-to-refresh are sufficient.

### MongoDB instead of a relational database

Chosen because competition data contains naturally nested structures
such as judge details, rewards, rules, and judging parameters.

### Monolith instead of microservices

Chosen because the assignment is a single bounded feature. A modular
monolith is simpler to develop, test, and deploy.

### Redis not included initially

Caching is not required for the initial scale of the assignment. MongoDB
remains the authoritative source.

### Payment abstraction

Payment is isolated behind a service so that a test/mock provider can be
replaced with a real payment gateway later.

------------------------------------------------------------------------

## 31. Future Production Improvements

Potential future improvements:

### Scalability

-   Multiple API instances.
-   Load balancer.
-   Redis caching.
-   Database optimization.
-   CDN.

### Real-time

-   WebSockets.
-   Server-Sent Events.

### Media

-   Cloud storage.
-   CDN.
-   Video transcoding.
-   Thumbnail generation.
-   Moderation.

### Payments

-   Razorpay production integration.
-   Webhooks.
-   Payment reconciliation.
-   Refunds.

### Product

-   Admin dashboard.
-   Judging platform.
-   Notifications.
-   Referral system.
-   User profiles.
-   Competition discovery.

### Operations

-   CI/CD.
-   Monitoring.
-   Centralized logs.
-   Distributed tracing.
-   Audit logs.

------------------------------------------------------------------------

## 32. Final Implementation Sequence

``` text
01. Create GitHub repository
        ↓
02. Create Expo React Native JavaScript app
        ↓
03. Create Express server
        ↓
04. Configure MongoDB Atlas
        ↓
05. Create Mongoose schemas
        ↓
06. Add indexes
        ↓
07. Create seed data
        ↓
08. Implement authentication
        ↓
09. Implement competition API
        ↓
10. Build competition UI
        ↓
11. Connect UI to API
        ↓
12. Implement lifecycle
        ↓
13. Implement registration
        ↓
14. Add transaction + atomic capacity protection
        ↓
15. Add concurrency tests
        ↓
16. Implement submission
        ↓
17. Implement countdown
        ↓
18. Implement all UI states
        ↓
19. Add error/loading/empty states
        ↓
20. Add optional media upload
        ↓
21. Polish UI
        ↓
22. Run complete test matrix
        ↓
23. Write README/docs
        ↓
24. Record demo
        ↓
25. Final GitHub review
        ↓
26. Submit
```

------------------------------------------------------------------------

## 33. MVP Definition of Done

The MVP is complete when the following end-to-end workflow works:

``` text
User
  ↓
Register
  ↓
Login
  ↓
Open Competition
  ↓
Fetch competition from API
  ↓
View dynamic competition details
  ↓
Register
  ↓
Backend validates capacity + lifecycle + duplicate state
  ↓
Registration stored
  ↓
Participant count updated
  ↓
Mobile UI refreshes
  ↓
Submission window opens
  ↓
Registered user uploads submission
  ↓
Backend validates eligibility + lifecycle
  ↓
Submission stored
  ↓
Mobile UI shows Submitted
```

The system must reject:

``` text
Duplicate registration
Over-capacity registration
Registration before start
Registration after deadline
Submission without registration
Submission before start
Submission after deadline
Duplicate submission
Unauthorized requests
Invalid input
```

The final MVP therefore demonstrates:

``` text
Reference Design
       +
Dynamic Data
       +
Authentication
       +
Competition Lifecycle
       +
Registration
       +
Concurrency Safety
       +
Submission
       +
MongoDB Persistence
       +
Production-Oriented Architecture
       =
Functional Full-Stack Competition Module
```
