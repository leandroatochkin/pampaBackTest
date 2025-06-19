//this file sets the cutoff time of each day's registry
import dayjs from 'dayjs';

export function getCurrentOperationLogDate() {
  const now = dayjs();

  const startOfDay = now.set('hour', 0).set('minute', 1).set('second', 0).set('millisecond', 0);
  const endOfDay = now.set('hour', 18).set('minute', 0).set('second', 0).set('millisecond', 0);

  if (now.isBefore(startOfDay)) {
    // before 00:01 → use **yesterday**
    return now.subtract(1, 'day').format('YYYYMMDD');
  } else if (now.isAfter(endOfDay)) {
    // after 18:00 → use **next day**
    return now.add(1, 'day').format('YYYYMMDD');
  } else {
    // between 00:01 and 18:00 → use **today**
    return now.format('YYYYMMDD');
  }
}
