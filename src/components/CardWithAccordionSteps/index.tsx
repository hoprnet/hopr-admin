import { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { web3Actions } from '../../store/slices/web3';

// HOPR Components
import Button from '../../future-hopr-lib-components/Button';

// Mui
import { Accordion, AccordionDetails, AccordionSummary, Card } from '@mui/material';

const SafeSideToSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #e8f6fa;
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
    /* flex-direction: column;
    flex: 3;
    max-width: 600px;
    h2 {
      color: #414141;
      font-size: 50px;
      font-weight: 400;
      margin-block: 0rem;
      text-transform: uppercase;
      text-align: left;
      text-align: center; */
    /* } */
  }
  .ImageSide {
    align-items: center;
    flex: 1;
    max-width: 100%;
    height: 420px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 320px) {
      height: 310px;
      img {
        max-width: 200px;
      }
    }

    @media screen and (min-width: 321px) and (max-width: 560px) {
      height: 310px;
      margin: auto;
      img {
        max-width: 250px;
      }
    }
  }
`;

const BlueSectionButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;

  @media screen and (min-width: 200px) and (max-width: 320) {
    min-height: 100px;
  }
`;

const SafeCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 405px;
  font-size: 12px;
  border-radius: 1rem;
  margin-right: 0px;
  margin-left: 30px;
  padding: 8px;
  box-shadow: none;
  background-color: #e8f6fa;
  /* border-radius: 60px; */
  gap: 0.5rem;

  @media screen and (min-width: 200px) and (max-width: 319px) {
    margin: auto;
    padding: 8px;
    max-width: 200px;
  }

  @media screen and ((min-width: 320px) and (max-width: 1024px)) {
    margin: auto;
  }
`;

const SafeAccordion = styled(Accordion)`
  box-shadow: none;
  border: 2px solid #000050;
  margin: 0;
  background-color: #e8f6fa;
  border-radius: 2rem !important;
  padding: 0rem 0.5rem;
  overflow: hidden;

  &::before {
    display: none;
  }

  &.MuiPaper-root-MuiAccordion-root-SafeAccordion:first-of-type,
  &.MuiPaper-root-MuiAccordion-root-SafeAccordion:last-of-type {
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
    border-bottom-right-radius: 5rem;
    border-bottom-left-radius: 5rem;
  }

  &.MuiPaper-root-MuiAccordion-root-SafeAccordion:first-of-type.Mui-expanded,
  &.MuiPaper-root-MuiAccordion-root-SafeAccordion:last-of-type.Mui-expanded {
    margin: 0;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    border-bottom-right-radius: 2rem;
    border-bottom-left-radius: 2rem;
  }

  &.Mui-expanded {
    margin: 0;
    /* border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    border-bottom-right-radius: 2rem;
    border-bottom-left-radius: 2rem; */
  }
`;

const SafeAccordionSummary = styled(AccordionSummary)`
  /* border-bottom: 2px solid #414141; */
  /* padding: 0; */
  background-color: #e8f6fa;

  &.Mui-expanded {
    min-height: 48px;
  }

  .MuiAccordionSummary-content,
  .MuiAccordionSummary-content.Mui-expanded {
    margin: 4px 2px;
  }

  & .MuiAccordionSummary-expandIconWrapper.Mui-expanded {
    transform: rotate(0) !important;
    -webkit-transform: rotate(0) !important;
  }
`;

const SafeTitle = styled.h3`
  color: #000050;
  font-weight: 400;
  font-size: 26px;
  margin: 0;
`;

const MainTitle = styled.h2`
  color: #414141;
  font-size: 60px;
  font-weight: 400;
  margin-block: 0rem;
  text-transform: uppercase;
  padding-bottom: 3rem;

  @media screen and (max-width: 320px) {
    min-width: 100px;
    max-width: 320px;
    font-size: 30px;
  }

  @media screen and (min-width: 321px) and (max-width: 560px) {
    max-width: 321px;
    font-size: 30px;
  }
`;

const SafeAccordionContent = styled(AccordionDetails)`
  margin: 0;
`;

const CreateSafeContainer = styled.div`
  background-color: #e8f6fa;
  border-radius: 4rem;
  padding: 4rem;

  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  width: 100%;

  @media screen and (max-width: 320px) {
    max-width: 320px;
  }

  @media screen and (min-width: 321px) and (max-width: 560px) {
    max-width: 321px;
  }
