import { useEffect, useState } from 'react';
import { useAppSelector } from '../store';
import { api } from '@hoprnet/hopr-sdk';
import Section from '../future-hopr-lib-components/Section';
import readStreamEvent from '../utils/readStreamEvent';
import { Log } from '../types';

function SectionLogs() {
  const [logs, set_logs] = useState<Log[]>([]);
  const { apiEndpoint, apiToken } = useAppSelector(
    (selector) => selector.auth.loginData
  );

  useEffect(() => {
    if (apiEndpoint && apiToken) {
      const url = api.getWsUrl(
        apiEndpoint,
        '/api/v2/node/stream/websocket',
        apiToken
      );

      const ws = new WebSocket(url);

      ws.onmessage = (e) => {
        const log = readStreamEvent(e);
        if (log) {
          set_logs((prevLogs) => [...prevLogs, log]);
        }
      };

      return () => {
        ws.close();
      };
    } else {
      console.warn('Login to node');
    }
  });

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
        <p key={log.id}>{log.message}</p>
      ))}
    </Section>
  );
}

export default SectionLogs;
