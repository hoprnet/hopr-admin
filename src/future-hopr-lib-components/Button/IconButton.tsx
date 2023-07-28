import styled from '@emotion/styled';

// Mui
import { Tooltip, IconButton as MuiIconButton } from '@mui/material';

type SubpageTitleProps = {
  reloading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  iconComponent?: any;
  tooltipText?: string;
  className?: string;
  style?: Object;
};

const SIconButton = styled(MuiIconButton)`
  svg {
    color: #04049f;
  }
  &.Mui-disabled {
    svg {
      background-color: transparent;
      color: rgba(0, 0, 0, 0.26);
    }
  }
  &.reloading {
    animation: rotation 2s infinite linear;
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1turn);
    }
  }
`;

export const IconButton = ({
  reloading,
  tooltipText,
  className,
  style,
  onClick,
  iconComponent,
  disabled,
}: SubpageTitleProps) => {
  return (
    <Tooltip
      title={tooltipText}
      className={className}
      style={style}
    >
      <SIconButton
        disabled={disabled}
        className={`${reloading ? 'reloading' : ''}`}
        onClick={onClick}
      >
        {iconComponent}
      </SIconButton>
    </Tooltip>
  );
};

export default IconButton;
