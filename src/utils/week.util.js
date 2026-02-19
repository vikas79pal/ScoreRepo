'use strict';

const moment = require('moment');

// weeks run Friday → Thursday; week 1 started on 6 Feb 2025
const EPOCH_START = moment.utc('2025-02-06', 'YYYY-MM-DD').startOf('day');

const getWeekNumber = (date) => {
  const diffDays = moment.utc(date).startOf('day').diff(EPOCH_START, 'days');
  if (diffDays < 0) return 0;
  return Math.floor(diffDays / 7) + 1;
};

const getWeekRange = (weekNo) => {
  const start = EPOCH_START.clone().add((weekNo - 1) * 7, 'days');
  const end   = start.clone().add(6, 'days').endOf('day');
  return { start, end };
};

module.exports = { getWeekNumber, getWeekRange, EPOCH_START };
