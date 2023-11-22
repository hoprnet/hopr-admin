import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from '@emotion/styled';

// HOPR Components
import Brick from '../../future-hopr-lib-components/Brick';
import Button from '../../future-hopr-lib-components/Button';
import ContinueOnboarding from '../../components/Modal/staking-hub/ContinueOnboarding';
import CardWithAccordionSteps from '../../components/CardWithAccordionSteps';
import Footer from '../../future-hopr-lib-components/Layout/footer';
import Section from '../../future-hopr-lib-components/Section';
import StartOnboarding from '../../components/Modal/staking-hub/StartOnboarding';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { web3Actions } from '../../store/slices/web3';

// Mui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Chip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledContainer = styled.div`
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1080px;
  width: 100%;
  padding: 2rem;
`;

const ImageContainer = styled.div`
  margin: 0 auto;
  position: relative;
  justify-content: center;
  display: flex;
  top: -35px;
  .staking-landing {
    position: absolute;
    height: 80%;
    top: 40px;
  }

  @media screen and (max-height: 1079px) {
    max-height: 315px;
    margin-bottom: -20px;
    .staking-landing {
      top: 20px;
    }
    .yellow-ellipse {
      height: inherit;
    }
  }

  @media screen and (min-height: 1080px) {
    .staking-landing {
      top: 20px;
    }
  }
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
  text-align: center;
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
  &.reverse {
    flex-direction: row-reverse;
  }
  margin-bottom: 2rem;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
  &.evenSplit {
    .TextSide {
      flex: 1;
    }
  }
  .TextSide {
    display: flex;
    flex-direction: column;
    flex: 3;
    max-width: 600px;
    h2 {
      color: #414141;
      font-size: 50px;
      font-weight: 400;
      margin-block: 0rem;
      text-transform: uppercase;
      text-align: left;
      text-align: center;
    }
  }
  .ImageSide {
    align-items: center;
    flex: 1;
    max-width: 100%;
  }
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
  color: #ffffff !important;
  font-size: 50px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  text-align: left;
