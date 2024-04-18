import styled from '@emotion/styled';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '../Tooltip/tooltip-fixed-width';


const SIconButton = styled(IconButton)`
    width: 24px;
    height: 24px;
    svg {
        width: 18px;
        height: 18px;
    }
`;

interface SmallActionButtonProps extends IconButtonProps {
    tooltip: string;
}


function SmallActionButton(props: SmallActionButtonProps) {
    return (
        <Tooltip
            title={props.tooltip}
        >
            <span>
                <SIconButton
                    {...props}
                >
                    {props.children}
                </SIconButton>
            </span>
        </Tooltip>
    )
}

export default SmallActionButton;