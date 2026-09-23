# Concurrency & Data Consistency Strategy

## 1. The Challenge
A high-demand competition may have thousands of users waiting for registration to open.
If capacity is 20, and 19 spots are filled, 50 users may hit "Register Now" within the exact same millisecond.

A naive approach:
```javascript
// NAIVE ANTI-PATTERN (RACE CONDITION VULNERABLE):
const comp = await Competition.findById(id);
if (comp.participantCount < comp.maxParticipants) {
  comp.participantCount += 1;
  await comp.save(); // OVER-ALLOCATION OCCURS HERE!
}
```
Under high concurrency, 50 requests will read `participantCount = 19`, pass the check, and increment to 69!

---

## 2. The Solution: Atomic Conditional Reservation

We solve this using **atomic conditional updates** directly at the database engine level:

```javascript
const updatedComp = await Competition.findOneAndUpdate(
  {
    _id: competitionId,
    participantCount: { $lt: competition.maxParticipants }, // ATOMIC GUARD CONDITION
  },
  {
    $inc: { participantCount: 1 },                          // ATOMIC INCREMENT
  },
  {
    new: true,
  }
);

if (!updatedComp) {
  // If null is returned, capacity was reached between query and execution!
  const err = new Error('All participation spots have been filled.');
  err.statusCode = 409;
  err.code = 'COMPETITION_FULL';
  throw err;
}
```

### Why this is 100% Concurrency Safe:
1. **Single Threaded Document-Level Lock in MongoDB**:
   - MongoDB evaluates the query predicate `{ participantCount: { $lt: maxParticipants } }` under an internal write lock.
   - If `participantCount` is 19 and `maxParticipants` is 20, only **one single update operation** can match and increment it to 20.
   - All subsequent 49 requests will find `participantCount: 20` which does **not** satisfy `{ $lt: 20 }`.
   - Those 49 queries match zero documents and return `null`, immediately triggering a `409 COMPETITION_FULL` rejection.
2. **Compensation Rollback on Race Condition**:
   - If creating the registration record fails (e.g., duplicate user check via unique compound index), the server immediately executes an atomic decrement:
     ```javascript
     await Competition.findByIdAndUpdate(competitionId, { $inc: { participantCount: -1 } });
     ```

---

## 3. Automated Concurrency Test Proof

The test in `server/tests/concurrency.test.js` proves this mechanism:
- Sets up a competition with `maxParticipants = 10` and `participantCount = 9` (exactly 1 spot left).
- Spawns 25 concurrent authenticated HTTP requests simultaneously via `Promise.all()`.
- **Result**:
  - Exactly **1 request** receives `201 Created`.
  - Exactly **24 requests** receive `409 COMPETITION_FULL`.
  - In MongoDB, `participantCount` equals **10** (never 11+).
