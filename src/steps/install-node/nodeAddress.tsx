import { TextField } from '@mui/material';
import Section from '../../future-hopr-lib-components/Section';
import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../future-hopr-lib-components/Button';
import GrayButton from '../../future-hopr-lib-components/Button/gray';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

const NodeAddress = () => {
  const navigate = useNavigate();
  const [address, set_address] = useState('');
  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card title="Please enter your node address">
        <>
          <TextField
            type="text"
            label="Node Address"
            placeholder="Your address..."
            value={address}
            onChange={(e) => set_address(e.target.value)}
          />
          <ButtonContainer>
            <StyledGrayButton onClick={() => navigate(-1)}>Back</StyledGrayButton>
            <Button>Confirm</Button>
          </ButtonContainer>
        </>
      </Card>
    </Section>
  );
};

export default NodeAddress;
