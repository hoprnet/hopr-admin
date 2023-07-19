import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { authActions } from '../../store/slices/auth';
import { nodeActions } from '../../store/slices/node';
import { appActions } from '../../store/slices/app';
import { Button, Menu, MenuItem } from '@mui/material';

const Container = styled.div`
  align-items: center;
  border-left: 1px lightgray solid;
  cursor: pointer;
  color: black;
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 59px;
  width: 240px;
  div {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
  & .image-container {
    height: 50px;
    margin-left: 8px;
    width: 50px;
    & img {
      height: 100%;
      width: 100%;
    }
  }
`;

const NodeButton = styled(Button)`
  min-width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #414141;
  gap: 10px;
  & p {
    margin: 0;
    font-size: 12px;
  }
  & .node-info {
    color: #414141;
    line-height: 12px;
  }
  &&.MuiButton-root {
    &:hover {
      background: none;
    }
  }
`;

const DropdownArrow = styled.img`
  align-self: center;
`;

const SLink = styled(Link)``;

export default function ConnectNode() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const connected = useAppSelector((store) => store.auth.status.connected);
  const peerId = useAppSelector((store) => store.node.addresses.hopr);
  const localName = useAppSelector((store) => store.auth.loginData.localName);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State variable to hold the anchor element for the menu

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(authActions.resetState());
    dispatch(nodeActions.resetState());
    dispatch(appActions.resetNodeState());
    dispatch(nodeActions.closeMessagesWebsocket());
    dispatch(nodeActions.closeLogsWebsocket());
    navigate('node/connect');
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
      if (anchorEl) {
        // If the menu is open, it means the user clicked outside the menu, so we should close it without disconnecting.
        handleCloseMenu();
      }
    }
  };

  return (
    <Container
      onClick={handleContainerClick}
      ref={containerRef}
    >
      <div className="image-container">
        <img src="/assets/hopr_logo.svg" />
      </div>
      {connected ? (
        <>
          <NodeButton disableRipple>
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
          >
            <MenuItem onClick={() => handleLogout()}>Disconnect</MenuItem>
          </Menu>
        </>
      ) : (
        <SLink to={'node/connect'}>
          <div>
            <NodeButton disableRipple>Connect to Node</NodeButton>
          </div>
        </SLink>
      )}
    </Container>
  );
}
