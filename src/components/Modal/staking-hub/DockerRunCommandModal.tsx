import { useState, useEffect } from 'react';
import { DialogTitle, TextField, DialogActions, Alert } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../../store';
import { actionsAsync } from '../../../store/slices/node/actionsAsync';
import { appActions } from '../../../store/slices/app';
import CloseIcon from '@mui/icons-material/Close';
import { sendNotification } from '../../../hooks/useWatcher/notifications';
import CodeIcon from '@mui/icons-material/Code';

// HOPR Components
import IconButton from '../../../future-hopr-lib-components/Button/IconButton';
import AddAliasIcon from '../../../future-hopr-lib-components/Icons/AddAlias';
import Button from '../../../future-hopr-lib-components/Button';
import { CodeContainer } from '../../../pages/staking-hub/onboarding/step3/1setupYourNode';

type DockerRunCommandModalProps = {
  normalButton?: boolean,
  disabled?: boolean;
};

export const DockerRunCommandModal = (props: DockerRunCommandModalProps) => {
  const dispatch = useAppDispatch();
  const [duplicateAlias, set_duplicateAlias] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const safeAddress = useAppSelector((store) => store.stakingHub.onboarding.safeAddress);
  const moduleAddress = useAppSelector((store) => store.stakingHub.onboarding.moduleAddress);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  return (
    <>
      {
        props.normalButton ?
        <Button
          onClick={handleOpenModal}
          disabled={props.disabled}
        >
          Show
        </Button>
        :
        <IconButton
          iconComponent={<CodeIcon />}
          tooltipText={
            <span>
              SHOW
              <br />
              docker run command
            </span>
          }
          onClick={handleOpenModal}
          disabled={props.disabled}
        />
      }


      <SDialog
        open={openModal}
        onClose={handleCloseModal}
        disableScrollLock={true}
      >
        <TopBar>
          <DialogTitle>Docker</DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </SIconButton>
        </TopBar>
        <SDialogContent>
          <CodeContainer
            moduleAddress={moduleAddress}
            safeAddress={safeAddress}
          />
        </SDialogContent>
      </SDialog>
    </>
  );
};
