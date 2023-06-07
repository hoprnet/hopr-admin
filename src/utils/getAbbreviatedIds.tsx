import type { Log } from '../types';
import AbbreviatedId from '../components/AbbreviatedId';

const getAbbreviatedIds = (log: Log, regex: RegExp) => {
  const textArray = log.message.split(regex);
  let peerIdsFound = 0;

  return textArray.map((item) => {
    if (regex.test(item)) {
      return [
        item,
        <AbbreviatedId id={item} key={`${log.id}-${++peerIdsFound}`} />,
      ];
    } else {
      return [item, undefined];
    }
  });
};

export default getAbbreviatedIds;
