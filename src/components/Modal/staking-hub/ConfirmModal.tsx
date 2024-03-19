import React from 'react';
import styled from '@emotion/styled';
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
      margin-top: 16px;;
      padding-inline: 2rem;
      height: 43px;
    }
  }
`;

type ConfirmModalProps = {
  open?: boolean,
  confirmButton?: JSX.Element,
  onConfirm?: Function,
  onNotConfirm: Function,
  confirmText?: string,
  notConfirmText?: string,
  timer?: number,
  title?: string | JSX.Element,
  description?: string | JSX.Element,
};

const ConfirmModal = (props: ConfirmModalProps) => {

  const handleNotConfirm = () => {
    props.onNotConfirm();
  };

  const handleConfirm = () => {
    props.onConfirm && props.onConfirm();
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
            {
              props.confirmButton ?
              props.confirmButton
              :
              <Button
                onClick={handleConfirm}
              >
                {props.confirmText}
              </Button>
            }
          </div>
        </Content>
      </SDialog>
    </>
  );
};

export default ConfirmModal;
