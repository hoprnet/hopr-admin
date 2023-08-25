import React from 'react';
import styled from '@emotion/styled';

//Store
import { useAppSelector, useAppDispatch } from '../../store';
import { stakingHubActions } from '../../store/slices/stakingHub';

// HOPR Components
import { StepContainer } from '../../steps/components';

// Mui
import Paper from '@mui/material/Paper/Paper';

//Steps
import WhatYouWillNeedPage from '../../steps/step0_whatYouWillNeed';
import CreateSafe from '../../steps/step1-1_createSafe';
import SafeIsReady from '../../steps/step1-2_safeIsReady';
import OptionalNftTtransfer from '../../steps/step2_optionalNftTtransfer';
import XdaiToSafe from '../../steps/step3_xDaiToSafe';
import { Stepper } from '../../components/Stepper';

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
  const onboardingStep = useAppSelector((store) => store.stakingHub.onboarding.step);

  function whatIsCompletedStep(page: number) {
    switch (page) {
    case 2:
    case 3:
      return 1;

    default:
      return 0;
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

      {onboardingStep === 5 && (
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
