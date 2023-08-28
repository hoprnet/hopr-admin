import styled from '@emotion/styled';
import Card from '../../../../components/Card';
import Button from '../../../../future-hopr-lib-components/Button';
import Section from '../../../../future-hopr-lib-components/Section';
import { StepContainer } from '../components';

//Store
import { useAppSelector, useAppDispatch } from '../../../../store';
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

export default function AddedToWhitelist() {
  const dispatch = useAppDispatch();
  return (
    <StepContainer
      title="Congratulations!"
      description={'You are now eligible to join the HOPR network! Continue below to set up your HOPR node.'}
      image={{
        src: '/assets/green-check.svg',
        alt: 'Safe deployed successfully',
        height: 200,
      }}
    >
      <Content>
        <ConfirmButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(12));
          }}
        >
          Continue
        </ConfirmButton>
      </Content>
    </StepContainer>
  );
}
