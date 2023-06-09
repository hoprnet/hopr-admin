import styled from '@emotion/styled';
import type { Log } from '../../types';
import AbbreviatedId from '../AbbreviatedId';
import Jazzicon from '../JazzIcon';

const LogLineContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
`;

const Time = styled.time`
  display: block;
  font-size: 0.75rem;
  opacity: 0.3;
  text-align: right;
  align-self: flex-start;
`;

const Pre = styled.pre`
  margin: 0;
  padding-bottom: 0.5rem;
  white-space: break-spaces;
  display: flex;
  gap: 0.5rem;
`;

type LogLineProps = {
  log: Log;
};

const regex = /(\b\w{53})\b/g;

const LogLine = ({ log }: LogLineProps) => {
  const timestamp = new Date(log.timestamp).toISOString().slice(11);
  const peerId = log.message.match(regex)?.[0];

  return (
    <LogLineContainer>
      <Pre>
        {peerId ? (
          <>
            <Jazzicon address={peerId} diameter={16} />
            <div>
              {log.message.replace(peerId, '')}
              <AbbreviatedId id={peerId} />
            </div>
          </>
        ) : (
          log.message
        )}
      </Pre>
      <Time>{timestamp}</Time>
    </LogLineContainer>
  );
};

export default LogLine;
