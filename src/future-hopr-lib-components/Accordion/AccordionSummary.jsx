import MuiAccordionSummary from '@mui/material/AccordionSummary';
import styled from '@emotion/styled';

const AccordionSummary = styled(MuiAccordionSummary)`
  padding-left: 0;
  border-bottom: 1px solid darkgray;
  height: 50px;
  &.Mui-expanded {
    margin: 0;
    min-height: unset;
  }
`;

export default AccordionSummary;
