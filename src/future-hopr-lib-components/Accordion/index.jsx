import MuiAccordion from '@mui/material/Accordion';
import styled from '@emotion/styled';

const Accordion = styled(MuiAccordion)`
  background-color: transparent;
  box-shadow: none;
  width: 100%;
  &.Mui-expanded {
    margin: 0;
  }
  &:before {
    content: unset;
  }
`;

export default Accordion;
