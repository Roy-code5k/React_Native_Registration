const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', competitionController.listCompetitions);
router.get('/:id', optionalAuth, competitionController.getCompetition);
router.post('/:id/register', protect, competitionController.register);
router.post('/:id/submission', protect, competitionController.submit);
router.get('/:id/submission', protect, competitionController.getSubmission);
router.post('/:id/reset-demo', protect, competitionController.resetDemoRegistration);

module.exports = router;
