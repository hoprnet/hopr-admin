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
import WhatYouWillNeedPage from '../../steps/whatYouWillNeed';
import CreateSafe from '../../steps/createSafe';
import SafeIsReady from '../../steps/safeIsReady';
import OptionalNftTtransfer from '../../steps/optionalNftTtransfer';
import XdaiToSafe from '../../steps/xDaiToSafe';
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

  return (
    <OnboardingContainer className="OnboardingContainer">
      <Stepper
        currentStep={1}
        steps={[
          { name: 'create safe' },
          { name: 'really long text whatever this might be. really long text whatever this might be.' },
          { name: 'fund safe' },
          { name: 'choose your node setup' },
          { name: 'add node' },
        ]}
      />

      {onboardingStep === 0 && (
        <StepContainer>
          <button
            onClick={() => {
              dispatch(stakingHubActions.setOnboardingStep(1));
            }}
          >
            Start
          </button>
        </StepContainer>
      )}

      {onboardingStep === 1 && <WhatYouWillNeedPage />}

      {onboardingStep === 2 && <CreateSafe />}

      {onboardingStep === 3 && <SafeIsReady />}

      {onboardingStep === 4 && <OptionalNftTtransfer />}

      {onboardingStep === 5 && <XdaiToSafe />}

      {onboardingStep === 6 && (
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
