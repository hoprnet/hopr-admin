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

function Row(props: { tooltip: any; title: any; value: any }) {
  return (
    <tr>
      <th>
        <Tooltip
          title={props.tooltip}
          notWide
        >
          <span>{props.title}</span>
        </Tooltip>
      </th>
      <td>{props.value}</td>
    </tr>
  );
}

export default Row;
