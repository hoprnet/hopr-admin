import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer, ConfirmButton } from '../components';

//Store
import { useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

export default function safeIsReady() {
  const dispatch = useAppDispatch();
  return (
    <StepContainer
      title="SAFE IS READY"
      description={
        <>
          <p>You’re now part of the HOPR ecosystem!</p>
          <p>Next, you’ll need to fund your HOPR node.</p>
        </>
      }
      image={{
        src: '/assets/safe-success-2.svg',
        alt: 'Safe deployed successfully',
        height: 300,
      }}
      buttons={
        <ConfirmButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(3));
          }}
        >
          CONTINUE
        </ConfirmButton>
      }
    ></StepContainer>
  );
}
