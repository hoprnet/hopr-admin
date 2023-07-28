import { useState } from 'react';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import { DialogTitle, MenuItem, Select } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

const WithdrawModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <button onClick={handleOpenModal}>Withdraw</button>
      <SDialog
        open={openModal}
        onClose={handleCloseModal}
      >
        <TopBar>
          <DialogTitle>Withdraw</DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </SIconButton>
        </TopBar>
        <SDialogContent>
          <Select>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
          </Select>
        </SDialogContent>
      </SDialog>
    </>
  );
};

export default WithdrawModal;
