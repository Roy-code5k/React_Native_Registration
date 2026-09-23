const competitionService = require('../services/competitionService');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const Competition = require('../models/Competition');

exports.getCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user._id : null;

    const data = await competitionService.getCompetitionDetails(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.listCompetitions = async (req, res, next) => {
  try {
    const list = await competitionService.listCompetitions();
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await competitionService.registerUser(id, userId);

    // Fetch the updated full competition details for the client
    const updatedDetails = await competitionService.getCompetitionDetails(id, userId);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Participation spot confirmed.',
      data: {
        registration: result.registration,
        competition: updatedDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.submit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const submissionPayload = req.body;

    const submission = await competitionService.submitEntry(id, userId, submissionPayload);

    // Fetch updated details
    const updatedDetails = await competitionService.getCompetitionDetails(id, userId);

    res.status(201).json({
      success: true,
      message: 'Submission uploaded successfully! Entry will be evaluated by the judge.',
      data: {
        submission,
        competition: updatedDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const submission = await Submission.findOne({
      competitionId: id,
      userId,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SUBMISSION_NOT_FOUND',
          message: 'No submission found for this user in this competition.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Convenience endpoint for testers/reviewers to unregister demo user
 */
exports.resetDemoRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reg = await Registration.findOneAndDelete({
      competitionId: id,
      userId,
    });

    if (reg) {
      await Competition.findByIdAndUpdate(id, {
        $inc: { participantCount: -1 },
      });
    }

    await Submission.findOneAndDelete({
      competitionId: id,
      userId,
    });

    const updatedDetails = await competitionService.getCompetitionDetails(id, userId);

    res.status(200).json({
      success: true,
      message: 'Registration and submission reset for demonstration.',
      data: updatedDetails,
    });
  } catch (error) {
    next(error);
  }
};
