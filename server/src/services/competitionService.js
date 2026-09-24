const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');

class CompetitionService {
  /**
   * Fetch competition with computed user state and lifecycle
   */
  async getCompetitionDetails(idOrSlug, userId = null, lang = 'en') {
    let competition;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      competition = await Competition.findById(idOrSlug);
    }
    if (!competition) {
      competition = await Competition.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!competition) {
      const err = new Error('Competition not found');
      err.statusCode = 404;
      err.code = 'COMPETITION_NOT_FOUND';
      throw err;
    }

    const atTime = new Date();
    const lifecycleState = competition.getLifecycleState(atTime);
    const spotsRemaining = Math.max(0, competition.maxParticipants - competition.participantCount);

    let isRegistered = false;
    let registrationData = null;
    let submissionData = null;
    let submissionStatus = 'NOT_SUBMITTED';

    if (userId) {
      registrationData = await Registration.findOne({
        competitionId: competition._id,
        userId: userId,
        status: 'CONFIRMED',
      });
      isRegistered = !!registrationData;

      submissionData = await Submission.findOne({
        competitionId: competition._id,
        userId: userId,
      });

      if (submissionData) {
        submissionStatus = submissionData.status;
      }
    }

    // Determine allowed actions
    const nowTime = atTime.getTime();
    const subWindowOpen =
      nowTime >= new Date(competition.submissionStartsAt).getTime() &&
      nowTime <= new Date(competition.submissionEndsAt).getTime();

    const canRegister =
      !isRegistered &&
      lifecycleState === 'REGISTRATION_OPEN' &&
      spotsRemaining > 0;

    const canSubmit =
      isRegistered &&
      subWindowOpen &&
      submissionStatus === 'NOT_SUBMITTED';

    const isHi = (lang || '').toLowerCase().startsWith('hi');
    const hi = isHi ? competition.translations?.hi : null;

    const title = hi?.title || competition.title;
    const category = hi?.category || competition.category;
    const certificateText = hi?.certificateText || competition.certificateText;
    const description = hi?.description || competition.description;
    const rules = hi?.rules && hi.rules.length > 0 ? hi.rules : competition.rules;
    const eligibility = hi?.eligibility && hi.eligibility.length > 0 ? hi.eligibility : competition.eligibility;

    let judge = competition.judge;
    if (hi?.judge) {
      judge = {
        name: hi.judge.name || competition.judge.name,
        designation: hi.judge.designation || competition.judge.designation,
        experience: hi.judge.experience || competition.judge.experience,
        image: competition.judge.image,
        introVideo: competition.judge.introVideo,
      };
    }

    let judgingParameters = competition.judgingParameters;
    if (hi?.judgingParameters && hi.judgingParameters.length > 0) {
      judgingParameters = competition.judgingParameters.map((param, idx) => {
        const hiParam = hi.judgingParameters[idx];
        return {
          name: hiParam?.name || param.name,
          weight: param.weight,
          description: hiParam?.description || param.description,
        };
      });
    }

    let rewards = competition.rewards;
    if (hi?.rewards && hi.rewards.length > 0) {
      rewards = competition.rewards.map((rew, idx) => {
        const hiRew = hi.rewards.find((r) => r.position === rew.position) || hi.rewards[idx];
        return {
          position: rew.position,
          title: hiRew?.title || rew.title,
          amount: rew.amount,
          icon: rew.icon,
        };
      });
    }

