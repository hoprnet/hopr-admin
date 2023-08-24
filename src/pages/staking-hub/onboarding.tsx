import React from 'react';
import styled from '@emotion/styled';


// HOPR Components
import Section from '../../future-hopr-lib-components/Section';


// Mui
import Paper from '@mui/material/Paper/Paper';


const Steps = styled.div`
  height: 400px;
  width: 280px;
  background-color: darkblue;
`

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
`

const SPaper = styled(Paper)`
  max-width: 850px;
  width: 100%;
`

function Onboarding() {



  
  return (
    <OnboardingContainer
      className='OnboardingContainer'
    >
      <Steps/>
      <SPaper>
        x
      </SPaper>
    </OnboardingContainer>
  );
}

export default Onboarding;
