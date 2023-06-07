import type { Log } from '../../types';
import getAbbreviatedIds from '../../utils/getAbbreviatedIds';
import Jazzicon from '../JazzIcon';
import { LogLineContainer, LogLineIcons, Pre, Time } from './styled';

type LogLineProps = {
  log: Log;
};

const PEERID_REGEXP = /(\b\w{53})\b/g; // NB: Cannot be global variable, has state!

const LogLine = ({ log }: LogLineProps) => {
  const lines = getAbbreviatedIds(log, PEERID_REGEXP);
  const ids = lines.filter(([, elem]) => !!elem).map(([str]) => str);
  const output = lines.map(([str, elem]) => elem || str);

  return (
    <LogLineContainer key={log.id}>
      <Time>{new Date(log.timestamp).toISOString().slice(11)}</Time>
      <Pre>{output}</Pre>
      <LogLineIcons>
        {ids.slice(0, 1).map((x) => (
          // TODO: refactor this x and types.
          <Jazzicon key={x as string} diameter={15} address={x as string} />
        ))}
        &nbsp;
      </LogLineIcons>
    </LogLineContainer>
  );
};

export default LogLine;
