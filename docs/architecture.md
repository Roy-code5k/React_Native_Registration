# System Architecture — Feedants Competition Details Module

## 1. Overview
The **Feedants Competition Details** module is a functional, full-stack application built to support high-concurrency event registration and submission workflows. It follows a decoupled client-server architecture with dynamic state management and strict server-side validation.

```
+-------------------------------------------------------------+
|                      React Native Client                    |
|      (iOS / Android via Expo Go & Desktop Web via Metro)    |
+-------------------------------------------------------------+
                              |
                              | HTTPS / JSON (Axios Client)
                              v
+-------------------------------------------------------------+
|                     Express REST API Gateway                |
|           (/api/v1/competitions, /api/v1/auth)              |
+-------------------------------------------------------------+
         |                                           |
         v                                           v
+-----------------------+                 +---------------------+
| Controller Layer      |                 | Middleware Layer    |
| (Thin HTTP Handlers)  |                 | (JWT Auth, CORS,    |
+-----------------------+                 | Helmet, ErrorHndlr) |
         |                                +---------------------+
         v
+-------------------------------------------------------------+
|                       Service Layer                         |
|   - Dynamic Lifecycle State Calculation                     |
|   - Concurrency-safe Atomic Spot Reservation ($inc + $lt)   |
|   - Submission Eligibility & Rule Enforcement               |
+-------------------------------------------------------------+
         |
         v
+-------------------------------------------------------------+
|                     Mongoose Data Layer                     |
|   (User, Competition, Registration, Submission Models)      |
+-------------------------------------------------------------+
         |
         v
+-------------------------------------------------------------+
|                     MongoDB Persistence                     |
|      (MongoDB Atlas or Zero-Config Embedded Memory Server)  |
+-------------------------------------------------------------+
```

---

## 2. Component Layer Responsibilities

### 2.1 Mobile Application (`/mobile`)
- **Technology**: React Native, Expo SDK, React Native Web, TanStack Query, Axios.
- **Role**: Presentation and interaction only. The client **never** decides whether an action is authorized, whether capacity is left, or if registration deadlines have passed.
- **State Management**: TanStack Query handles server cache, optimistic updates, and background invalidation upon registration or submission.

### 2.2 API Layer (`/server/src/routes` & `/server/src/controllers`)
- Pure routing and request unpacking.
- Standardized response envelope:
  ```json
  {
    "success": true,
    "message": "...",
    "data": { ... }
  }
  ```
- Error envelopes:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "User-friendly explanation"
    }
  }
  ```

### 2.3 Service Layer (`/server/src/services`)
- Contains all core business logic and database mutations.
- Calculates remaining spots, active lifecycle state, user-specific eligibility, and atomic reservations.

### 2.4 Data & Storage Layer (`/server/src/models`)
- Relational integrity enforced through Mongoose schemas and compound unique indexes.
- Video binary data is strictly referenced via CDN / HTTPS URLs, never embedded as raw binary in database documents.
