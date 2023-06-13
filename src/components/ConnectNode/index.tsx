import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { authActions } from '../../store/slices/auth';
import { nodeActions } from '../../store/slices/node';

const Container = styled.div`
  height: 59px;
  width: 160px;
  color: black;
  border-left: 1px lightgray solid;
  div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const SLink = styled(Link)``;

export default function ConnectNode() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const connected = useAppSelector((store) => store.auth.status.connected);
  const peerId = useAppSelector((store) => store.sdk.addresses.hopr);
  const localName = useAppSelector((store) => store.auth.loginData.localName);

  const handleLogout = () => {
    dispatch(authActions.resetState());
    dispatch(nodeActions.resetState());
    navigate('node/connect');
  };

  return (
    <Container>
      {connected ? (
        <div>
          {peerId && `${peerId.substr(0, 6)}...${peerId.substr(-8)}`}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <SLink to={'node/connect'}>
          <div>
            <button
              onClick={() => {
                navigate('node/connect');
              }}
            >
              Connect to Node
            </button>
          </div>
        </SLink>
      )}
    </Container>
  );
}
