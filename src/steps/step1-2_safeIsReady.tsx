import styled from '@emotion/styled';
import Button from '../future-hopr-lib-components/Button';
import { StepContainer } from './components';

//Store
import { useAppSelector, useAppDispatch } from '../store';
import { stakingHubActions } from '../store/slices/stakingHub';

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
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(4));
          }}
        >
          CONTINUE
        </ConfirmButton>
      </Content>
    </StepContainer>
  );
}
