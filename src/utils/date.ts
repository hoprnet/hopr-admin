import dayjs from "dayjs";
import { default as utc } from 'dayjs/plugin/utc';
import { default as timezone } from 'dayjs/plugin/timezone';

export const formatDateToUserTimezone = (date: string) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  // guess user timezone;
  const userTimezone = dayjs.tz.guess();
  const formattedDate = dayjs(date).tz(userTimezone).format('YYYY-MM-DD');
  return formattedDate;
};

export const calculateTimeInGMT = (date: string) => {
  dayjs.extend(utc);
  const timeInGMT = `${dayjs(date).utc().format('YYYY-MM-DD HH:MM')} GMT ${dayjs(date).utc().format('Z')}`;
  return timeInGMT;
};