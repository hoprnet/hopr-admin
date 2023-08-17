import styled from '@emotion/styled'
import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';

interface Props extends TooltipProps {
    notWide?: boolean
}

const Tooltip: React.FC<Props> = (props) => {
  return (
    <MuiTooltip 
        classes={{ popper: `STooltip ${props.className} ${props.notWide ? 'notWide' : ''}` }}
        {...props}
    />
  );
};

export default Tooltip;
