import { useAppSelector } from '../store';
import LogLine from '../components/LogLine';
import Section from '../future-hopr-lib-components/Section';

function SectionLogs() {
  const { logs } = useAppSelector((selector) => selector.node);

  return (
    <Section
      className="Section--logs"
      id="Section--logs"
      yellow
    >
      {logs.map((log) => (
        <LogLine
          log={log}
          key={log.id}
        />
      ))}
    </Section>
  );
}

export default SectionLogs;
