const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    experience: { type: String, required: true },
    image: { type: String, required: true },
    introVideo: { type: String, default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  },
  { _id: false }
);

const previousWinnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String, default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  },
  { _id: false }
);

const judgingParameterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const rewardSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    icon: { type: String, default: 'star' },
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Dance',
    },
    tags: [{ type: String }],
    certificateText: {
      type: String,
      default: 'Winners get certificate',
    },
    prizePool: {
      type: Number,
      required: true,
      min: [0, 'Prize pool must be non-negative'],
    },
    entryFee: {
      type: Number,
      required: true,
      min: [0, 'Entry fee must be non-negative'],
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: [1, 'Maximum participants must be at least 1'],
    },
    participantCount: {
      type: Number,
      default: 0,
      min: [0, 'Participant count cannot be negative'],
    },
    registrationStartsAt: {
      type: Date,
      required: true,
    },
    registrationEndsAt: {
      type: Date,
      required: true,
    },
    submissionStartsAt: {
      type: Date,
      required: true,
    },
    submissionEndsAt: {
      type: Date,
      required: true,
    },
    resultDate: {
      type: Date,
      required: true,
    },
    judge: {
      type: judgeSchema,
      required: true,
    },
    previousWinners: [previousWinnerSchema],
    description: {
      type: String,
      required: true,
    },
    judgingParameters: [judgingParameterSchema],
    rules: [{ type: String }],
    eligibility: [{ type: String }],
    rewards: [rewardSchema],
    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED'],
      default: 'ACTIVE',
    },
    meta: {
      referralBonus: { type: Number, default: 10 },
      disclaimer: {
        type: String,
        default: 'Only contributions from paid participants will be considered for judging.',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for remaining spots
competitionSchema.virtual('spotsRemaining').get(function () {
  return Math.max(0, this.maxParticipants - this.participantCount);
});

// Helper method to compute lifecycle state based on current time
competitionSchema.methods.getLifecycleState = function (atTime = new Date()) {
  if (this.status === 'CANCELLED') return 'CANCELLED';

  const now = atTime.getTime();
  const regStart = new Date(this.registrationStartsAt).getTime();
  const regEnd = new Date(this.registrationEndsAt).getTime();
  const subStart = new Date(this.submissionStartsAt).getTime();
  const subEnd = new Date(this.submissionEndsAt).getTime();
  const resDate = new Date(this.resultDate).getTime();

  if (now < regStart) {
    return 'UPCOMING';
  }
  if (now >= resDate) {
    return 'RESULT_PUBLISHED';
  }
  if (now > subEnd && now < resDate) {
    return 'JUDGING';
  }
  if (now <= regEnd) {
    if (this.participantCount >= this.maxParticipants) {
      return 'FULL';
    }
    return 'REGISTRATION_OPEN';
  }
  if (now >= subStart && now <= subEnd) {
    return 'SUBMISSION_OPEN';
  }

  return 'REGISTRATION_CLOSED';
};

module.exports = mongoose.model('Competition', competitionSchema);
