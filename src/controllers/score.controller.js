'use strict';

const path    = require('path');
const moment  = require('moment');
const { Op, fn, col, literal } = require('sequelize');
const { Score }                = require('../models');
const { generateScoreCard }    = require('../utils/scoreCard.util');
const { getWeekNumber, getWeekRange } = require('../utils/week.util');

const saveScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const score  = parseInt(req.body.score, 10);

    const dailyCount = await Score.count({
      where: {
        userId,
        playedAt: {
          [Op.between]: [
            moment.utc().startOf('day').toDate(),
            moment.utc().endOf('day').toDate(),
          ],
        },
      },
    });

    if (dailyCount >= 3) {
      return res.status(429).json({
        success: false,
        message: 'You have reached the maximum of 3 score submissions for today.',
      });
    }

    await Score.create({ userId, score });

    return res.status(201).json({ success: true, message: 'Score saved successfully.' });
  } catch (err) {
    console.error('[saveScore]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getScoreCard = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalScore = (await Score.sum('score', { where: { userId } })) || 0;

    // rank = number of users with a strictly higher total + 1
    const higherRanked = await Score.findAll({
      attributes: ['userId'],
      group:      ['userId'],
      having:     literal(`SUM(score) > ${totalScore}`),
      raw:        true,
    });
    const rank = higherRanked.length + 1;

    const filename   = `scorecard_${userId}_${Date.now()}.jpg`;
    const outputPath = path.join(
      process.cwd(),
      process.env.SCORE_CARD_DIR || 'uploads/score_cards',
      filename,
    );

    await generateScoreCard({ name: req.user.name, rank, totalScore, outputPath });

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/score_cards/${filename}`;

    return res.status(200).json({ success: true, imageUrl });
  } catch (err) {
    console.error('[getScoreCard]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const weeklyDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const scoreRows = await Score.findAll({
      where:  { userId },
      order:  [['playedAt', 'ASC']],
      raw:    true,
    });

    if (scoreRows.length === 0) {
      return res.status(200).json({ success: true, weeks: [] });
    }

    // aggregate total score per week
    const weekMap = {};
    for (const row of scoreRows) {
      const weekNo = getWeekNumber(row.playedAt);
      if (weekNo > 0) {
        weekMap[weekNo] = (weekMap[weekNo] || 0) + row.score;
      }
    }

    const weeks = [];
    for (const [weekNoStr, userTotal] of Object.entries(weekMap)) {
      const weekNo = parseInt(weekNoStr, 10);
      const { start, end } = getWeekRange(weekNo);

      const higherRanked = await Score.findAll({
        attributes: ['userId'],
        where: {
          playedAt: { [Op.between]: [start.toDate(), end.toDate()] },
        },
        group:  ['userId'],
        having: literal(`SUM(score) > ${userTotal}`),
        raw:    true,
      });

      weeks.push({
        weekNo,
        rank:       higherRanked.length + 1,
        totalScore: userTotal,
      });
    }

    weeks.sort((a, b) => a.weekNo - b.weekNo);

    return res.status(200).json({ success: true, weeks });
  } catch (err) {
    console.error('[weeklyDashboard]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { saveScore, getScoreCard, weeklyDashboard };
