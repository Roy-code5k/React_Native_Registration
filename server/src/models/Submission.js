const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
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
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      trim: true,
      default: 'Classical Dance Entry',
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    fileName: {
      type: String,
      default: 'dance_submission.mp4',
    },
    fileSize: {
      type: Number,
      default: 15420000, // ~15MB
    },
    mimeType: {
      type: String,
      default: 'video/mp4',
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'],
      default: 'SUBMITTED',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One submission per participant per competition
submissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
