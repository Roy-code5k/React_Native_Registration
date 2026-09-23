const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');

const seedData = async () => {
  try {
    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Competition.deleteMany({}),
      Registration.deleteMany({}),
      Submission.deleteMany({}),
    ]);

    // 1. Create Demo Users
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('password123', salt);

    const demoUser = await User.create({
      name: 'Demo Participant',
      email: 'demo@example.com',
      passwordHash: demoPasswordHash,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      referralCode: 'feed_demo123',
    });

    const participantUser1 = await User.create({
      name: 'Pooja Sharma',
      email: 'pooja@example.com',
      passwordHash: demoPasswordHash,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
      referralCode: 'feed_pooja88',
    });

    const participantUser2 = await User.create({
      name: 'Rohan Gupta',
      email: 'rohan@example.com',
      passwordHash: demoPasswordHash,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      referralCode: 'feed_rohan42',
    });

    console.log('Seeded 3 users successfully.');

    // 2. Dates setup for Classical Dance competition matching image
    // In reference image: "01d : 06h : 28m : 32s" remaining
    const now = Date.now();
    const oneDaySixHours = 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 28 * 60 * 1000;
    const regEndsAt = new Date(now + oneDaySixHours);
    const regStartsAt = new Date(now - 5 * 24 * 60 * 60 * 1000);
    const subStartsAt = new Date(now - 1 * 24 * 60 * 60 * 1000); // Submission open
    const subEndsAt = new Date(now + 15 * 24 * 60 * 60 * 1000);
    const resDate = new Date(now + 20 * 24 * 60 * 60 * 1000);

    // 3. Create Main Primary Competition
    const mainCompetition = await Competition.create({
      slug: 'classical-dance-2026',
      title: 'Feedants Classical Dance',
      category: 'Dance',
      tags: ['Dance', 'Multi-Win'],
      certificateText: 'Winners get certificate',
      prizePool: 1500,
      entryFee: 99,
      maxParticipants: 20,
      participantCount: 1, // Pre-seeded with 1 participant matching "1 / 20 Booked"
      registrationStartsAt: regStartsAt,
      registrationEndsAt: regEndsAt,
      submissionStartsAt: subStartsAt,
      submissionEndsAt: subEndsAt,
      resultDate: resDate,
      judge: {
        name: 'Manju Dubey',
        designation: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        introVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      previousWinners: [
        {
          name: 'Riya Shah',
          position: '1st Winner',
          image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=300&q=80',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        },
        {
          name: 'Aarav Mehta',
          position: '1st Winner',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
        {
          name: 'Neha Verma',
          position: '2nd Winner',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        },
        {
          name: 'Ishita Chouhan',
          position: '3rd Winner',
          image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        },
      ],
      description:
        'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
      judgingParameters: [
        {
          name: 'Rhythm & Timing (Taal)',
          weight: 30,
          description: 'Accuracy in steps, footwork, and synchronicity with tempo and rhythmic cycles.',
        },
        {
          name: 'Abhinaya & Expression (Bhava)',
          weight: 30,
          description: 'Facial expressions, eye movements, storytelling, and emotional depth.',
        },
        {
          name: 'Costume & Presentation',
          weight: 20,
          description: 'Authenticity of traditional attire, ghungroos, jewelry, posture, and poise.',
        },
        {
          name: 'Creativity & Choreography',
          weight: 20,
          description: 'Originality, aesthetic grace, and fluidity of the movement sequence.',
        },
      ],
      rules: [
        'Individual entries only; group performances are not eligible for this category.',
        'Video must be recorded in high definition (minimum 720p) with clear background music.',
        'Maximum performance duration is 3 minutes (180 seconds).',
        'Only classical Indian dance forms are permitted (Kathak, Bharatanatyam, Odissi, Kuchipudi, Kathakali, Mohiniyattam, Manipuri, Sattriya).',
        'No post-production speed alteration, heavy filters, or editing effects allowed.',
        'The decision of the designated judge will be final and binding.',
      ],
      eligibility: [
        'Open to all dance enthusiasts worldwide regardless of age or nationality.',
        'Only contributions from verified paid participants will be considered for official judging.',
        'Both amateur and trained performers are welcome to participate.',
      ],
      rewards: [
        { position: 1, title: '1st Winner', amount: 550, icon: 'trophy' },
        { position: 2, title: '2nd Winner', amount: 300, icon: 'medal' },
        { position: 3, title: '3rd Winner', amount: 240, icon: 'medal' },
        { position: 4, title: '4th Winner', amount: 200, icon: 'star' },
        { position: 5, title: '5th Winner', amount: 130, icon: 'star' },
        { position: 6, title: '6th Winner', amount: 80, icon: 'star' },
      ],
      meta: {
        referralBonus: 10,
        disclaimer: 'Only contributions from paid participants will be considered for judging.',
      },
    });

    // 4. Pre-register participantUser1 to match "1 / 20 Booked"
    await Registration.create({
      competitionId: mainCompetition._id,
      userId: participantUser1._id,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      amountPaid: 99,
      registeredAt: new Date(now - 12 * 60 * 60 * 1000),
    });

    // Pre-register demoUser initially so the initial screen loads as "Registered" exactly like the screenshot!
    await Registration.create({
      competitionId: mainCompetition._id,
      userId: demoUser._id,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      amountPaid: 99,
      registeredAt: new Date(now - 6 * 60 * 60 * 1000),
    });
    // Adjust participant count to 1 for initial display demo (or 2)
    await Competition.findByIdAndUpdate(mainCompetition._id, { participantCount: 1 });

    // 5. Seed Edge-Case Competitions to demonstrate other lifecycle states
    // A) Fully Booked Competition
    await Competition.create({
      slug: 'classical-dance-full',
      title: 'Classical Dance Championship (Grand Finale)',
      category: 'Dance',
      tags: ['Dance', 'Solo'],
      certificateText: 'Winners get certificate',
      prizePool: 2500,
      entryFee: 149,
      maxParticipants: 10,
      participantCount: 10, // Full!
      registrationStartsAt: regStartsAt,
      registrationEndsAt: regEndsAt,
      submissionStartsAt: subStartsAt,
      submissionEndsAt: subEndsAt,
      resultDate: resDate,
      judge: mainCompetition.judge,
      previousWinners: mainCompetition.previousWinners,
      description: 'Grand Finale round for elite performers. Registration is strictly capped at 10 participants.',
      judgingParameters: mainCompetition.judgingParameters,
      rules: mainCompetition.rules,
      eligibility: mainCompetition.eligibility,
      rewards: [
        { position: 1, title: '1st Winner', amount: 1500, icon: 'trophy' },
        { position: 2, title: '2nd Winner', amount: 1000, icon: 'medal' },
      ],
    });

    // B) Closed Competition
    await Competition.create({
      slug: 'classical-dance-closed',
      title: 'Summer Classical Dance Cup 2026',
      category: 'Dance',
      tags: ['Dance', 'Cup'],
      certificateText: 'Winners get certificate',
      prizePool: 1000,
      entryFee: 79,
      maxParticipants: 30,
      participantCount: 22,
      registrationStartsAt: new Date(now - 20 * 24 * 60 * 60 * 1000),
      registrationEndsAt: new Date(now - 2 * 24 * 60 * 60 * 1000), // Ended 2 days ago
      submissionStartsAt: new Date(now - 1 * 24 * 60 * 60 * 1000),
      submissionEndsAt: new Date(now + 5 * 24 * 60 * 60 * 1000),
      resultDate: new Date(now + 10 * 24 * 60 * 60 * 1000),
      judge: mainCompetition.judge,
      previousWinners: mainCompetition.previousWinners,
      description: 'Registration has officially closed. Entries are currently undergoing submission.',
      judgingParameters: mainCompetition.judgingParameters,
      rules: mainCompetition.rules,
      eligibility: mainCompetition.eligibility,
      rewards: mainCompetition.rewards,
    });

    // C) Results Published Competition
    await Competition.create({
      slug: 'classical-dance-results',
      title: 'Spring Kathak & Bharatanatyam Fest',
      category: 'Dance',
      tags: ['Dance', 'Results Out'],
      certificateText: 'Winners get certificate',
      prizePool: 1500,
      entryFee: 99,
      maxParticipants: 20,
      participantCount: 20,
      registrationStartsAt: new Date(now - 40 * 24 * 60 * 60 * 1000),
      registrationEndsAt: new Date(now - 25 * 24 * 60 * 60 * 1000),
      submissionStartsAt: new Date(now - 24 * 24 * 60 * 60 * 1000),
      submissionEndsAt: new Date(now - 10 * 24 * 60 * 60 * 1000),
      resultDate: new Date(now - 2 * 24 * 60 * 60 * 1000), // Results declared 2 days ago
      judge: mainCompetition.judge,
      previousWinners: mainCompetition.previousWinners,
      description: 'The competition has concluded and official rankings and certificates have been issued.',
      judgingParameters: mainCompetition.judgingParameters,
      rules: mainCompetition.rules,
      eligibility: mainCompetition.eligibility,
      rewards: mainCompetition.rewards,
    });

    console.log(`Successfully seeded main competition "${mainCompetition.title}" (ID: ${mainCompetition._id}) and 3 lifecycle variations.`);
    return { mainCompetition, demoUser };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

module.exports = seedData;

if (require.main === module) {
  require('dotenv').config();
  const { connectDB, disconnectDB } = require('../config/db');

  connectDB()
    .then(async () => {
      await seedData();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
