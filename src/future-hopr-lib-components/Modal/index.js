
import * as React from 'react';
import styled from "@emotion/styled";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';


import { Row } from '../Atoms/row'

import CloseIcon from '@mui/icons-material/Close';



const SDialog = styled(Dialog)`
  .MuiPaper-root{
    max-width: 395px;
    width: 100%;
    padding: 16px;
    font-family: 'Source Code Pro';
    font-style: normal;
    .modal-title {
      font-weight: 600;
    }
  }
`

const Content = styled.div`
  
`


export default function SimpleDialog(props) {
    const { onClose, selectedValue, open, title, children } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    return (
      <SDialog 
        onClose={handleClose} 
        open={open}
      >
        <Row>
            <div className='modal-title'>{title}</div>
            <IconButton 
              color="primary" 
              aria-label="close modal" 
              onClick={handleClose} 
            >
              <CloseIcon />
            </IconButton>
        </Row>
        <Content>
          {children}
        </Content>
      </SDialog>
    );
  }