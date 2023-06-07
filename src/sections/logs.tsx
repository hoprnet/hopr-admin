import { useEffect, useState } from 'react';
import { useAppSelector } from '../store';
import { utils } from '@hoprnet/hopr-sdk';
import Section from '../future-hopr-lib-components/Section';
import readStreamEvent from '../utils/readStreamEvent';
import { Log } from '../types';
import LogLine from '../components/LogLine';

function SectionLogs() {
  const [logs, set_logs] = useState<Log[]>([]);
  const { apiEndpoint, apiToken } = useAppSelector(
    (selector) => selector.auth.loginData
  );

  // TODO: decodeMessage & path on next SDK update.
  useEffect(() => {
    if (apiEndpoint && apiToken) {
      console.log('Mounting component');
      const ws = new utils.WebsocketHelper({
        apiEndpoint,
        apiToken,
        decodeMessage: false,
        path: '/api/v2/node/stream/websocket/',
        onOpen() {
          console.log('ws connection open');
        },
        onMessage(data) {
          const log = readStreamEvent(data);
          if (log) {
            set_logs((prevLogs) => [...prevLogs, log]);
          }
        },
      });
      return () => {
        console.log('ws closed');
        ws.close();
      };
    }
  }, []);

  if (!apiEndpoint || !apiToken) {
    return (
      <Section className="Section--logs" id="Section--logs" yellow>
        Login to node to see logs
      </Section>
    );
  }

  return (
    <Section className="Section--logs" id="Section--logs" yellow>
      {logs.map((log) => (
        <LogLine log={log} key={log.id} />
      ))}
    </Section>
  );
}

export default SectionLogs;
