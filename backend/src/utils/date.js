function toDateOnly(value) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function todayDateOnly() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = { toDateOnly, todayDateOnly };
