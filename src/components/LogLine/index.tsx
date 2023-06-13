import styled from '@emotion/styled';
import type { Log } from '../../types';
import AbbreviatedPeerId from '../AbbreviatedPeerId';
import JazzIcon from '../../future-hopr-lib-components/JazzIcon';

const LogLineContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  width: 100%;
`;

const Time = styled.time`
  align-self: flex-start;
  display: block;
  font-size: 0.75rem;
  opacity: 0.3;
  text-align: right;
`;

const Pre = styled.pre`
  display: flex;
  gap: 0.5rem;
  margin: 0;
  padding-bottom: 0.5rem;
  white-space: break-spaces;
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
            <JazzIcon address={peerId} diameter={16} />
            <div>
              {log.message.replace(peerId, '')}
              <AbbreviatedPeerId id={peerId} />
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
