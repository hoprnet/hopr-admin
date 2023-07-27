import { useState } from 'react';
import styled from '@emotion/styled'

// Mui
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

type SubpageTitleProps = {
    title?: string;
    reloading?: boolean;
    refreshFunction?: () => void;
};

const Content = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
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
}: SubpageTitleProps) => {
  const [reloadingLocal, set_reloadingLocal] = useState(false);

  return (
    <Content>
      <h2>
        {title}
      </h2>
      <SIconButton
        className={`${(reloading || reloadingLocal) ? 'reloading' : ''}`}
        onClick={()=>{
            set_reloadingLocal(true);
            refreshFunction && refreshFunction();
            setTimeout(()=>{set_reloadingLocal(false)}, 2000);
        }}
      >
        <RefreshIcon/>
      </SIconButton>
    </Content>
  );
};
