import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

//Store
import { useAppSelector, useAppDispatch } from '../../../store';
import { stakingHubActions } from '../../../store/slices/stakingHub';

// HOPR Components
import { StepContainer } from './components';
import { Stepper } from '../../../components/Stepper';

//Steps
import WhatYouWillNeedPage from './step0/0whatYouWillNeed';
import CreateSafe from './step0/1createSafe';
import SafeIsReady from './step0/2safeIsReady';
import OptionalNftTtransfer from './step1/0optionalNftTtransfer';
import XdaiToSafe from './step2/0fundSafe';
import SafeIsFunded from './step2/1safeIsFunded';
import SelectNodeType from './step3/0selectNodeType';
import SetupNodeStep from './step3/1setupYourNode';
import SetupYourDappNode from './step3/1setupYourDappNode';
import JoinWaitListStep from './step4/0joinWaitlist';
import AddedToWhitelist from './step4/1addedToWhitelist';

const OnboardingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  min-height: calc(100vh - 60px - 80px + 40px);
  padding-left: 16px;
  padding-right: 16px;
  overflow: hidden;
  background: #edfbff;
  padding-bottom: 40px;
`;

function Onboarding() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onboardingStep = useAppSelector((store) => store.stakingHub.onboarding.step);

  useEffect(() => {
    navigate(`#${onboardingStep}`, { replace: true });
  }, [onboardingStep]);

  function whatIsCompletedStep(page: number) {
    switch (page) {
    case 2:
    case 3:
      return 1;

    default:
      return -1;
    }
  }

  function whatIsCurrentStep(page: number) {
    switch (page) {
    case 4:
      return 1;

    default:
      return 0;
    }
  }

  return (
    <OnboardingContainer className="OnboardingContainer">
      <Stepper
        lastStepDone={whatIsCompletedStep(onboardingStep)}
        currentStep={whatIsCurrentStep(onboardingStep)}
        steps={[
          { name: 'CREATE SAFE' },
          { name: 'OPTIONAL NFT TRANSFER' },
          { name: 'FUND SAFE' },
          { name: 'CHOOSE YOUR NODE SETUP' },
          { name: 'WAITLIST' },
          { name: 'ADD NODE' },
          { name: 'CONFIGURE NODE' },
          { name: 'FUND NODE' },
          { name: 'SET wxHOPR ALLOWANCES' },
        ]}
      />

      {onboardingStep === 0 && <WhatYouWillNeedPage />}
      {onboardingStep === 1 && <CreateSafe />}
      {onboardingStep === 2 && <SafeIsReady />}
      {onboardingStep === 3 && <OptionalNftTtransfer />}
      {onboardingStep === 4 && <XdaiToSafe />}
      {onboardingStep === 5 && <SafeIsFunded />}
      {onboardingStep === 6 && <SelectNodeType />}
      {onboardingStep === 7 && <SetupNodeStep />}
      {onboardingStep === 8 && <SetupYourDappNode />}

      {onboardingStep === 10 && <JoinWaitListStep />}
      {onboardingStep === 11 && <AddedToWhitelist />}

      {onboardingStep === 22 && (
        <StepContainer>
          <button
            onClick={() => {
              dispatch(stakingHubActions.setOnboardingStep(4));
            }}
          >
            Back
          </button>
        </StepContainer>
      )}
    </OnboardingContainer>
  );
}

export default Onboarding;
