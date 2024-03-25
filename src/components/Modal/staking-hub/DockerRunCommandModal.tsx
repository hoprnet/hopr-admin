import { useState } from 'react';
import { DialogTitle } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import { useAppSelector } from '../../../store';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';

// HOPR Components
import IconButton from '../../../future-hopr-lib-components/Button/IconButton';
import Button from '../../../future-hopr-lib-components/Button';
import { CodeContainer } from '../../../pages/staking-hub/onboarding/step3/1setupYourNode';

type DockerRunCommandModalProps = {
  normalButton?: boolean;
  disabled?: boolean;
};

export const DockerRunCommandModal = (props: DockerRunCommandModalProps) => {
  const [openModal, setOpenModal] = useState(false);
  const safeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress);
  const moduleAddress = useAppSelector((store) => store.safe.selectedSafe.data.moduleAddress);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      {props.normalButton ? (
        <Button
          onClick={handleOpenModal}
          disabled={props.disabled}
        >
          Show
        </Button>
      ) : (
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
      )}

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
          <span style={{ fontSize: '15px' }}>
            <span style={{ fontWeight: 500 }}>YOUR_SECURITY_TOKEN:</span> Fill in a password that you will be using when
            connecting to your node
            <br />
            <br />
            <span style={{ fontWeight: 500 }}>YOUR_PUBLIC_IP:</span> Fill in the public IP of the machine on which the
            node will be reachable
            <br />
            <br />
            <span style={{ fontWeight: 500 }}>CUSTOM_RPC_PROVIDER:</span> Fill in the custom RPC provider, please follow{' '}
            <a
              href="https://docs.hoprnet.org/node/start-here#understanding-rpc-importance-and-setting-up-your-own-custom-rpc-provider"
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#007bff',
                textDecoration: 'underline',
              }}
            >
              the guideline in our docs
            </a>
          </span>
          <br />
          <CodeContainer
            moduleAddress={moduleAddress}
            safeAddress={safeAddress}
          />
        </SDialogContent>
      </SDialog>
    </>
  );
};
