import { useAppSelector } from '../../store';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

// HOPR Components
import Details from './details';
import FAQ from '../Faq';
import nodeInfoRaw from '../Faq/node-faq.json';
import stakingInfoRaw from '../Faq/staking-faq.json';
import stakingAlertsRaw from '../Faq/staking-alerts.json';

type InfoData = {
  [routePath: string]: {
    id: number;
    title: string;
    content: string;
  }[];
};

interface Props {}

const SInfoBar = styled.div`
  display: none;
  width: 233px;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  box-sizing: border-box;
  padding-top: 48px;
  &.node {
    background: #ffffa0;
    border: 0;
  }
  &.web3 {
    background: #edfbff;
    border: 0;
  }
  @media (min-width: 740px) {
    display: block;
  }
`;

const Scroll = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  & > div {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #ffffa0;
  }
  &::-webkit-scrollbar-thumb {
    background: #3c64a5;
    border-radius: 10px;
    border: 3px solid #ffffa0;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #000050;
  }
`;

export default function InfoBar(props: Props) {
  const web3Connected = useAppSelector((store) => store.web3.status.connected);
  const nodeConnected = useAppSelector((store) => store.auth.status.connected);
  const currentRoute = useLocation().pathname;

  const nodeInfoData: InfoData = nodeInfoRaw;
  const stakingInfoData: InfoData = stakingInfoRaw;
  const stakingAlertsData: InfoData = stakingAlertsRaw;

  const pageHasNodeFAQ = () => {
    if (nodeInfoData[currentRoute]) return true;
    return false;
  };

  const pageHasStakingFAQ = () => {
    if (stakingInfoData[currentRoute]) return true;
    return false;
  };

  const pageHasStakingAlerts = () => {
    if (stakingAlertsData[currentRoute]) return true;
    return false;
  };

  return (
    <SInfoBar className={`InfoBar ${web3Connected ? 'web3' : ''} ${nodeConnected ? 'node' : ''}`}>
      <Scroll>
        <div>
          {(web3Connected || (nodeConnected && !web3Connected)) && <Details />}
          {nodeConnected && pageHasNodeFAQ() && (
            <FAQ
              data={nodeInfoData[currentRoute]}
              label={currentRoute.split('/')[currentRoute.split('/').length - 1]}
              variant="blue"
            />
          )}
          {web3Connected && pageHasStakingFAQ() && (
            <FAQ
              data={stakingInfoData[currentRoute]}
              label={currentRoute.split('/')[currentRoute.split('/').length - 1]}
              variant="blue"
            />
          )}
          {web3Connected && pageHasStakingAlerts() && (
            <FAQ
              data={stakingAlertsData[currentRoute]}
              label={currentRoute.split('/')[currentRoute.split('/').length - 1]}
              variant="pink"
            />
          )}
        </div>
      </Scroll>
    </SInfoBar>
  );
}
