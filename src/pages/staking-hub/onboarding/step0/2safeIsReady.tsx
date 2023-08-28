import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer } from '../components';

//Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { useEffect } from 'react';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { useEthersSigner } from '../../../../hooks';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ConfirmButton = styled(Button)`
  width: 200px;
  align-self: center;
`;

export default function safeIsReady() {
  const dispatch = useAppDispatch();
  const safeInfo = useAppSelector((state) => state.safe.info.data);
  const safeAddress = useAppSelector((state) => state.safe.selectedSafeAddress.data);
  const signer = useEthersSigner();

  useEffect(() => {
    const interval = setInterval(() => {
      if (safeAddress && signer && !safeInfo) {
        dispatch(
          safeActionsAsync.getSafeInfoThunk({
            safeAddress,
            signer,
          }),
        );
      }
    }, 15_000);

    return () => {
      clearInterval(interval);
    };
  }, [safeAddress, signer]);

  return (
    <StepContainer
      title="SAFE IS READY"
      description={
        <>
          You’re now part of the HOPR ecosystem!
          <br />
          Next, you’ll need to fund your HOPR node."
        </>
      }
      image={{
        src: '/assets/safe-success-2.svg',
        alt: 'Safe deployed successfully',
        height: 300,
      }}
    >
      <Content>
        <ConfirmButton
          disabled={!safeInfo}
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(3));
          }}
        >
          CONTINUE
        </ConfirmButton>
        {!safeInfo && <p>Checking if the safe has been indexed by our services...</p>}
      </Content>
    </StepContainer>
  );
}
