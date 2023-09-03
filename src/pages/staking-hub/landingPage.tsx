import styled from '@emotion/styled';
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
import ConnectWeb3 from '../../components/ConnectWeb3';
import { useAppSelector } from '../../store';
import ContinueOnboarding from '../../components/Modal/staking-hub/ContinueOnboarding';
import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Card } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '../../future-hopr-lib-components/Layout/footer';
import StartOnboarding from '../../components/Modal/staking-hub/StartOnboarding';
import { useNavigate } from 'react-router-dom';

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
  /* margin-left: 12rem; */
  margin: 0 auto;
  min-height: 256px;
  min-width: 512px;
  /* padding: 1rem; */
  position: relative;
  justify-content: center;
  display: flex;
  top: -35px;
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
  /* padding-top: 2rem; */
`;

const BigTitle = styled.h2`
  color: #414141;
  font-size: 80px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  padding-top: 2rem;
`;

const Description = styled.p`
  color: #414141;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  max-width: 74ch;
`;

const StyledButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;
`;

const FurtherReadingButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;
  width: 204px;
  display: flex;
  justify-content: space-evenly;
  flex: '0 0 33.333333%';
`;

const SideToSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 20rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const BlueSideToSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 15rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const TextSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 31.25rem;
`;

const BlueTextSide = styled.div`
  display: flex;
  flex-direction: column;
  width: 27.25rem;
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
  a {
    color: #007bff; /* Set the desired color for links */
    text-decoration: underline;
  }
`;

const WhiteSideTitle = styled.h2`
  color: #ffffff;
  font-size: 50px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  text-align: left;
`;

const WhiteSideDescription = styled.p`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  max-width: 74ch;
  text-align: justify;
`;

const WhiteMediumText = styled.p`
  font-weight: 600;
  font-size: 24px;
  color: #ffffff;
  line-height: 40px;
  text-align: left;
`;

const MediumText = styled.p`
  font-weight: 400;
  font-size: 24px;
  color: #414141;
  line-height: 40px;
  text-align: left;
`;

const ImageSide = styled.div`
  align-items: center;
  width: 31.25rem;
`;

const BlueImageSide = styled.div``;

const BlueText = styled.div`
  display: inline;
  color: #0000b4;
  font-weight: 700;
`;

const BrandsSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandText = styled.p`
  font-weight: 600;
  size: 12px;
  color: #414141;
`;

const BrandImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 200px;
`;

const WhiteTitle = styled.h2`
  color: #ffffff;
  font-size: 60px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  margin-top: 2rem;
`;

const BlueSectionButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;
  position: relative;
  top: -11rem;
  left: -18rem;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 12px;
  /* border-radius: 1rem; */
  margin-right: 8px;
  padding: 8px;
  background-color: #ffff;
  box-shadow: none;
`;

const StyledAccordion = styled(Accordion)`
  box-shadow: none;
  border: none;
  margin: 0;

  &::before {
    display: none;
  }

  &.Mui-expanded {
    margin: 0;
  }
`;

const SAccordionSummary = styled(AccordionSummary)`
  border-bottom: 2px solid #414141;
  padding: 0;
  background-color: #ffffff;

  &.Mui-expanded {
    min-height: 48px;
  }

  .MuiAccordionSummary-content,
  .MuiAccordionSummary-content.Mui-expanded {
    margin: 4px 2px;
  }
`;

const AccordionContent = styled(AccordionDetails)`
  margin: 0;
  padding: 0.75rem 0;
`;

const Content = styled.div`
  color: #414141;
  overflow-wrap: break-word;
  font-size: 18px;

  a {
    color: #0000b4; /* Set the desired color for links */
    text-decoration: underline;
  }
`;

const FaqItemTitle = styled.h3`
  font-size: 24px;
  font-weight: 400;
`;

const FurtherReadingButtonsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; // Center the buttons horizontally
  gap: 20px; // Add space between the buttons
  padding: 40px calc((100% - (255px * 3)) / 2);
  margin: 0 auto;
  max-width: 800px;
