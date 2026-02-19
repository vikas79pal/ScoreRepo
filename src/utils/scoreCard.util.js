'use strict';

const { createCanvas } = require('canvas');
const path   = require('path');
const fs     = require('fs');
const moment = require('moment');

const generateScoreCard = async ({ name, rank, totalScore, outputPath }) => {
  const W = parseInt(process.env.SCORE_CARD_WIDTH  || '1280', 10);
  const H = parseInt(process.env.SCORE_CARD_HEIGHT || '720',  10);

  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');

  // left panel – black background with rank number
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W / 2, H);

  ctx.fillStyle    = '#FFFFFF';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.font         = `bold ${Math.floor(H * 0.55)}px Arial`;
  ctx.fillText(String(rank), W / 4, H / 2);

  // right panel – white background with score details
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(W / 2, 0, W / 2, H);

  const cx = W / 2 + W / 4;

  ctx.fillStyle    = '#000000';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font         = `bold ${Math.floor(H * 0.075)}px Arial`;
  ctx.fillText('Score Card', cx, H * 0.30);

  ctx.fillStyle = '#7B2FBE';
  ctx.font      = `bold ${Math.floor(H * 0.065)}px Arial`;
  ctx.fillText(name, cx, H * 0.46);

  ctx.fillStyle = '#333333';
  ctx.font      = `${Math.floor(H * 0.045)}px Arial`;
  ctx.fillText(`Score: ${totalScore}`, cx, H * 0.60);
  ctx.fillText(`Date: ${moment().format('Do MMMM YY')}`, cx, H * 0.70);

  // divider
  ctx.strokeStyle = '#CCCCCC';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, canvas.toBuffer('image/jpeg', { quality: 0.95 }));
};

module.exports = { generateScoreCard };