    return {
      id: competition._id,
      slug: competition.slug,
      title,
      category,
      tags: competition.tags,
      certificateText,
      prizePool: competition.prizePool,
      entryFee: competition.entryFee,
      lang: isHi ? 'hi' : 'en',
      participants: {
        current: competition.participantCount,
        maximum: competition.maxParticipants,
        remaining: spotsRemaining,
      },
      lifecycle: {
        state: lifecycleState,
        registrationStartsAt: competition.registrationStartsAt,
        registrationEndsAt: competition.registrationEndsAt,
        submissionStartsAt: competition.submissionStartsAt,
        submissionEndsAt: competition.submissionEndsAt,
        resultDate: competition.resultDate,
      },
      judge,
      previousWinners: competition.previousWinners,
      description,
      judgingParameters,
      rules,
      eligibility,
      rewards,
      meta: competition.meta,
      userState: {
        isAuthenticated: !!userId,
        isRegistered,
        registeredAt: registrationData ? registrationData.registeredAt : null,
        submissionStatus,
        submission: submissionData || null,
      },
      actions: {
        canRegister,
        canSubmit,
        reason: !canRegister && !isRegistered
          ? (spotsRemaining === 0 ? 'COMPETITION_FULL' : lifecycleState)
          : null,
      },
    };
  }

  /**
   * Concurrency-safe atomic registration
   */
  async registerUser(competitionId, userId) {
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      const err = new Error('Invalid competition ID');
      err.statusCode = 400;
      err.code = 'INVALID_ID';
      throw err;
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      const err = new Error('Competition not found');
      err.statusCode = 404;
      err.code = 'COMPETITION_NOT_FOUND';
      throw err;
    }

    // Check lifecycle
    const lifecycleState = competition.getLifecycleState();
    if (lifecycleState === 'UPCOMING') {
      const err = new Error('Registration for this competition has not started yet.');
      err.statusCode = 400;
      err.code = 'REGISTRATION_NOT_STARTED';
      throw err;
    }
    if (lifecycleState !== 'REGISTRATION_OPEN' && lifecycleState !== 'FULL') {
      const err = new Error('Registration is closed for this competition.');
      err.statusCode = 400;
      err.code = 'REGISTRATION_CLOSED';
      throw err;
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      competitionId,
      userId,
    });

    if (existingRegistration) {
      const err = new Error('You are already registered for this competition.');
      err.statusCode = 409;
      err.code = 'ALREADY_REGISTERED';
      throw err;
    }

    // Atomic capacity increment guarded by maxParticipants condition
    const updatedComp = await Competition.findOneAndUpdate(
      {
        _id: competitionId,
        participantCount: { $lt: competition.maxParticipants },
      },
      {
        $inc: { participantCount: 1 },
      },
      {
        new: true,
      }
    );

    if (!updatedComp) {
      const err = new Error('All participation spots have been filled.');
      err.statusCode = 409;
      err.code = 'COMPETITION_FULL';
      throw err;
    }

    // Attempt creating the registration record
    try {
      const registration = await Registration.create({
        competitionId,
        userId,
        amountPaid: competition.entryFee,
        paymentStatus: competition.entryFee === 0 ? 'FREE' : 'PAID',
        status: 'CONFIRMED',
      });

      return {
        registration,
        spotsRemaining: Math.max(0, updatedComp.maxParticipants - updatedComp.participantCount),
        participantCount: updatedComp.participantCount,
      };
    } catch (createErr) {
      // If creating registration fails (e.g. duplicate race condition on unique index), roll back spot increment
      await Competition.findByIdAndUpdate(competitionId, {
        $inc: { participantCount: -1 },
      });

      if (createErr.code === 11000) {
        const err = new Error('You are already registered for this competition.');
        err.statusCode = 409;
        err.code = 'ALREADY_REGISTERED';
        throw err;
      }

      throw createErr;
    }
  }

  /**
   * Submit participant entry
   */
  async submitEntry(competitionId, userId, submissionPayload) {
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      const err = new Error('Invalid competition ID');
      err.statusCode = 400;
      err.code = 'INVALID_ID';
      throw err;
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      const err = new Error('Competition not found');
      err.statusCode = 404;
      err.code = 'COMPETITION_NOT_FOUND';
      throw err;
    }

    // Check if user is registered
    const registration = await Registration.findOne({
      competitionId,
      userId,
      status: 'CONFIRMED',
    });

    if (!registration) {
      const err = new Error('You must be a registered participant to submit an entry.');
      err.statusCode = 403;
      err.code = 'NOT_REGISTERED';
      throw err;
    }

    // Check submission window
    const now = new Date().getTime();
    const subStart = new Date(competition.submissionStartsAt).getTime();
    const subEnd = new Date(competition.submissionEndsAt).getTime();

    if (now < subStart) {
      const err = new Error('Submission window has not opened yet.');
      err.statusCode = 400;
      err.code = 'SUBMISSION_NOT_STARTED';
      throw err;
    }

    if (now > subEnd) {
      const err = new Error('Submission deadline has passed.');
      err.statusCode = 400;
      err.code = 'SUBMISSION_CLOSED';
      throw err;
    }

    // Check if user has already submitted
    const existingSubmission = await Submission.findOne({
      competitionId,
      userId,
    });

    if (existingSubmission) {
      const err = new Error('You have already submitted your entry for this competition.');
      err.statusCode = 409;
      err.code = 'ALREADY_SUBMITTED';
      throw err;
    }

    const submission = await Submission.create({
      competitionId,
      userId,
      mediaUrl: submissionPayload.mediaUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: submissionPayload.thumbnailUrl || '',
      title: submissionPayload.title || `${competition.title} Submission`,
      caption: submissionPayload.caption || '',
      fileName: submissionPayload.fileName || 'dance_submission.mp4',
      fileSize: submissionPayload.fileSize || 12450000,
      mimeType: submissionPayload.mimeType || 'video/mp4',
      status: 'SUBMITTED',
    });

    return submission;
  }

  /**
   * List all competitions (for switching / browsing)
   */
  async listCompetitions(lang = 'en') {
    const isHi = (lang || '').toLowerCase().startsWith('hi');
    const comps = await Competition.find().sort({ createdAt: -1 });
    return comps.map((c) => {
      const hi = isHi ? c.translations?.hi : null;
      return {
        id: c._id,
        slug: c.slug,
        title: hi?.title || c.title,
        category: hi?.category || c.category,
        lifecycle: c.getLifecycleState(),
        spotsRemaining: Math.max(0, c.maxParticipants - c.participantCount),
        participantCount: c.participantCount,
        maxParticipants: c.maxParticipants,
        entryFee: c.entryFee,
        prizePool: c.prizePool,
      };
    });
  }
}

module.exports = new CompetitionService();
