import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams } from 'react-router-dom';

//Store
import { useAppSelector } from '../../../store';

// HOPR Components
import { Stepper } from '../../../components/Stepper';
import NetworkOverlay from '../../../components/NetworkOverlay';

//Steps
import OnboardingIsFetching from './isFetching';
import AddNode from './step5/0addNode';
import ConfigureNode from './step6/0configureNode';
import FundNode from './step7/0fundNode';
import NodeIsReady from './step9/0nodeIsReady';

const OnboardingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  min-height: calc(100vh - 60px - 80px + 40px);
  padding-left: 16px;
  padding-right: 16px;
  overflow: hidden;
  background: #edfbff;
  padding-bottom: 40px;
  transition: width 0.4s ease-out;
`;

export const ONBOARDING_PAGES = {
  ADD_NODE: 1,
  CONFIGURE_NODE: 2,
  FUND_NODE: 3,
  NODE_IS_READY: 4,
} as const;

function Onboarding() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nodeAddress = searchParams.get('nodeAddress');
  const [onboardingStep, set_onboardingStep] = useState(0);
  const [onboardingIsFetching, set_onboardingIsFetching] = useState(true);
  const nodesData = useAppSelector((store) => store.stakingHub.nodes);
  const delegates = useAppSelector((store) => store.safe.delegates.data);
  const delegatesArray = delegates?.results?.map(elem => elem.delegate.toLocaleLowerCase()) || [];

  // useEffect(() => {
  //   navigate(`#${onboardingStep}`, { replace: true });
  // }, [onboardingStep]);

  useEffect(() => {
    console.log('[Next Onboarding] nodeAddress', nodeAddress);
    if(nodeAddress) {
      const nodeData = nodesData[nodeAddress];
      const isDelegate = delegatesArray.includes(nodeAddress);
      const isFunded = nodeData?.balanceFormatted ? parseFloat(nodeData.balanceFormatted) > 0.5 : false;
      const inNetworkRegistry = nodeData?.registeredNodesInNetworkRegistry ? true : false;
      console.log('[Next Onboarding] Object', {
        nodeData,
        nodeAddress,
        isDelegate,
        isFunded,
        inNetworkRegistry
      })
      let step = 1;
      if(isDelegate) {
        step = 2;
        if(inNetworkRegistry) {
          step = 3;
          if(isFunded) {
            step = 4;
          }
        }
      }
      set_onboardingStep(step);
      set_onboardingIsFetching(false);
    }
  }, [nodeAddress, nodesData]);

  function whatIsCompletedStep(page: number) {
    switch (page) {
      case ONBOARDING_PAGES.CONFIGURE_NODE:
        return 1;
      case ONBOARDING_PAGES.FUND_NODE:
        return 2;
      case ONBOARDING_PAGES.NODE_IS_READY:
        return 3;
      default:
        return -1;
      }
  }

  function whatIsCurrentStep(page: number) {
    switch (page) {
      case ONBOARDING_PAGES.ADD_NODE:
        return 0;
      case ONBOARDING_PAGES.CONFIGURE_NODE:
        return 1;
      case ONBOARDING_PAGES.FUND_NODE:
        return 2;
      case ONBOARDING_PAGES.NODE_IS_READY:
        return 3;
      default:
        return 0;
    }
  }

  return (
    <OnboardingContainer className="OnboardingContainer">
      <Stepper
        lastStepDone={whatIsCompletedStep(onboardingStep)}
        currentStep={whatIsCurrentStep(onboardingStep)}
        style={{ flex: '1 1 10%' }}
        steps={[
          { name: 'ADD NODE AS A DELEGATE' },
          { name: 'CONFIGURE NODE' },
          { name: 'FUND NODE' },
        ]}
      />

      {
        onboardingIsFetching && onboardingStep === 0 ?
          <OnboardingIsFetching />
          :
          <>
            {onboardingStep === ONBOARDING_PAGES.ADD_NODE && <AddNode />}
            {onboardingStep === ONBOARDING_PAGES.CONFIGURE_NODE && <ConfigureNode />}
            {onboardingStep === ONBOARDING_PAGES.FUND_NODE && <FundNode />}
            {onboardingStep === ONBOARDING_PAGES.NODE_IS_READY && <NodeIsReady />}
          </>
      }
      <div style={{ flex: 1 }} />
      <NetworkOverlay/>
    </OnboardingContainer>
  );
}

export default Onboarding;
