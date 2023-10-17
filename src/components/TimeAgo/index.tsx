import {
  formatDateToUserTimezone,
  calculateFutureRelativeTimeInGMT,
  calculatePastRelativeTimeInGMT,
  epochIsInTheFuture,
  isEpochOlderThanADay,
  formatTimeToUserTimezone
} from '../../utils/date';

type TimeAgoProps = { pastEpoch?: number; twoRows?: boolean };
export default function TimeAgo({
  twoRows = false,
  pastEpoch,
}: TimeAgoProps) {
  // return nothing if no past time
  if (!pastEpoch)
    return (
      <>
        -<br />
        &nbsp;
      </>
    );

  // return relative time if pastTime is after now
  if (epochIsInTheFuture(pastEpoch)) return calculateFutureRelativeTimeInGMT(pastEpoch);

  // return relative time if the difference is less than a day
  if (!isEpochOlderThanADay(pastEpoch)) return calculatePastRelativeTimeInGMT(pastEpoch);

  // return formatted time
  return (
    <>
      {formatDateToUserTimezone(pastEpoch)}
      {twoRows ? <br /> : <></>}
      {formatTimeToUserTimezone(pastEpoch)}
    </>
  );
}
