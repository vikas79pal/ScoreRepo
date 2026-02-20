'use strict';

const router = require('express').Router();
const { saveScore, getScoreCard, weeklyDashboard } = require('../controllers/score.controller');
const { saveScoreSchema }                          = require('../validators/score.validator');
const { validate }                                 = require('../middleware/validate.middleware');
const { authenticate }                             = require('../middleware/auth.middleware');

router.use(authenticate);

router.post('/save',   validate(saveScoreSchema), saveScore);
router.get('/card',    getScoreCard);
router.get('/weekly',  weeklyDashboard);

module.exports = router;