`;

// FAQ
type FaqElement = {
  id: number;
  title: string;
  content: string | JSX.Element;
};

type FaqData = FaqElement[];

const faq: FaqData = [
  {
    id: 1,
    title: 'Can anyone join the network?',
    content:
      'Yes, but after creating your HOPR Safe and funding it, you must wait to be given access to the network. You can only run a HOPR node within the latest version of the HOPR network.',
  },
  {
    id: 2,
    title: 'How much can I expect to earn running a HOPR node?',
    content: (
      <span>
        The amount of $HOPR earned will vary depending on your stake, the number of nodes in the network, your
        availability and how well-connected you are in the network. It's expected that the average node will earn an APY
        of 10-15%, but you can find a complete breakdown of the economic model of reward distribution and strategies to
        increase your share{' '}
        <a
          href="https://twitter.com/hoprnet/status/1696539901305790534"
          target="_blank"
          rel="noreferrer"
        >
          here.
        </a>
      </span>
    ),
  },
  {
    id: 3,
    title: 'How much do I need to stake to earn money?',
    content:
      'You need to stake a minimum of 30,000 wxHOPR to join the network (or 10,000 if you are a returning node runner with an access NFT). All node runners with reachable, connected nodes will earn wxHOPR tokens based on their stake.',
  },
  {
    id: 4,
    title: 'Can I use my HOPR boost NFTs to increase my earnings?',
    content:
      'All previous HOPR boost NFTs are no longer usable. Your earnings are purely dependent on the data relayed. However, you are still guaranteed to earn $HOPR if you run a HOPR node, as every connected node will be used to relay cover traffic. ',
  },
  {
    id: 5,
    title: 'What is HOPR?',
    content:
      'The HOPR network is an incentivized p2p mixnet where nodes are relay points for transferring data between users. Data is encrypted and mixed in between nodes so only the users at the source and destination of the data can know the source and destination and decrypt the data.',
  },
  {
    id: 6,
    title: 'What is the HOPR Safe?',
    content: (
      <span>
        The HOPR Safe is a smart contract wallet built using{' '}
        <a
          href="https://Safe.global/"
          target="_blank"
          rel="noreferrer"
        >
          Safe
        </a>
        . It allows you to store assets with complete security and spin up a HOPR node in order to earn tokens as a node
        runner. To create your own HOPR Safe, follow the instructions{' '}
        <a
          href="/staking/onboarding"
          target="_blank"
          rel="noreferrer"
        >
          here.
        </a>
      </span>
    ),
  },
];

const StakingLandingPage = () => {
  const navigate = useNavigate();
  const [expandedId, set_expandedId] = useState<number | false>(false);
  const [openWeb3Modal, set_openWeb3Modal] = useState(false);
  const status = useAppSelector((store) => store.web3.status);
  const onboardingStep = useAppSelector((store) => store.stakingHub.onboarding.step);

  const handleOnClose = () => {
    set_openWeb3Modal(false);
  };

  const handleAccordionClick = (id: number) => {
    set_expandedId((prevId) => {
      return prevId === id ? false : id;
    });
  };

  return (
    <>
      <Section
        center
        fullHeightMin
        gradient
      >
        <StartOnboarding />
        <ContinueOnboarding />
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
          <ConnectWeb3
            open={openWeb3Modal}
            onClose={handleOnClose}
          />

          {
            !status.connected && 
            <StyledButton
              onClick={() => set_openWeb3Modal(true)}
              disabled={status.connected}
            >
              CONNECT WALLET
            </StyledButton>
          }
          {
            status.connected && onboardingStep !== 16 &&
            <StyledButton
              onClick={() => {navigate('/staking/onboarding');}}
            >
              GO TO ONBOARDING
            </StyledButton>
          }
          {
            status.connected && onboardingStep === 16 &&
            <StyledButton
              onClick={()=>{navigate('/staking/dashboard')}}
              style={{maxWidth: '300px'}}
            >
              VIEW STAKING OVERVIEW
            </StyledButton>
          }

          <BrandsSection>
            <Brand>
              <BrandText>DEVELOPED USING</BrandText>
              <BrandImage>
                <a
                  href="https://safe.global/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/safe-icon2.svg" />
                </a>
              </BrandImage>
            </Brand>
            <Brand>
              <BrandText>RUNNING ON</BrandText>
              <BrandImage>
                <a
                  href="https://www.gnosis.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/gnosis-chain-logo.svg" />
                </a>
              </BrandImage>
            </Brand>
            <Brand>
              <BrandText>POWERED BY</BrandText>
              <BrandImage>
                <a
                  href="https://thegraph.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/the-graph-logo.svg" />
                </a>
              </BrandImage>
            </Brand>
          </BrandsSection>
          <br />
          <Title>Run a node, earn hopr</Title>
          <br />
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
                through our{' '}
                <a
                  href="https://docs.hoprnet.org/core/proof-of-relay"
                  target="_blank"
                  rel="noreferrer"
                >
                  proof-of-relay mechanism.
                </a>
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
                your funds at risk in case of a compromised node.
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
        darkGradient
      >
        <StyledContainer>
          <br />
          <WhiteTitle>Complete control over your funds & node</WhiteTitle>
          <BlueSideToSideContainer>
            <BlueTextSide>
              <WhiteMediumText>
                Use our interactive HOPR node admin interface to control, customize and track your node with ease.
              </WhiteMediumText>
              <WhiteSideTitle>Features</WhiteSideTitle>
              <WhiteSideDescription>
                &bull; View detailed real-time metrics
                <br />
                &bull; Manage, transfer and secure your funds in a few clicks
                <br />
                &bull; Directly access your node and all of its features
                <br />
                &bull; Easily manage requests and transactions
              </WhiteSideDescription>
            </BlueTextSide>
            <BlueImageSide>
              <img src="/assets/staking-hub-example.svg" />
            </BlueImageSide>
          </BlueSideToSideContainer>
          <Image src="/assets/create-you-hopr-safe-now.svg" />
          {
            !status.connected && 
            <BlueSectionButton
              onClick={() => set_openWeb3Modal(true)}
              disabled={status.connected}
            >
              CONNECT WALLET
            </BlueSectionButton>
          }
          {
            status.connected && onboardingStep !== 16 &&
            <BlueSectionButton
              onClick={() => {navigate('/staking/onboarding');}}
            >
              GO TO ONBOARDING
            </BlueSectionButton>
          }
          {
            status.connected && onboardingStep === 16 &&
            <BlueSectionButton
              onClick={()=>{navigate('/staking/dashboard')}}
              style={{maxWidth: '300px'}}
            >
              VIEW STAKING OVERVIEW
            </BlueSectionButton>
          }
          
        </StyledContainer>
      </Section>
      <Section
        center
        fullHeightMin
      >
        <StyledContainer>
          <br />
          <Title>How it works</Title>
          <SideToSideContainer>
            <TextSide>
              <SideTitle>Hopr Node</SideTitle>
              <SideDescription>
                Your HOPR node gives you complete access to the HOPR network's functionality and the ability to earn
                $HOPR from your staked tokens. Your node can request funds from your HOPR Safe to complete certain tasks
                and interact with other nodes on the network.
              </SideDescription>
            </TextSide>
            <ImageSide>
              <img src="/assets/hopr-node.svg" />
            </ImageSide>
          </SideToSideContainer>
          <SideToSideContainer>
            <ImageSide>
              <img src="/assets/safe-with-shadow.svg" />
            </ImageSide>
            <TextSide>
              <SideTitle>Hopr safe</SideTitle>
              <SideDescription>
                The HOPR Safe is a secured smart contract wallet built using{' '}
                <a
                  href="https://safe.global/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Safe (previously called Gnosis Safe).
                </a>{' '}
                Assets deposited into your HOPR Safe are secured by a customizable multisig, limiting exposure even when
                your HOPR node's private key gets compromised.
                <br />
                { <a
                  href="https://docs.hoprnet.org/staking/what-is-safestaking"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read more
                </a> }
              </SideDescription>
            </TextSide>
          </SideToSideContainer>
          <SideToSideContainer>
            <TextSide>
              <SideTitle>Payment Channels</SideTitle>
              <SideDescription>
                HORP payment channels are a scalable and privacy respecting way of incentivizing HOPR nodes for their
                service. Your node will automatically request tokens from your Safe to fund these channels. Run a
                well-connected node to maximize your earnings.
                <br />
                <a
                  href="https://docs.hoprnet.org/core/tickets-and-payment-channels"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read more
                </a>
              </SideDescription>
            </TextSide>
            <ImageSide>
              <img src="/assets/payment-channels.svg" />
            </ImageSide>
          </SideToSideContainer>
          <br />
          <BigTitle>FAQ</BigTitle>
          <StyledCard className={`Faq blue`}>
            {faq.map((faqItem) => (
              <StyledAccordion
                key={faqItem.id}
                expanded={expandedId === faqItem.id}
                onChange={() => handleAccordionClick(faqItem.id)}
              >
                <SAccordionSummary
                  className={`SAccordionSummary blue`}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <FaqItemTitle>{faqItem.title}</FaqItemTitle>
                </SAccordionSummary>
                <AccordionContent>
                  <Content>{faqItem.content}</Content>
                </AccordionContent>
              </StyledAccordion>
            ))}
          </StyledCard>
        </StyledContainer>
        <br />
      </Section>
      <Section
        center
        yellow
      >
        <br />
        <BigTitle>Further Reading</BigTitle>
        <br />
        <FurtherReadingButtonsSection>
          <FurtherReadingButton
            href="https://docs.hoprnet.org/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/assets/docs-icon.svg" />
            View Docs
          </FurtherReadingButton>
          <FurtherReadingButton
            href="https://docs.hoprnet.org/developers/safestaking-by-hopr#why-use-safe"
            target="_blank"
            rel="noreferrer"
          >
            Why use Safe?
          </FurtherReadingButton>
          <FurtherReadingButton
            href="https://docs.hoprnet.org/staking/why-use-safe "
            target="_blank"
            rel="noreferrer"
          >
            How to install
          </FurtherReadingButton>
          <br />
          <FurtherReadingButton
            href="https://docs.hoprnet.org/node/start-here"
            target="_blank"
            rel="noreferrer"
          >
            Buy Tokens
          </FurtherReadingButton>
          <FurtherReadingButton
            href="https://docs.hoprnet.org/developers/safestaking-by-hopr#architecture"
            target="_blank"
            rel="noreferrer"
          >
            How it works
          </FurtherReadingButton>
        </FurtherReadingButtonsSection>
        <MediumText>Still got questions? Contact us here.</MediumText>
        <br />
        <FurtherReadingButton
          href="https://docs.hoprnet.org/staking/what-is-safestaking"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/assets/telegram-icon.svg" />
          Telegram
        </FurtherReadingButton>
        <br />
        <br />
      </Section>
      <Footer newsletter />
    </>
  );
};

export default StakingLandingPage;
