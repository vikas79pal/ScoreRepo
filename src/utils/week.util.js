'use strict';

const moment = require('moment');

// weeks runs from Friday to Thursday

const getEpochStart = (firstDate) => {
  const d = moment.utc(firstDate).startOf('day');
  const day = d.day(); 
  const daysBack = day >= 5 ? day - 5 : day + 2;
  return d.subtract(daysBack, 'days');
};

const getWeekNumber = (date, epoch) => {
  const diffDays = moment.utc(date).startOf('day').diff(epoch, 'days');
  if (diffDays < 0) return 0;
  return Math.floor(diffDays / 7) + 1;
};


const getWeekRange = (weekNo, epoch) => {
  const start = epoch.clone().add((weekNo - 1) * 7, 'days');
  const end   = start.clone().add(6, 'days').endOf('day');
  return { start, end };
};

module.exports = { getEpochStart, getWeekNumber, getWeekRange };
