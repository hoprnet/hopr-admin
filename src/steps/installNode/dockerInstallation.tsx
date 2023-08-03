import { TextField } from '@mui/material';
import Section from '../../future-hopr-lib-components/Section';
import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../future-hopr-lib-components/Button';
import GrayButton from '../../future-hopr-lib-components/Button/gray';
import Card from '../../components/Card';
import CodeCopyBox from '../../components/CodeCopyBox';
import { useNavigate } from 'react-router-dom';

const docker_image = 'gcr.io/hoprassociation/hoprd:1.93.5';

const Subtitle = styled.h3`
  margin: 0;
`;

const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

const Children = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DockerInstallation = () => {
  const navigate = useNavigate();
  const [address, set_address] = useState('');
  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card title="Docker Installation">
        <Children>
          <Subtitle>1. Run one of these commands</Subtitle>
          <div>
            <span>Run HOPRd</span>
            <CodeCopyBox code={`docker pull ${docker_image}`} />
          </div>
          <div>
            <span>HOPRd pull command</span>
            <CodeCopyBox
              code={`docker run --pull always --restart on-failure -m 2g --log-driver json-file --log-opt max-size=100M --log-opt max-file=5 -ti -v $HOME/.hoprd-db-monte-rosa:/app/hoprd-db -p 9091:9091/tcp -p 9091:9091/udp -p 8080:8080 -p 3001:3001 -e DEBUG="hopr*" gcr.io/hoprassociation/hoprd:1.93.5 --environment monte_rosa --init --api --identity /app/hoprd-db/.hopr-id-monte-rosa --data /app/hoprd-db --password 'open-sesame-iTwnsPNg0hpagP+o6T0KOwiH9RQ0' --apiHost "0.0.0.0" --apiToken 'YOUR_SECURITY_TOKEN' --healthCheck --healthCheckHost "0.0.0.0"`}
            />
          </div>
          <Subtitle>2. Please enter your node address</Subtitle>
          <TextField
            type="text"
            label="Node Address"
            placeholder="Your address..."
            fullWidth
            value={address}
            onChange={(e) => set_address(e.target.value)}
          />
          <ButtonContainer>
            <StyledGrayButton onClick={() => navigate(-1)}>Back</StyledGrayButton>
            <Button>Confirm</Button>
          </ButtonContainer>
        </Children>
      </Card>
    </Section>
  );
};

export default DockerInstallation;
