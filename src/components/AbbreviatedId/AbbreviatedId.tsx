import { useState } from 'react';
import { LogId, LogIdAbbr } from './styled';

type AbbreviatedIdProps = {
  id: string;
};

const AbbreviatedId = ({ id }: AbbreviatedIdProps) => {
  let [expanded, setExpanded] = useState(false);

  if (expanded) {
    return <LogId>{id}</LogId>;
  }
  return (
    <LogIdAbbr title={id} onClick={() => setExpanded(true)}>
      {id.slice(48)}
    </LogIdAbbr>
  );
};

export default AbbreviatedId;
