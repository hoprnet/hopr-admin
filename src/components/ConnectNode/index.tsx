import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';

// Components
import Modal from './modal';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { authActions } from '../../store/slices/auth';
import { nodeActions } from '../../store/slices/node';
import { appActions } from '../../store/slices/app';

//MUI
import { Button, Menu, MenuItem, CircularProgress } from '@mui/material';

const Container = styled(Button)`
  align-items: center;
  border-left: 1px lightgray solid;
  cursor: pointer;
  color: black;
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 59px;
  width: 240px;
  border-radius: 0;
  div {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
  .image-container {
    height: 50px;
    margin-left: 8px;
    width: 50px;
    img {
      height: 100%;
      width: 100%;
    }
  }
`;

const NodeButton = styled.div`
  font-family: 'Source Code Pro';
  min-width: 150px;
  display: flex;
  flex-direction: row !important;
  align-items: center;
  color: #414141;
  gap: 10px;
  text-align: left;
  p {
    margin: 0;
    font-size: 12px;
  }
  .node-info {
    color: #414141;
    line-height: 12px;
  }
`;

const DropdownArrow = styled.img`
  align-self: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #000050;
  gap: 32px;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.78);
  z-index: 10000;
`;

export default function ConnectNode() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modalVisible, set_modalVisible] = useState(false);
  const connected = useAppSelector((store) => store.auth.status.connected);
  const connecting = useAppSelector((store) => store.auth.status.connecting);
  const error = useAppSelector((store) => store.auth.status.error);
  const peerId = useAppSelector((store) => store.node.addresses.data.hopr);
  const localName = useAppSelector((store) => store.auth.loginData.localName);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State variable to hold the anchor element for the menu

  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as HTMLElement)) {
        handleCloseMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (error) set_modalVisible(true);
  }, [error]);

  const handleLogout = () => {
    dispatch(authActions.resetState());
    dispatch(nodeActions.resetState());
    dispatch(appActions.resetNodeState());
    dispatch(nodeActions.closeMessagesWebsocket());
    dispatch(nodeActions.closeLogsWebsocket());
    navigate('/');
  };

  // New function to handle opening the menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // New function to handle closing the menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLElement>) => {
    if (connected) {
      handleOpenMenu(event);
    } else {
      handleModalOpen();
      if (anchorEl) {
        // If the menu is open, it means the user clicked outside the menu, so we should close it without disconnecting.
        handleCloseMenu();
      }
    }
  };

  const handleModalClose = () => {
    set_modalVisible(false);
  };

  const handleModalOpen = () => {
    set_modalVisible(true);
  };

  return (
    <>
      <Container
        onClick={handleContainerClick}
        ref={containerRef}
      >
        <div className="image-container">
          <img src="/assets/hopr_logo.svg" />
        </div>
        {connected ? (
          <>
            <NodeButton>
              <p className="node-info">
                {peerId && `${peerId.substring(0, 6)}...${peerId.substring(peerId.length - 8, peerId.length)}`}
              </p>
              <div className="dropdown-icon">
                <DropdownArrow src="/assets/dropdown-arrow.svg" />
              </div>
            </NodeButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              MenuListProps={{
                'aria-labelledby': 'connect-node-menu-button',
                className: 'connect-node-menu-list',
              }}
            >
              <MenuItem onClick={handleModalOpen}>Change node</MenuItem>
              <MenuItem onClick={() => handleLogout()}>Disconnect</MenuItem>
            </Menu>
          </>
        ) : (
          <div>
            <NodeButton>Connect to Node</NodeButton>
          </div>
        )}
      </Container>
      <Modal
        open={!connecting && modalVisible}
        handleClose={handleModalClose}
      />
      {connecting && (
        <Overlay>
          <CircularProgress />
          Connecting to Node
        </Overlay>
      )}
    </>
  );
}
