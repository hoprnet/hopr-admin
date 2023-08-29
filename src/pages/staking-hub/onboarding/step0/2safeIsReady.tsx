import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer } from '../components';

//Store
import { useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

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
          <p>You’re now part of the HOPR ecosystem!</p>
          <p>Next, you’ll need to fund your HOPR node.</p>
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
            dispatch(stakingHubActions.setOnboardingStep(3));
          }}
        >
          CONTINUE
        </ConfirmButton>
      </Content>
    </StepContainer>
  );
}
