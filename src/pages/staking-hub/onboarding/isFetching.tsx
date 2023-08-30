import styled from '@emotion/styled';
import { StepContainer } from './components';
import { CircularProgress } from '@mui/material';

const Content = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

export default function OnboardingIsFetching() {
  return (
    <StepContainer
      title={'Fetching your current onboarding status'}
      description={''}
      image={{
        src: '/assets/hopr_logo.svg',
        height: 300,
      }}
    >
      <Content>
        <CircularProgress />
      </Content>
    </StepContainer>
  );
}
