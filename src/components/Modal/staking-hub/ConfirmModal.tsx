import React from 'react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { DialogTitle } from '@mui/material';
import Button from '../../../future-hopr-lib-components/Button';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import CloseIcon from '@mui/icons-material/Close';
import { stakingHubActions } from '../../../store/slices/stakingHub';

const Content = styled(SDialogContent)`
  gap: 1rem;
  div {
    display: flex;
    justify-content: center;
    gap: 16px;
    button {
      margin-top: 16px;;
      padding-inline: 2rem;
    }
  }
`;

type ConfirmModalProps = {
  open?: boolean,
  onConfirm: Function,
  onNotConfirm: Function,
  confirmText?: string,
  notConfirmText?: string,
  title?: string,
  description?: string,
};

const ConfirmModal = (props: ConfirmModalProps) => {

  const handleNotConfirm = () => {
    props.onNotConfirm();
  };

  const handleConfirm = () => {
    props.onNotConfirm();
  };

  return (
    <>
      <SDialog
        open={props.open}
        disableScrollLock={true}
      >
        <TopBar>
          <DialogTitle>{props.title}</DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleNotConfirm}
          >
            <CloseIcon />
          </SIconButton>
        </TopBar>
        <Content>
          <p>{props.description}</p>
          <div>
            <Button
              onClick={handleNotConfirm}
              outlined
            >
              {props.notConfirmText}
            </Button>
            <Button
              onClick={handleConfirm}
            >
              {props.confirmText}
            </Button>
          </div>
        </Content>
      </SDialog>
    </>
  );
};

export default ConfirmModal;
