import styled from '@emotion/styled';
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
import { Link } from 'react-router-dom';
import ContinueOnboarding from '../../components/Modal/staking-hub/ContinueOnboarding';

const StyledContainer = styled.div`
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1080px;
  /* padding: 2rem; */
`;

const ImageContainer = styled.div`
  /* margin-left: 12rem; */
  margin: 0 auto;
  min-height: 256px;
  min-width: 512px;
  /* padding: 1rem; */
  position: relative;
  justify-content: center;
  display: flex;
`;

const Image = styled.img`
  display: block;
  height: 100%;
  width: 100%;
`;

const Title = styled.h2`
  color: #414141;
  font-size: 60px;
  font-weight: 400;
  margin-block: 0rem;
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
`;

const StyledLink = styled(Link)`
  color: #0000b4;
  font-weight: 700;
  text-decoration: underline;
`;

const SideToSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 20rem;
  margin-bottom: 2rem;
`;

const TextSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 31.25rem;
`;

const SideTitle = styled.h2`
  color: #414141;
  font-size: 50px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  text-align: left;
`;

const SideDescription = styled.p`
  color: #414141;
  font-size: 18px;
  font-weight: 600;
  max-width: 74ch;
  text-align: justify;
`;

const ImageSide = styled.div`
  align-items: center;
  width: 31.25rem;
`;

const BlueText = styled.div`
  display: inline;
  color: #0000b4;
  font-weight: 700;
`;

const StakingLandingPage = () => {
  return (
    <>
      <Section
        center
        fullHeightMin
        gradient
      >
        <StyledContainer>
          <ImageContainer>
            <Image
              style={{
                position: 'absolute',
                height: '80%',
                top: '40px',
              }}
              src="/assets/staking-landing.svg"
            />
            <Image src="/assets/yellow-ellipse.svg" />
          </ImageContainer>
          <Title>HOPR STAKING HUB</Title>
          <Description>
            Earn $HOPR while providing web3 users with the data privacy and autonomy Web 2.0 never did. Create your HOPR
            safe and start running a node now!
          </Description>
          <br />
          <StyledButton>Connect Wallet</StyledButton>
          <br />
          <Title>Run a node, earn hopr (ESTIMATED APY 10%)</Title>
          <SideToSideContainer>
            <ImageSide>
              <img src="/assets/HOPR_Node_staking.svg" />
            </ImageSide>
            <TextSide>
              <SideTitle>
                <BlueText>&lt;Earn&gt;</BlueText> $Hopr
                <br />
                to relay data
              </SideTitle>
              <SideDescription>
                You earn $HOPR for every packet of data you relay. This is done in a secure and decentralized fashion
                through our proof-of-relay mechanism.
              </SideDescription>
            </TextSide>
          </SideToSideContainer>
          <SideToSideContainer>
            <TextSide>
              <SideTitle>
                Store funds with <BlueText>&lt;complete security&gt;</BlueText>
              </SideTitle>
              <SideDescription>
                We compartmentalize access to your funds and node through our unique key management protocol, minimizing
                your funds at risk in case of a compromised node. Read more here.{' '}
              </SideDescription>
            </TextSide>
            <ImageSide>
              <img src="/assets/hopr_tokens.svg" />
            </ImageSide>
          </SideToSideContainer>
          <SideToSideContainer>
            <ImageSide>
              <img src="/assets/web3-private.svg" />
            </ImageSide>
            <TextSide>
              <SideTitle>
                Make web3 <BlueText>&lt;private&gt;</BlueText>
              </SideTitle>
              <SideDescription>
                Every node on the HOPR mixnet serves as a point to relay data and anonymize traffic sent across the
                network. As such, every node not only earns you $HOPR for the data you relay, but contributes to
                providing web3 with a truly decentralized and private transport layer.
              </SideDescription>
            </TextSide>
          </SideToSideContainer>
        </StyledContainer>
      </Section>
      <Section
        center
        fullHeightMin
      ></Section>
    </>
  );
};

export default StakingLandingPage;
