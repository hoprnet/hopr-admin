import styled from '@emotion/styled';
import { ReactNode, useEffect, useState } from 'react';
import { truncateHOPRPeerId } from '../../../utils/helpers';
import { useAppDispatch, useAppSelector } from '../../../store';
import { safeActionsAsync } from '../../../store/slices/safe';
import { useEthersSigner } from '../../../hooks';

import Button from '../../../future-hopr-lib-components/Button';
import { Card, Chip, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';

const Content = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 2rem;
  #node-graphic {
    grid-column: 1/3;
    grid-row: 1/3;
  }

  & #remaining-wxhopr-allowance {
    grid-column: 3/4;
  }

  & #earned-rewards {
    grid-column: 4/5;
  }

  & #node-strategy {
    grid-column: 3/4;
  }

  & #redeemed-tickets {
    grid-column: 4/5;
  }

  & #xdai {
    grid-column: 3/4;
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

const CardTitle = styled.h4`
  font-weight: 700;
  margin: 0;
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

const StyledChip = styled(Chip)<{ color: string }>`
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
  }
`;

const NodeInfo = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
`;

const NodeInfoRow = styled.div`
  display: flex;

  & p {
    align-self: flex-end;
    margin: 0;
    font-size: 12px;
  }

  & p:first-of-type {
    width: 112px;
    font-weight: 600;
  }

  & #actions {
    align-self: flex-start;
  }
`;

const StyledIconButton = styled(IconButton)`
  background-color: #000050;
  color: #fff;
  height: 1rem;
  padding: 1rem;
  width: 1rem;
  margin-right: 0.5rem;

  &:hover {
    background-color: #2b2b66;
  }

  & svg {
    height: 1rem;
    width: 1rem;
  }
`;

const SquaredIconButton = styled(IconButton)`
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
          {title && <CardTitle>{title}</CardTitle>}
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

const NodeAdded = () => {
  const dispatch = useAppDispatch();
  const nodeNativeAddress = useAppSelector((store) => store.node.addresses.data.native);
  const nodeHoprAddress = useAppSelector((store) => store.node.addresses.data.hopr);
  const safeBalance = useAppSelector((store) => store.safe.balance.data);
  const wxHoprAllowance = useAppSelector((store) => store.stakingHub.safeInfo.data.allowance.wxHoprAllowance);
  const safeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);

  const signer = useEthersSigner();

  const navigate = useNavigate();
  // const [queryParams, set_queryParams] = useState(''); // later on well see how to get this params

  return (
        <Content>
          <GrayCard id="node-graphic">
            <Graphic>
              <NodeGraphic>
                <img
                  src="/assets/node-graphic.svg"
                  alt="Node Graphic"
                />
              </NodeGraphic>
              <NodeInfo>
                <NodeInfoRow>
                  <p>Node Address</p>
                  {nodeHoprAddress ? (
                    <>
                      <p>{truncateHOPRPeerId(nodeHoprAddress)}</p>
                      <SquaredIconButton
                        onClick={() => nodeHoprAddress && navigator.clipboard.writeText(nodeHoprAddress)}
                      >
                        <CopyIcon />
                      </SquaredIconButton>
                      <Link to={`https://gnosisscan.io/address/${nodeNativeAddress}`}>
                        <SquaredIconButton>
                          <LaunchIcon />
                        </SquaredIconButton>
                      </Link>
                    </>
                  ) : (
                    <p>-</p>
                  )}
                </NodeInfoRow>
                <NodeInfoRow>
                  <p>Last seen</p>
                  <p>- mins</p>
                </NodeInfoRow>
                <NodeInfoRow>
                  <p>Ping</p>
                  <p>-</p>
                </NodeInfoRow>
                <NodeInfoRow>
                  <p>24h Avail.</p>
                  <p>-%</p>
                </NodeInfoRow>
                <NodeInfoRow>
                  <p>Availability</p>
                  <p>-%</p>
                </NodeInfoRow>
                <NodeInfoRow>
                  <p id="actions">Actions</p>
                  <StyledIconButton
                    onClick={() => {} /*navigate(`/node/configuration?${queryParams}`)*/}
                    disabled
                  >
                    <SettingsIcon />
                  </StyledIconButton>
                  <StyledIconButton disabled>
                    <CloseIcon />
                  </StyledIconButton>
                </NodeInfoRow>
              </NodeInfo>
            </Graphic>
          </GrayCard>
          <GrayCard
            id="remaining-wxhopr-allowance"
            title="Remaining wxHOPR Allowance"
            value={wxHoprAllowance ?? '-'}
            currency="wxHOPR"
            buttons={[
              {
                text: 'Adjust',
                link: '/staking/set-allowance',
              },
            ]}
          ></GrayCard>
          <GrayCard
            id="earned-rewards"
            title="Earned rewards"
            value="-"
            currency="wxHOPR"
            // chip={{
            //   label: '-%/24h',
            //   color: 'error',
            // }}
          />
          {/* <GrayCard
            id="node-strategy"
            title="Node strategy"
            value={'-'}
            buttons={[
              {
                text: 'Adjust in node admin',
                link: '#', //`/node/configuration?${queryParams}`,
              },
            ]}
          ></GrayCard> */}
          <GrayCard
            id="redeemed-tickets"
            title="Redeemed Tickets"
            value="-"
            currency="Ticket/wxHOPR"
            // chip={{
            //   label: '+%/24h',
            //   color: 'success',
            // }}
          ></GrayCard>
          {/* <GrayCard
           // id="xdai"
            id="earned-rewards"
            title="xDAI"
            value={safeBalance.xDai.formatted ?? '-'}
            buttons={[
              {
                text: 'Send to node',
                link: '#',
                disabled: true,
              },
              // {
              //   text: 'Withdraw',
              //   link: '#',
              //   disabled: true,
              // },
            ]}
          ></GrayCard> */}
        </Content>
  );
};

export default NodeAdded;
