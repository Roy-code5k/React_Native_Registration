# Database Schema & Data Models — Feedants Module

The database layer is implemented using **MongoDB** and **Mongoose**.

---

## 1. Entity Relationship Overview

```
   +--------------------+               +-------------------------+
   |        User        |               |       Competition       |
   +--------------------+               +-------------------------+
   | _id                |               | _id                     |
   | name               |               | title                   |
   | email (unique)     |               | prizePool               |
   | passwordHash       |               | entryFee                |
   | profileImage       |               | maxParticipants         |
   | referralCode       |               | participantCount        |
   +--------------------+               | registrationStartsAt    |
         |         |                    | registrationEndsAt      |
         |         |                    | submissionStartsAt      |
         |         |                    | submissionEndsAt        |
         |         |                    | resultDate              |
         |         |                    | judge { ... }           |
         |         |                    | previousWinners [ ... ] |
         |         |                    | judgingParameters [ ...]|
         |         |                    | rewards [ ... ]         |
         |         |                    +-------------------------+
         |         |                                 |         |
         | 1       | 1                               | 1       | 1
         v         v                                 v         v
+------------------------+                  +------------------------+
|      Registration      |                  |       Submission       |
+------------------------+                  +------------------------+
| _id                    |                  | _id                    |
| competitionId (FK)     |                  | competitionId (FK)     |
| userId (FK)            |                  | userId (FK)            |
| status (CONFIRMED)     |                  | mediaUrl               |
| paymentStatus (PAID)   |                  | title                  |
| amountPaid             |                  | status (SUBMITTED)     |
| registeredAt           |                  | submittedAt            |
+------------------------+                  +------------------------+
 UNIQUE INDEX:                              UNIQUE INDEX:
 { competitionId: 1, userId: 1 }            { competitionId: 1, userId: 1 }
```

---

## 2. Key Indexes & Constraints

### 2.1 Registration Compound Unique Index
```javascript
registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });
```
- **Purpose**: Mathematically guarantees that a user can never register more than once for the same competition, even if two HTTP requests arrive in parallel.

### 2.2 Submission Compound Unique Index
```javascript
submissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });
```
- **Purpose**: Restricts each participant to a single official submission entry per competition.

### 2.3 User Email Index
```javascript
userSchema.index({ email: 1 }, { unique: true });
```
- **Purpose**: Enforces unique account credentials.