`;

const SafeContent = styled.div`
  color: #000050;
  overflow-wrap: break-word;
  font-size: 18px;
  text-align: left;
`;

const StyledButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;
`;

export default function CardWithAccordionSteps() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector((store) => store.web3.status);
  const onboardingStep = useAppSelector((store) => store.stakingHub.onboarding.step);

  const [expandedId, set_expandedId] = useState<number | false>(0);
  const [imageSrc, set_imageSrc] = useState<string>('/assets/get-ready.svg');

  const handleAccordionClick = (id: number) => {
    set_expandedId(id);
    setImageById(id);
  };

  const setImageById = (id: number) => {
    switch (id) {
      case 0:
        set_imageSrc('/assets/get-ready.svg');
        break;
      case 1:
        set_imageSrc('/assets/create-safe.svg');
        break;
      case 2:
        set_imageSrc('/assets/move-funds.svg');
        break;
      case 3:
        set_imageSrc('/assets/HOPR_Node_Adming_with_plus.svg');
        break;
      default:
        break;
    }
  };

  return (
    <CreateSafeContainer>
      <MainTitle>Create your Hopr safe now!</MainTitle>
      <SafeSideToSideContainer>
        <SafeCard>
          <SafeAccordion
            key={0}
            expanded={expandedId === 0}
            onChange={() => handleAccordionClick(0)}
          >
            <SafeAccordionSummary
              className={`SafeAccordionSummary`}
              expandIcon={<img src="/assets/1create-safe.svg" />}
            >
              <SafeTitle>GET READY</SafeTitle>
            </SafeAccordionSummary>
            <SafeAccordionContent>
              <SafeContent>Connect your wallet and make sure you have enough wxHOPR.</SafeContent>
            </SafeAccordionContent>
          </SafeAccordion>
          <SafeAccordion
            key={1}
            expanded={expandedId === 1}
            onChange={() => handleAccordionClick(1)}
          >
            <SafeAccordionSummary
              className={`SafeAccordionSummary`}
              expandIcon={<img src="/assets/2create-safe.svg" />}
            >
              <SafeTitle>CREATE Safe</SafeTitle>
            </SafeAccordionSummary>
            <SafeAccordionContent>
              <SafeContent>Deploy your new HOPR safe and configure who has access.</SafeContent>
            </SafeAccordionContent>
          </SafeAccordion>
          <SafeAccordion
            key={2}
            expanded={expandedId === 2}
            onChange={() => handleAccordionClick(2)}
          >
            <SafeAccordionSummary
              className={`SafeAccordionSummary`}
              expandIcon={<img src="/assets/3create-safe.svg" />}
            >
              <SafeTitle>MOVE FUNDS</SafeTitle>
            </SafeAccordionSummary>
            <SafeAccordionContent>
              <SafeContent>Fund your Safe with the xDAI and wxHOPR your node will need.</SafeContent>
            </SafeAccordionContent>
          </SafeAccordion>
          <SafeAccordion
            key={3}
            expanded={expandedId === 3}
            onChange={() => handleAccordionClick(3)}
          >
            <SafeAccordionSummary
              className={`SafeAccordionSummary`}
              expandIcon={<img src="/assets/4create-safe.svg" />}
            >
              <SafeTitle>ADD NODE</SafeTitle>
            </SafeAccordionSummary>
            <SafeAccordionContent>
              <SafeContent>Use your Safe to spin up a new HOPR node, and start earning $HOPR!</SafeContent>
            </SafeAccordionContent>
          </SafeAccordion>
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
            <BlueSectionButton
              onClick={() => {
                navigate('/staking/onboarding');
              }}
            >
              GO TO ONBOARDING
            </BlueSectionButton>
          )}
          {status.connected && onboardingStep === 16 && (
            <BlueSectionButton
              onClick={() => {
                navigate('/staking/dashboard');
              }}
              style={{ maxWidth: '300px' }}
            >
              VIEW STAKING OVERVIEW
            </BlueSectionButton>
          )}
        </SafeCard>
        <div className="ImageSide">
          <img src={imageSrc} />
        </div>
      </SafeSideToSideContainer>
    </CreateSafeContainer>
  );
}
