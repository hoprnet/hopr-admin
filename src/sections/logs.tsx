import { useAppSelector } from '../store';
import LogLine from '../components/LogLine';
import Section from '../future-hopr-lib-components/Section';

function SectionLogs() {
  const { apiEndpoint, apiToken } = useAppSelector(
    (selector) => selector.auth.loginData
  );
  const { logs } = useAppSelector((selector) => selector.node);

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