`;

const WhiteSideDescription = styled.ul`
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
  flex-wrap: wrap;
  margin: 45px 0 65px 0;

  @media screen and (max-height: 768px) {
    margin: -20px 0 -40px 0;
  }

  @media screen and (min-height: 769px) and (max-height: 1080px) {
    margin: 20px 0 65px 0;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
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
  margin-bottom: 24px;
`;

const WhiteTitle = styled.h2`
  color: #ffffff;
  font-size: 60px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  margin-top: 2rem;
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

const StakingLandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [expandedId, set_expandedId] = useState<number | false>(false);
  const status = useAppSelector((store) => store.web3.status);
  const onboardingStep = useAppSelector((store) => store.stakingHub.onboarding.step);

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
              className="staking-landing"
              src="/assets/staking-landing.svg"
            />
            <Image
              className="yellow-ellipse"
              src="/assets/yellow-ellipse.svg"
            />
          </ImageContainer>
          <Title>HOPR STAKING HUB</Title>
          <Description>
            Earn $HOPR while providing web3 users with the data privacy and autonomy Web 2.0 never did. Create your HOPR
            safe and start running a node now!
          </Description>
          {!status.connected && (
            <StyledButton
              onClick={() => {
                dispatch(web3Actions.setModalOpen(true));
              }}
              disabled={status.connected}
            >
              CONNECT WALLET
            </StyledButton>
          )}
          {status.connected && onboardingStep !== 16 && (
            <StyledButton
              onClick={() => {
                navigate('/staking/onboarding');
              }}
            >
              GO TO ONBOARDING
            </StyledButton>
          )}
          {status.connected && onboardingStep === 16 && (
            <StyledButton
              onClick={() => {
                navigate('/staking/dashboard');
              }}
              style={{ maxWidth: '300px' }}
            >
              VIEW STAKING OVERVIEW
            </StyledButton>
          )}

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
            <div className="ImageSide">
              <img src="/assets/HOPR_Node_staking.svg" />
            </div>
            <div className="TextSide">
              <h2>
                <BlueText>&lt;Earn&gt;</BlueText> $Hopr
                <br />
                to relay data
              </h2>
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
            </div>
          </SideToSideContainer>
          <SideToSideContainer className="reverse">
            <div className="ImageSide">
              <img src="/assets/hopr_tokens.svg" />
            </div>
            <div className="TextSide">
              <h2>
                Store funds with <BlueText>&lt;complete security&gt;</BlueText>
              </h2>
              <SideDescription>
                We compartmentalize access to your funds and node through our unique key management protocol, minimizing
                your funds at risk in case of a compromised node.
              </SideDescription>
            </div>
          </SideToSideContainer>
          <SideToSideContainer>
            <div className="ImageSide">
              <img src="/assets/web3-private.svg" />
            </div>
            <div className="TextSide">
              <h2>
                Make web3 <BlueText>&lt;private&gt;</BlueText>
              </h2>
              <SideDescription>
                Every node on the HOPR mixnet serves as a point to relay data and anonymize traffic sent across the
                network. As such, every node not only earns you $HOPR for the data you relay, but contributes to
                providing web3 with a truly decentralized and private transport layer.
              </SideDescription>
            </div>
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
          <SideToSideContainer>
            <div className="TextSide">
              <WhiteMediumText>
                Use our interactive HOPR node admin interface to control, customize and track your node with ease.
              </WhiteMediumText>
              <WhiteSideTitle>Features</WhiteSideTitle>
              <WhiteSideDescription>
                <li>View detailed real-time metrics</li>
                <li>Manage, transfer and secure your funds in a few clicks</li>
                <li>Directly access your node and all of its features</li>
                <li>Easily manage requests and transactions</li>
              </WhiteSideDescription>
            </div>
            <img
              style={{ maxWidth: '100%' }}
              src="/assets/staking-hub-example.svg"
            />
          </SideToSideContainer>
          <CardWithAccordionSteps />
        </StyledContainer>
      </Section>
      <Section
        center
        fullHeightMin
      >
        <StyledContainer>
          <br />
          <Title>How it works</Title>
          <Brick
            noShadow
            title="Hopr Node"
            image="/assets/hopr-node.svg"
            text="Your HOPR node gives you complete access to the HOPR network's functionality and the ability to earn $HOPR from your staked tokens. Your node can request funds from your HOPR Safe to complete certain tasks and interact with other nodes on the network."
          />
          <Brick
            reverse
            noShadow
            title="Hopr safe"
            image="/assets/safe-with-shadow.svg"
            text={
              <>
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
                {
                  <a
                    href="https://docs.hoprnet.org/staking/what-is-safestaking"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read more
                  </a>
                }
              </>
            }
          />
          <Brick
            noShadow
            title="Payment Channels"
            image="/assets/payment-channels.svg"
            text={
              <>
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
              </>
            }
          />
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
            href="https://docs.hoprnet.org/staking/why-use-safe"
            target="_blank"
            rel="noreferrer"
          >
            Why use Safe?
          </FurtherReadingButton>
          <FurtherReadingButton
            href="https://docs.hoprnet.org/node/start-here"
            target="_blank"
            rel="noreferrer"
          >
            How to install
          </FurtherReadingButton>
          <br />
          <FurtherReadingButton
            href="https://docs.hoprnet.org/staking/how-to-get-hopr"
            target="_blank"
            rel="noreferrer"
          >
            Buy Tokens
          </FurtherReadingButton>
          <FurtherReadingButton
            href="https://docs.hoprnet.org/staking/what-is-safestaking"
            target="_blank"
            rel="noreferrer"
          >
            How it works
          </FurtherReadingButton>
        </FurtherReadingButtonsSection>
        <MediumText>Still got questions? Contact us here.</MediumText>
        <br />
        <FurtherReadingButton
          href="https://t.me/hoprnet"
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

export default StakingLandingPage;
