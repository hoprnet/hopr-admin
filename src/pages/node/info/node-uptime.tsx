import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../../store';
import { Link } from 'react-router-dom';
import { copyStringToClipboard } from '../../../utils/functions';
import { formatEther } from 'viem';

// Mui
import { Paper } from '@mui/material';

// HOPR Components
import Section from '../../../future-hopr-lib-components/Section';
import { actionsAsync } from '../../../store/slices/node/actionsAsync';
import { TableExtended } from '../../../future-hopr-lib-components/Table/columed-data';
import { SubpageTitle } from '../../../components/SubpageTitle';
import Tooltip from '../../../future-hopr-lib-components/Tooltip/tooltip-fixed-width';
import WithdrawModal from '../../../components/Modal/node/WithdrawModal';
import SmallActionButton from '../../../future-hopr-lib-components/Button/SmallActionButton';
import { ColorStatus } from '../../../components/InfoBar/details';
import ProgressBar from '../../../future-hopr-lib-components/Progressbar';

//Icons
import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';

import Row from './row';

const TdActionIcons = styled.td`
  display: flex;
  gap: 8px;
  align-items: center;
`;

function NodeUptime() {
  const nodeStartedEpoch = useAppSelector((store) => store.node.metrics.data.parsed?.hopr_up?.data[0]);
  const [nodeTimeUp, set_nodeTimeUp] = useState('-');

  useEffect(() => {
    let interval: any;
    if (nodeStartedEpoch && typeof nodeStartedEpoch === 'number') {
      interval = setInterval(() => {
        const nodeStartedEpochMs = Math.floor(nodeStartedEpoch * 1000);
        const uptimeSec = Math.floor((Date.now() - nodeStartedEpochMs) / 1000);
        const days = Math.floor(uptimeSec / 86400);
        const hours = Math.floor((uptimeSec - days * 86400) / 3600);
        const minutes = Math.floor((uptimeSec - days * 86400 - hours * 3600) / 60);
        const seconds = Math.floor(uptimeSec - days * 86400 - hours * 3600 - minutes * 60);

        if (days !== 0) set_nodeTimeUp(`${days} days ${hours} hours ${minutes} min ${seconds} sec`);
        else if (hours !== 0) set_nodeTimeUp(`${hours} hours ${minutes} min ${seconds} sec`);
        else if (minutes !== 0) set_nodeTimeUp(`${minutes} min ${seconds} sec`);
        else set_nodeTimeUp(`${seconds} sec`);
      }, 1_000);
    }
    return () => clearInterval(interval);
  }, [nodeStartedEpoch]);

  return (
    <Row
      title={'Uptime'}
      tooltip={'The amount of the node is up'}
      value={nodeTimeUp}
    />
  );
}

export default NodeUptime;
