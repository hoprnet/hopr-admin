import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer, ConfirmButton } from '../components';
import { useNavigate } from 'react-router-dom';

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
      buttons={
        <ConfirmButton
          onClick={()=>{navigate('/staking/dashboard')}}
          style={{maxWidth: '300px'}}
        >
          VIEW STAKING OVERVIEW
        </ConfirmButton>
      }
    >
    </StepContainer>
  );
}
