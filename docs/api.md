# API Reference — Feedants Competition Module

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication Endpoints

### 1.1 Register New Account
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Arjun Das",
    "email": "arjun@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "Arjun Das",
        "email": "arjun@example.com",
        "profileImage": "https://..."
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### 1.2 Login
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "demo@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "60d0fe4f5311236168a109cb",
        "name": "Demo Participant",
        "email": "demo@example.com"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### 1.3 Current User Info
- **Endpoint**: `GET /auth/me`
- **Access**: Private (`Authorization: Bearer <token>`)

---

## 2. Competition Endpoints

### 2.1 Get Competition Details
- **Endpoint**: `GET /competitions/:idOrSlug`
- **Access**: Optional Auth (Pass `Bearer <token>` to get personalized registration & submission status)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "60d0fe4f5311236168a109cc",
      "slug": "classical-dance-2026",
      "title": "Feedants Classical Dance",
      "category": "Dance",
      "tags": ["Dance", "Multi-Win"],
      "certificateText": "Winners get certificate",
      "prizePool": 1500,
      "entryFee": 99,
      "participants": {
        "current": 1,
        "maximum": 20,
        "remaining": 19
      },
      "lifecycle": {
        "state": "REGISTRATION_OPEN",
        "registrationStartsAt": "2026-09-18T...",
        "registrationEndsAt": "2026-09-24T...",
        "submissionStartsAt": "2026-09-22T...",
        "submissionEndsAt": "2026-10-08T...",
        "resultDate": "2026-10-13T..."
      },
      "judge": {
        "name": "Manju Dubey",
        "designation": "Professional Kathak Dancer",
        "experience": "12+ Years of Experience",
        "image": "https://...",
        "introVideo": "https://..."
      },
      "previousWinners": [...],
      "description": "...",
      "judgingParameters": [...],
      "rules": [...],
      "eligibility": [...],
      "rewards": [...],
      "userState": {
        "isAuthenticated": true,
        "isRegistered": true,
        "registeredAt": "2026-09-23T...",
        "submissionStatus": "NOT_SUBMITTED",
        "submission": null
      },
      "actions": {
        "canRegister": false,
        "canSubmit": true,
        "reason": null
      }
    }
  }
  ```

### 2.2 List Competitions
- **Endpoint**: `GET /competitions`
- **Access**: Public
- **Description**: Returns all competitions and current status summary.

### 2.3 Register for Competition
- **Endpoint**: `POST /competitions/:id/register`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful! Participation spot confirmed.",
    "data": {
      "registration": {
        "_id": "...",
        "competitionId": "...",
        "userId": "...",
        "amountPaid": 99,
        "status": "CONFIRMED"
      },
      "competition": { ... }
    }
  }
  ```
- **Error Responses**:
  - `409 Conflict`: `COMPETITION_FULL` ("All participation spots have been filled.")
  - `409 Conflict`: `ALREADY_REGISTERED` ("You are already registered for this competition.")
  - `400 Bad Request`: `REGISTRATION_CLOSED` ("Registration is closed for this competition.")

### 2.4 Upload Submission
- **Endpoint**: `POST /competitions/:id/submission`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "title": "Kathak Tarana Performance",
    "mediaUrl": "https://commondatastorage.googleapis.com/.../dance.mp4",
    "caption": "Choreography set in Raag Yaman, Teentaal."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Submission uploaded successfully! Entry will be evaluated by the judge.",
    "data": {
      "submission": { ... },
      "competition": { ... }
    }
  }
  ```
- **Error Responses**:
  - `403 Forbidden`: `NOT_REGISTERED` ("You must be a registered participant to submit an entry.")
  - `400 Bad Request`: `SUBMISSION_NOT_STARTED` or `SUBMISSION_CLOSED`
  - `409 Conflict`: `ALREADY_SUBMITTED`
