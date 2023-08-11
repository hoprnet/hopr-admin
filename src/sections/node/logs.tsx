import { useAppSelector } from '../../store';

// HOPR Components
import LogLine from '../../components/LogLine';
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';

function SectionLogs() {
  const { logs } = useAppSelector((store) => store.node);

  return (
    <Section
      className="Section--logs"
      id="Section--logs"
      fullHeightMin
    >
      <SubpageTitle title="LOGS" />
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
