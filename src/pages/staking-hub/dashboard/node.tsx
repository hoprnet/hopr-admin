import styled from '@emotion/styled';
import { ReactNode, useEffect, useState } from 'react';
import { truncateHOPRPeerId } from '../../../utils/helpers';
import { useAppDispatch, useAppSelector } from '../../../store';
import { safeActionsAsync } from '../../../store/slices/safe';
import { useEthersSigner } from '../../../hooks';


import { Card, Chip, IconButton as MuiIconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';

// HOPR components
import Button from '../../../future-hopr-lib-components/Button';
import { Table } from '../../../future-hopr-lib-components/Table/columed-data'
import ProgressBar from '../../../future-hopr-lib-components/Progressbar'
import { formatDate } from '../../../utils/date';
import TablePro from '../../../future-hopr-lib-components/Table/table-pro';
import { DockerRunCommandModal } from '../../../components/Modal/staking-hub/DockerRunCommandModal';
import IconButton from '../../../future-hopr-lib-components/Button/IconButton';
import TrainIcon from '../../../future-hopr-lib-components/Icons/TrainIcon';

//web3
import { Address } from 'viem';
import { browserClient } from '../../../providers/wagmi';
import { Dock } from '@mui/icons-material';


const Container = styled.section`
    padding: 1rem;

    h4.title {
      font-weight: 700;
      margin: 0;
    }

    h5.subtitle {
      font-weight: 600;
      margin: 0;
    }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  #node-graphic {
    grid-column: 1/3;
    grid-row: 1/3;
  }

`;

const StyledGrayCard = styled(Card)`
  background-color: #edf2f7;
  color: #414141;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardValue = styled.h5`
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
`;

const CardCurrency = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
`;

const ValueAndCurrency = styled.div`
  align-items: flex-end;
  display: flex;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledChip = styled(Chip) <{ color: string }>`
  align-self: flex-start;
  background-color: ${(props) => props.color === 'error' && '#ffcbcb'};
  background-color: ${(props) => props.color === 'success' && '#cbffd0'};
  color: ${(props) => props.color === 'error' && '#c20000'};
  color: ${(props) => props.color === 'success' && '#00c213'};
  font-weight: 700;
`;

const Graphic = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  gap: 1rem;
`;

const NodeGraphic = styled.div`
  box-sizing: border-box;
  background-color: #d3f6ff;
  display: grid;
  min-height: 281px;
  max-width: 200px;
  padding: 1rem;
  place-items: center;

  img {
    display: block;
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const SquaredIconButton = styled(MuiIconButton)`
  color: #414141;
  height: 0.75rem;
  padding: 0.75rem;
  width: 0.75rem;
  margin-left: 0.25rem;

  & svg {
    height: 0.75rem;
    width: 0.75rem;
  }
`;

type GrayCardProps = {
  id: string;
  title?: string;
  subtitle?: string;
  value?: string;
  currency?: 'xDAI' | 'xHOPR' | 'wxHOPR' | string;
  chip?: {
    label: string;
    color: 'success' | 'error' | 'primary';
  };
  buttons?: {
    text: string;
    link: string;
    disabled?: boolean;
  }[];
  children?: ReactNode;
};

const GrayCard = ({
  id,
  title,
  subtitle,
  value,
  currency,
  chip,
  buttons,
  children,
}: GrayCardProps) => {
  return (
    <StyledGrayCard id={id}>
      {(title || value) && (
        <CardContent>
          {title && <h4 className='title'>{title}</h4>}
          {subtitle && <h5 className='subtitle'>{subtitle}</h5>}
          {value && (
            <ValueAndCurrency>
              <CardValue>{value}</CardValue>
              {currency && <CardCurrency>{currency}</CardCurrency>}
            </ValueAndCurrency>
          )}
        </CardContent>
      )}
      {chip && (
        <StyledChip
          label={chip.label}
          color={chip.color}
        />
      )}
      {buttons && (
        <ButtonGroup>
          {buttons.map((button) => (
            <Button
              key={button.text}
              disabled={button.disabled}
              nofade
            >
              <Link to={button.link}>{button.text}</Link>
            </Button>
          ))}
        </ButtonGroup>
      )}
      {children}
    </StyledGrayCard>
  );
};

const header = [
  {
    key: 'peerId',
    name: 'Node Address registered in Safe',
    search: true,
  },
  {
    key: 'inNetworkRegistry',
    name: 'In Network Registry',
    search: true,
    maxWidth: '160px',
  },
  {
    key: 'isDelegate',
    name: 'Is Delegate',
    search: true,
    maxWidth: '160px',
  },
  {
    key: 'search',
    name: '',
    search: true,
    hidden: true
  },
  {
    key: 'actions',
    name: 'Actions',
    search: false,
    width: '168px',
    maxWidth: '168px',
  },
];

const NodeAdded = () => {
  const navigate = useNavigate();
  const nodeHoprAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress);
  const nodeBalance = useAppSelector((store) => store.stakingHub.onboarding.nodeBalance.xDai.formatted);
  const nodes = useAppSelector((store) => store.stakingHub.nodes);
  const registeredNodesInSafeRegistryParsed = useAppSelector((store) => store.stakingHub.safeInfo.data.registeredNodesInSafeRegistryParsed);
  const registeredNodesInNetworkRegistryParsed = useAppSelector((store) => store.stakingHub.safeInfo.data.registeredNodesInNetworkRegistryParsed);
  const delegates = useAppSelector((store) => store.safe.delegates.data);
  const [chosenNode, set_chosenNode] = useState< string | null>(nodeHoprAddress);

  useEffect(()=>{
    set_chosenNode((prev) => {
      if(!prev) return nodeHoprAddress
      else return prev
    })
  }, [nodeHoprAddress]);

  useEffect(()=>{
    console.log('chosenNode', chosenNode)
  }, [chosenNode]);

  const delegatesArray = delegates?.results.map(elem => elem.delegate.toLocaleLowerCase()) || [];
  const parsedTableData = registeredNodesInSafeRegistryParsed.map((node, index) => {
    return {
      peerId: <>
                {node}
                <SquaredIconButton
                  onClick={() => nodeHoprAddress && navigator.clipboard.writeText(node)}
                >
                  <CopyIcon />
                </SquaredIconButton>
                <Link to={`https://gnosisscan.io/address/${node}`} target='_blank'>
                  <SquaredIconButton>
                    <LaunchIcon />
                  </SquaredIconButton>
                </Link>
              </>,
      inNetworkRegistry: registeredNodesInNetworkRegistryParsed.includes(node) ? 'Yes' : 'No',
      isDelegate: delegatesArray.includes(node) ? 'Yes' : 'No',
      id: node,
      search: node,
      actions: <>
        <IconButton
          iconComponent={<TrainIcon />}
          tooltipText={
            <span>
              Finish ONBOARDING for this node
            </span>
          }
          onClick={()=>{
            navigate(`/staking/onboarding/nextNode?nodeAddress=${node}`);
          }}
          disabled={registeredNodesInNetworkRegistryParsed.includes(node) && delegatesArray.includes(node)}
        />
      </>
    }
  });
  const chosenNodeData = chosenNode && nodes[chosenNode] ? nodes[chosenNode] : null;

  return (
    <Container>
      <Grid>
        <GrayCard id="node-graphic">
          <Graphic>
            <NodeGraphic>
              <img
                src="/assets/node-graphic.svg"
                alt="Node Graphic"
              />
            </NodeGraphic>
            <Table>
              <tbody>
                <tr>
                  <th>Node Address
                    <div>
                      <SquaredIconButton
                        onClick={() => nodeHoprAddress && navigator.clipboard.writeText(nodeHoprAddress)}
                      >
                        <CopyIcon />
                      </SquaredIconButton>
                      <Link to={`https://gnosisscan.io/address/${nodeHoprAddress}`} target='_blank'>
                        <SquaredIconButton>
                          <LaunchIcon />
                        </SquaredIconButton>
                      </Link>
                    </div>
                  </th>
                  <td>
                    <p
                      style={{
                        maxHeight: '72px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        margin: '0',
                      }}
                    >
                      {nodeHoprAddress}
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>Last seen</th>
                  <td>
                    <p
                      style={{
                        maxHeight: '72px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        margin: '0',
                      }}
                    >{chosenNodeData?.lastSeen ? formatDate(chosenNodeData.lastSeen) : '-'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>Ping count</th>
                  <td>{chosenNode && nodes[chosenNode]?.count || '-'}</td>
                </tr>
                <tr>
                  <th>24h Availability</th>
                  <td>
                    {
                      chosenNodeData?.availability24h ?
                        <ProgressBar
                          value={chosenNodeData.availability24h}
                        />
                        :
                        '-'
                    }
                  </td>
                </tr>
                <tr>
                  <th>Availability</th>
                  <td>
                    {
                      chosenNodeData?.availability ?
                        <ProgressBar
                          value={chosenNodeData.availability}
                        />
                        :
                        '-'
                    }
                  </td>
                </tr>
                <tr>
                  <th>Last seen version</th>
                  <td>{chosenNodeData?.version || '-'}</td>
                </tr>
              </tbody>
            </Table>
          </Graphic>
        </GrayCard>
        <GrayCard
          id="node-balance"
          title="xDAI"
          value={nodeBalance ?? '-'}
        />
        <GrayCard
          id="earned-rewards"
          title="Earned rewards"
          value="-"
          currency="wxHOPR"
        />
        <GrayCard
          id="docker-command"
          title="Docker Run Command"
          subtitle="The command needed to start a Node on your machine of choice such as PC or VPS"
        >
          <DockerRunCommandModal
            normalButton
          />
        </GrayCard>
        <GrayCard
          id="add-new-node"
          title="Add new Node"
          subtitle="Node will be added to the waitlist and once its is accepted, it will show up below"
        >
          <Button
            title='add'
          >
            Add new Node
          </Button>
        </GrayCard>
      </Grid>
      <br/>
      <TablePro
        data={parsedTableData}
        search={true}
        header={header}
      />
    </Container>
  );
};

export default NodeAdded;
