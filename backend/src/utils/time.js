function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function addMinutes(time, minutes) {
  return minutesToTime(timeToMinutes(time) + minutes);
}

function isTimeInsideSchedule(startTime, endTime, schedule) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const scheduleStart = timeToMinutes(schedule.startTime);
  const scheduleEnd = timeToMinutes(schedule.endTime);

  if (!(start >= scheduleStart && end <= scheduleEnd && start < end)) {
    return false;
  }

  if (schedule.breakStartTime && schedule.breakEndTime) {
    const breakStart = timeToMinutes(schedule.breakStartTime);
    const breakEnd = timeToMinutes(schedule.breakEndTime);
    if (hasOverlap(startTime, endTime, schedule.breakStartTime, schedule.breakEndTime)) {
      return false;
    }
    if (breakStart >= breakEnd || breakStart < scheduleStart || breakEnd > scheduleEnd) {
      return false;
    }
  }

  return true;
}

function hasOverlap(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}

module.exports = {
  timeToMinutes,
  minutesToTime,
  addMinutes,
  isTimeInsideSchedule,
  hasOverlap
};
