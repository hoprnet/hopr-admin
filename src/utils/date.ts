import dayjs from 'dayjs';
import { default as utc } from 'dayjs/plugin/utc';
import { default as timezone } from 'dayjs/plugin/timezone';
import { default as relativeTime } from 'dayjs/plugin/relativeTime';

export const formatDateToUserTimezone = (date: string | number) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  // guess user timezone;
  const userTimezone = dayjs.tz.guess();
  const formattedDate = dayjs(date).tz(userTimezone).format('YYYY-MM-DD');
  return formattedDate;
};

export const formatTimeToUserTimezone = (date: string | number) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  // guess user timezone;
  const userTimezone = dayjs.tz.guess();
  const formattedDate = dayjs(date).tz(userTimezone).format('HH:mm');
  return formattedDate;
};

export const calculateTimeInGMT = (date: string | number) => {
  dayjs.extend(utc);
  const timeInGMT = `${dayjs(date).utc().format('YYYY-MM-DD HH:mm')} GMT ${dayjs(date).utc().format('Z')}`;
  return timeInGMT;
};

export const epochIsInTheFuture = (epoch: number) => {
  dayjs.extend(utc);
  return dayjs(epoch).isAfter(dayjs());
};

export const calculatePastRelativeTimeInGMT = (epoch: number): string => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  return dayjs().utc().to(dayjs(epoch));
};

export const calculateFutureRelativeTimeInGMT = (epoch: number): string => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  return dayjs().utc().from(dayjs(epoch));
};

export const isEpochOlderThanADay = (epoch: number): boolean => {
  dayjs.extend(utc);
  const dayAgo = dayjs(epoch).utc().subtract(1, 'day');
  return dayAgo.isAfter(dayjs(epoch));
};
