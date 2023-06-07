import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouteObject, useSearchParams, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { Store } from '../types/index';

//Stores
import { authActions, authActionsAsync } from '../store/slices/auth';
import node, { nodeActionsAsync, nodeActions } from '../store/slices/node';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import Select from '../future-hopr-lib-components/Select';
import Checkbox from '../future-hopr-lib-components/Toggles/Checkbox';

//MUI
import CircularProgress from '@mui/material/CircularProgress';

function Section1() {
  const dispatch = useAppDispatch();
  const nodesSavedLocally = useAppSelector(
    (store: Store) => store.auth.nodes
  ).map((elem: any, index: number) => {
    return {
      name: elem.localName ?  `${elem.localName} (${elem.apiEndpoint})` : elem.apiEndpoint,
      localName: elem.localName,
      value: index,
      apiEndpoint: elem.apiEndpoint,
      apiToken: elem.apiToken,
    };
  });
  const connecting = useAppSelector((store: Store) => store.auth.status.connecting);
  const connected = useAppSelector((store: Store) => store.auth.status.connected);
  const loginData = useAppSelector((store: Store) => store.auth.loginData);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [localName, set_localName] = useState(loginData.localName ? loginData.localName : '');
  const [apiEndpoint, set_apiEndpoint] = useState(loginData.apiEndpoint ? loginData.apiEndpoint : '');
  const [apiToken, set_apiToken] = useState(loginData.apiToken ? loginData.apiToken : '');
  const [saveApiToken, set_saveApiToken] = useState(loginData.apiToken ? true : false);
  const [nodesSavedLocallyChosenIndex, set_nodesSavedLocallyChosenIndex] = useState('' as number | '');

  useEffect(()=>{
    // Update the Select based on loginData from the Store
    if(!loginData.apiEndpoint) return;
    const existingItem = nodesSavedLocally.findIndex((item: any) => (item.apiEndpoint === loginData.apiEndpoint));
    console.log(existingItem, nodesSavedLocally[existingItem])
    if (existingItem !== -1) set_nodesSavedLocallyChosenIndex(existingItem);
  }, [loginData, nodesSavedLocally]);

  useEffect(()=>{
    // Update the TextFields based on loginData from the Store
    if(loginData.apiEndpoint === apiEndpoint && loginData.apiToken === apiToken) return;
    const apiEndpointSP = searchParams.get('apiEndpoint');
    const apiTokenSP = searchParams.get('apiToken');
    if(!apiEndpointSP && !apiTokenSP) return;

    set_localName(loginData.localName);
    set_apiEndpoint(loginData.apiEndpoint);
    set_apiToken(loginData.apiToken);

    // If have have saved the node with the same apiToken, we check the saveApiToken checkbox
    const existingItem = nodesSavedLocally.findIndex((item: any) => (item.apiEndpoint === loginData.apiEndpoint && item.apiToken === loginData.apiToken));
    if (existingItem !== -1 && nodesSavedLocally[existingItem].apiToken && nodesSavedLocally[existingItem]?.apiToken.length > 0 ) set_saveApiToken(true);
  }, [loginData]);

  const saveNode = () => {
    dispatch(
      authActions.addNodeData({
        apiEndpoint,
        apiToken: saveApiToken ? apiToken : '',
        localName: localName ? localName : '',
      })
    );
  };

  const useNode = () => {
    dispatch(authActions.resetState());
    dispatch(nodeActions.resetState());
    dispatch(authActions.useNodeData({ apiEndpoint, apiToken, localName }));
    dispatch(authActionsAsync.loginThunk({ apiEndpoint, apiToken }));
    dispatch(nodeActionsAsync.getAddressesThunk({ apiToken, apiEndpoint }));
    dispatch(nodeActionsAsync.getInfoThunk({ apiToken, apiEndpoint }))
      .unwrap()
      .then(() => {
        dispatch(nodeActions.initializeWebsocket());
      });
    setSearchParams({ apiToken, apiEndpoint });
  };

  const clearLocalNodes = () => {
    set_nodesSavedLocallyChosenIndex('');
    dispatch(authActions.clearLocalNodes());
  };

  return (
    <Section className="Section--selectNode" id="Section--selectNode" yellow>
      <Select
        label={'nodesSavedLocally'}
        values={nodesSavedLocally}
        disabled={nodesSavedLocally.length === 0}
        value={nodesSavedLocallyChosenIndex}
        onChange={(event) => {
          const index = event.target.value as number;
          const chosenNode = nodesSavedLocally[index];
          set_nodesSavedLocallyChosenIndex(index);
          set_apiEndpoint(chosenNode.apiEndpoint);
          set_apiToken(chosenNode.apiToken);
          set_localName(chosenNode.localName);
          set_saveApiToken(chosenNode.apiToken && chosenNode.apiToken.length > 0)
        }}
        style={{ width: '100%' }}
      />
      <button
        disabled={nodesSavedLocally.length === 0}
        onClick={clearLocalNodes}
      >
        Clear local nodes
      </button>
      <br/>
      Local name:
      <input
        value={localName}
        onChange={(event) => {
          set_localName(event.target.value);
        }}
        style={{ width: '100%' }}
      ></input>
      apiEndpoint*:
      <input
        value={apiEndpoint}
        onChange={(event) => {
          set_apiEndpoint(event.target.value);
        }}
        style={{ width: '100%' }}
      ></input>
      apiToken*:
      <input
        value={apiToken}
        onChange={(event) => {
          set_apiToken(event.target.value);
        }}
        style={{ width: '100%' }}
      ></input>
      <Checkbox
        label={'Save API Key locally (unsafe)'}
        value={saveApiToken}
        onChange={(event) => {
          set_saveApiToken(event.target.checked);
        }}
      />
      <br/>
      <button onClick={saveNode} disabled={apiEndpoint.length === 0}>
        Save node locally
      </button>
      <button
        onClick={useNode}
        disabled={apiEndpoint.length === 0 || apiToken.length === 0}
      >
        Use node
      </button>
      {connecting && <CircularProgress />}
    </Section>
  );
}

export default Section1;
