import { useAppSelector } from '../../store';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

// HOPR Components
import Details from './details';
import FAQ from '../Faq';
import infoDataRaw from '../Faq/info.json'; // Import your info.json data

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
  overflow-x: hidden;
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
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

export default function InfoBar(props: Props) {
  const web3Connected = useAppSelector((store) => store.web3.status.connected);
  const nodeConnected = useAppSelector((store) => store.auth.status.connected);
  const currentRoute = useLocation().pathname;

  const infoData: InfoData = infoDataRaw;

  const pageHasFAQ = () => {
    if (infoData[currentRoute]) return true;
    return false;
  };

  return (
    <SInfoBar className={`InfoBar ${web3Connected ? 'web3' : ''} ${nodeConnected ? 'node' : ''}`}>
      {(web3Connected || (nodeConnected && !web3Connected)) && <Details />}
      {nodeConnected && pageHasFAQ() && (
        <FAQ
          data={infoData[currentRoute]}
          label={currentRoute.split('/')[currentRoute.split('/').length - 1]}
          variant="blue"
        />
      )}
    </SInfoBar>
  );
}
