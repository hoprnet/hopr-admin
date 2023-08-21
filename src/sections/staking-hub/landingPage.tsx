import styled from '@emotion/styled';
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
import { Link } from 'react-router-dom';

const StyledContainer = styled.div`
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1080px;
  padding: 2rem;
`;

const ImageContainer = styled.div`
  margin-left: 12rem;
  min-height: 256px;
  min-width: 512px;
  padding: 1rem;
`;

const Image = styled.img`
  display: block;
  height: 100%;
  width: 100%;
`;

const Title = styled.h2`
  color: #414141;
  font-size: 80px;
  font-weight: 400;
  margin-block: 3rem;
  text-transform: uppercase;
`;

const Description = styled.p`
  color: #414141;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  max-width: 74ch;
`;

const Links = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;
  padding-inline: 2rem;
`;

const StyledLink = styled(Link)`
  color: #0000b4;
  font-weight: 700;
  text-decoration: underline;
`;

const StakingLandingPage = () => {
  return (
    <Section
      center
      fullHeightMin
    >
      <StyledContainer>
        <ImageContainer>
          <Image src="/assets/staking-hub.svg" />
        </ImageContainer>
        <Title>HOPR staking hub</Title>
        <Description>
          Blindtext. Decentralized approaches to digital services, finance and data transfer will usher in a new era of
          freedom, fairness and user choice.
        </Description>
        <StyledButton disabled>Create SAFE</StyledButton>
        <Links>
          <StyledLink to="https://docs.hoprnet.org">Docs</StyledLink>
          <StyledLink to="https://t.me/hoprnet">Telegram</StyledLink>
        </Links>
      </StyledContainer>
    </Section>
  );
};

export default StakingLandingPage;
