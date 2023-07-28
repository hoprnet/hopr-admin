import { useAppSelector } from '../store';

// HOPR Components
import LogLine from '../components/LogLine';
import Section from '../future-hopr-lib-components/Section';
import { SubpageTitle } from '../components/SubpageTitle';

function SectionLogs() {
  const { logs } = useAppSelector((selector) => selector.node);

  return (
    <Section
      className="Section--logs"
      id="Section--logs"
      yellow
      fullHeightMin
    >
      <SubpageTitle
        title="Logs"
      />
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
