import styled from '@emotion/styled';
import Card from '../components/Card';
import Button from '../future-hopr-lib-components/Button';
import Section from '../future-hopr-lib-components/Section';

const ConfirmButton = styled(Button)`
  width: 250px;
  align-self: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default function WhatYouWillNeedPage() {
  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card title="what you will need" description='It will take 20 minutes to join the network waitlist. Before starting make sure you have got the required tokens.'>
        <Content>
          
          <ConfirmButton>Confirm</ConfirmButton>
        </Content>
      </Card>
    </Section>
  );
}
