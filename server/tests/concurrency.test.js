const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/authMiddleware');

describe('Competition Concurrency & Atomic Spot Reservation', () => {
  let competitionId;
  let tokens = [];

  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
    await Competition.deleteMany({});
    await Registration.deleteMany({});

    // Create a competition with capacity = 10, current = 9 (ONLY 1 SPOT REMAINING!)
    const comp = await Competition.create({
      title: 'High-Concurrency Stress Test Competition',
      category: 'Dance',
      prizePool: 1000,
      entryFee: 50,
      maxParticipants: 10,
      participantCount: 9, // Only 1 spot left
      registrationStartsAt: new Date(Date.now() - 100000),
      registrationEndsAt: new Date(Date.now() + 100000),
      submissionStartsAt: new Date(Date.now() + 100000),
      submissionEndsAt: new Date(Date.now() + 200000),
      resultDate: new Date(Date.now() + 300000),
      judge: {
        name: 'Judge Test',
        designation: 'Expert',
        experience: '10 Yrs',
        image: 'http://example.com/img.jpg',
      },
      description: 'Concurrency test competition',
    });
    competitionId = comp._id;

    // Create 25 distinct users to attempt concurrent registration for the last spot
    for (let i = 0; i < 25; i++) {
      const user = await User.create({
        name: `Stress User ${i}`,
        email: `stress${i}@example.com`,
        passwordHash: 'dummyhash',
      });
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      tokens.push(token);
    }
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test('Simultaneous registrations must not exceed capacity under heavy concurrency', async () => {
    // Fire 25 parallel registration requests for the single available spot
    const promises = tokens.map((token) =>
      request(app)
        .post(`/api/v1/competitions/${competitionId}/register`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
    );

    const responses = await Promise.all(promises);

    const successful = responses.filter((r) => r.status === 201);
    const rejected = responses.filter(
      (r) => r.status === 409 && r.body.error && r.body.error.code === 'COMPETITION_FULL'
    );

    // Exactly 1 user must have succeeded
    expect(successful.length).toBe(1);

    // Remaining 24 users must have been rejected because capacity was reached
    expect(rejected.length).toBe(24);

    // Verify database state: participantCount must be exactly 10, not 11+
    const compInDb = await Competition.findById(competitionId);
    expect(compInDb.participantCount).toBe(10);

    // Total registrations for this competition must be 1 (since 9 previous were simulated count)
    const totalRegs = await Registration.countDocuments({ competitionId });
    expect(totalRegs).toBe(1);
  });
});
