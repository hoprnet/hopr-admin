import styled from '@emotion/styled';
import Card from '../components/Card';
import Button from '../future-hopr-lib-components/Button';
import Section from '../future-hopr-lib-components/Section';

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
  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card
        title="congratulations!"
        description="You are now eligible to join the HOPR network! Continue below to set up your HOPR node."
        image={{
          src: '/assets/green-check.svg',
          alt: 'Safe deployed successfully',
          height: 200,
        }}
      >
        <Content>
          <ConfirmButton>Confirm</ConfirmButton>
        </Content>
      </Card>
    </Section>
  );
}
