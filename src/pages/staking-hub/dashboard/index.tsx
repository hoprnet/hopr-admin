import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

// Store
import { useAppSelector } from '../../../store';

// HOPR Components

// Mui
import Paper from '@mui/material/Paper/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Tabs
import StakingScreen from './staking';
import SafeActions from './transactions';
import SafeDashboard from './safe';
import NoNodeAdded from './noNodeAdded';
import NodeAdded from './node'

export const DASHBOARD = {
  staking: 0,
  node: 1,
  safe: 2,
  transactions: 3,
} as { [key: string]: number};

const getTabIndexFromUrl = () => {
  const currentHash = window.location.hash.replace('#', '');
  console.log(currentHash)
  switch(currentHash){
    case 'node':
      return DASHBOARD.node;
    case 'safe':
      return DASHBOARD.safe;
    case 'transactions':
      return DASHBOARD.transactions;
    default: 
      return DASHBOARD.staking;  
  }
};

const getTabName = (index: number) => {
  const tmp = Object.keys(DASHBOARD).filter(key=> DASHBOARD[key] === index );
  return tmp[0];
};

const DashboardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  gap: 24px;
  min-height: calc(100vh - 124px);
  padding: 32px;

  overflow: hidden;
  background: #edfbff;

  transition: width 0.4s ease-out;
`;

const SPaper = styled(Paper)`
  width: 100%;
  min-height: calc( 100vh - 124px - 64px );
  overflow: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: white;
  .Content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`;


function Dashboard() {
  const navigate = useNavigate();
  const [tabIndex, set_tabIndex] = useState(getTabIndexFromUrl());

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newTabIndex: number) => {
    set_tabIndex(newTabIndex);
    handleHash(newTabIndex);
  };

  const handleHash = (newTabIndex: number) => {
    const newHash = getTabName(newTabIndex);
    navigate(`#${newHash}`, { replace: true });
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <DashboardContainer className="DashboardContainer">

      <SPaper>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="STAKING" {...a11yProps(0)} />
          <Tab label="NODE" {...a11yProps(1)} />
          <Tab label="SAFE" {...a11yProps(2)} />
          <Tab label="TRANSACTIONS" {...a11yProps(3)} />
        </Tabs>
        <div className='Content'>
          { tabIndex === DASHBOARD.staking && <StakingScreen/>}
          { tabIndex === DASHBOARD.node && <NodeAdded/>}
          { tabIndex === DASHBOARD.safe && <SafeDashboard/>}
          { tabIndex === DASHBOARD.transactions && <SafeActions/>}
        </div>
      </SPaper>
    </DashboardContainer>
  );
}

export default Dashboard;
