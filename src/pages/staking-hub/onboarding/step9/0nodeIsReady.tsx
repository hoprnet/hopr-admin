import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer } from '../components';
import { useNavigate } from 'react-router-dom';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ConfirmButton = styled(Button)`
  width: 200px;
  align-self: center;
`;

export default function NodeIsReady() {
  const navigate = useNavigate();
  return (
    <StepContainer
      title="CONGRATULATIONS YOUR NODE HAS BEEN ADDED!"
      description={'Your node and safe are now completely set up and ready to use!'}
      image={{
        src: '/assets/onboarding-done.svg',
        alt: 'Onboarding done',
        height: 300,
      }}
    >
      <Content>
        <ConfirmButton
          onClick={() => {
            navigate('/dev-pages/staking-screen');
          }}
        >
          VIEW STAKING OVERVIEW
        </ConfirmButton>
      </Content>
    </StepContainer>
  );
}
