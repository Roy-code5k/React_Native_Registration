const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'FREE', 'PENDING', 'REFUNDED'],
      default: 'PAID',
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentId: {
      type: String,
      default: () => `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee one registration per user per competition
registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
