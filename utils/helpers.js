function daysBetweenInclusive(start, end) {
  const oneDay = 24 * 60 * 60 * 1000;
  const s = new Date(start); s.setHours(0,0,0,0);
  const e = new Date(end); e.setHours(0,0,0,0);
  return Math.round((e - s) / oneDay) + 1;
}

module.exports = { daysBetweenInclusive };
