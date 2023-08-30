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
  & button {
    align-self: center;
    padding-inline: 2rem;
  }
`;

type WithdrawModalProps = {
  initialCurrency?: 'HOPR' | 'NATIVE';
};

const ContinueOnboarding = ({ initialCurrency }: WithdrawModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notFinished = useAppSelector((state) => state.stakingHub.onboarding.notFinished);
  const [openModal, set_openModal] = useState(false);

  useEffect(() => {
    if (notFinished) handleOpenModal();
    else handleCloseModal();
  }, [notFinished]);

  const handleOpenModal = () => {
    set_openModal(true);
  };

  const handleCloseModal = () => {
    set_openModal(false);
  };

  return (
    <>
      <SDialog
        open={openModal}
        onClose={handleCloseModal}
        disableScrollLock={true}
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
          <p>Looks like we ran into an unexpected error. Would you like to try again?</p>
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
          >
            YES
          </Button>
        </Content>
      </SDialog>
    </>
  );
};

export default ContinueOnboarding;
