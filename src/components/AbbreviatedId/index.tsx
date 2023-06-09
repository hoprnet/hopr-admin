import { useState } from 'react';
import styled from '@emotion/styled';

const LogId = styled.span`
  cursor: pointer;
  font-weight: bold;
`;

const AbbrLogId = LogId.withComponent('abbr');

type AbbreviatedIdProps = {
  id: string;
};

const AbbreviatedId = ({ id }: AbbreviatedIdProps) => {
  const [isExpanded, set_isExpanded] = useState(false);

  const handleClick = () => {
    set_isExpanded(!isExpanded);
  };

  if (isExpanded) {
    return <LogId onClick={handleClick}>{id}</LogId>;
  }

  return (
    <AbbrLogId title={id} onClick={handleClick}>
      {id.slice(48)}
    </AbbrLogId>
  );
};

export default AbbreviatedId;
