import React from 'react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { DialogTitle } from '@mui/material';
import Button from '../../../future-hopr-lib-components/Button';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import CloseIcon from '@mui/icons-material/Close';

const Content = styled(SDialogContent)`
  gap: 1rem;
  div {
    display: flex;
    justify-content: center;
    gap: 16px;
    button {
      padding-inline: 2rem;
    }
  }
`;

type WithdrawModalProps = {
  initialCurrency?: 'HOPR' | 'NATIVE';
};

const ContinueOnboarding = ({ initialCurrency }: WithdrawModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notFinished = useAppSelector((state) => state.stakingHub.onboarding.notFinished);
  const onboardingStep = useAppSelector((state) => state.stakingHub.onboarding.step);
  const isConnected = useAppSelector((state) => state.web3.status.connected);
  const [openModal, set_openModal] = useState(false);

  useEffect(() => {
    if (notFinished && isConnected) handleOpenModal();
    else handleCloseModal();
  }, [notFinished, isConnected]);

  const handleOpenModal = () => {
    set_openModal(true);
  };

  const handleCloseModal = () => {
    set_openModal(false);
  };

  const whichContinueToShow = () => {
    switch(onboardingStep){
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return 'option2' // Option 2: Safe funded, no node on the waitlist
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return 'option3' // Option 3: Whitelisted
      default:
        return 'option1' // Option 1: Safe not funded
    }
  };


  return (
    <SDialog
      open={openModal}
      onClose={handleCloseModal}
      disableScrollLock={true}
      maxWidth={'620px'}
    >
      <TopBar>
        <DialogTitle>CONTINUE YOUR ON-BOARDING</DialogTitle>
        <SIconButton
          aria-label="close modal"
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </SIconButton>
      </TopBar>
      <Content>
        {
          whichContinueToShow() === 'option1' &&
          <>
            <p>It looks like you didn't finish your onboarding. Would you like to continue?</p>
            <div>
              <Button
                onClick={handleCloseModal}
                outlined
              >
                NOT NOW
              </Button>
              <Button
                onClick={() => {
                  navigate(`/staking/onboarding`);
                }}
                style={{width: '160px'}}
              >
                YES
              </Button>
            </div>
          </>
        }
        {
          whichContinueToShow() === 'option2' &&
          <>
            <p>If you have already filled out a waitlist form, please await confirmation of your node's waitlisting. If you haven't filled out a waitlist form yet, please do so now.</p>
            <div>
              <Button
                outlined
                href={`https://cryptpad.fr/form/#/2/form/view/7TwSgsF+CnW-aw24uyPlE4Gej3DX-jjeYmyk9-Q-6RQ/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                FILL WHITELIST
              </Button>
              <Button
                outlined
                href={`https://cryptpad.fr/sheet/#/2/sheet/view/NYbRDH+C993dfHwEL1RyyKNtxG5pRoOaxtI4hbRVUBw/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                SEE WHITELIST
              </Button>
              <Button
                onClick={() => {
                  navigate(`/staking/dashboard`);
                }}
                style={{width: '160px'}}
              >
                DASHBOARD
              </Button>
            </div>
          </>
        }
        {
          whichContinueToShow() === 'option3' &&
          <>
            <p>Congratulations! Your node has been waitlisted. You can now complete the onboarding page!</p>
            <div>
              <Button
                onClick={handleCloseModal}
                outlined
              >
                NOT NOW
              </Button>
              <Button
                onClick={() => {
                  navigate(`/staking/onboarding`);
                }}
                style={{width: '160px'}}
              >
                PROCEED
              </Button>
            </div>
          </>
        }
      </Content>
    </SDialog>
  );
};

export default ContinueOnboarding;
