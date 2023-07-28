import { useState } from 'react';
import styled from '@emotion/styled';

// Mui
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

type SubpageTitleProps = {
  title?: string;
  reloading?: boolean;
  refreshFunction?: () => void;
  actions?: any
};

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: space-between;
  .right {
  }
  .left {
  }
`;

const SIconButton = styled(IconButton)`
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

export const SubpageTitle = ({
  title,
  reloading,
  refreshFunction,
  actions,
}: SubpageTitleProps) => {
  const [reloadingLocal, set_reloadingLocal] = useState(false);

  return (
    <Content>
      <div className="right">
        <h2>{title}</h2>
        <div className="actions">
          {actions}
        </div>
      </div>

      <SIconButton
        className={`left${reloading || reloadingLocal ? 'reloading' : ''}`}
        onClick={() => {
          set_reloadingLocal(true);
          refreshFunction && refreshFunction();
          setTimeout(() => {
            set_reloadingLocal(false);
          }, 2000);
        }}
      >
        <RefreshIcon />
      </SIconButton>
    </Content>
  );
};
