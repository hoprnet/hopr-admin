// HOPR Components
import LogLine from '../../components/LogLine';
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';

// Mui
import { Paper } from '@mui/material';

function SectionLogs() {
  return (
    <Section
      className="Section--logs"
      id="Section--logs"
      fullHeightMin
      yellow
    >
      <SubpageTitle title="LOGS" />
      <Paper
        style={{
          padding: '24px',
          width: 'calc( 100% - 48px )',
        }}
      >
        <LogLine
          log={{
            id: '',
            message: '',
            timestamp: 0,
          }}
          key={'test-log'}
        />
      </Paper>
    </Section>
  );
}

export default SectionLogs;
