import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';

//Stores
import { authActions, authActionsAsync } from '../store/slices/auth';
import { nodeActionsAsync, nodeActions } from '../store/slices/node';
import { appActions } from '../store/slices/app';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import Select from '../future-hopr-lib-components/Select';
import Checkbox from '../future-hopr-lib-components/Toggles/Checkbox';

//MUI
import CircularProgress from '@mui/material/CircularProgress';
import { SelectChangeEvent } from '@mui/material/Select';

type ParsedNode = {
  name: string;
  localName: string;
  value: string;
  apiEndpoint: string;
  apiToken: string;
};

function Section1() {
  const dispatch = useAppDispatch();
  const nodesSavedLocally = useAppSelector((store) => store.auth.nodes);
  const [nodesSavedLocallyParsed, set_nodesSavedLocallyParsed] = useState([] as ParsedNode[]);
  const connecting = useAppSelector((store) => store.auth.status.connecting);
  const error = useAppSelector((store) => store.auth.status.error);
  const loginData = useAppSelector((store) => store.auth.loginData);

  const [searchParams, set_searchParams] = useSearchParams();
  const [localName, set_localName] = useState(loginData.localName ? loginData.localName : '');

  const [apiEndpoint, set_apiEndpoint] = useState(loginData.apiEndpoint ? loginData.apiEndpoint : '');
  const [apiToken, set_apiToken] = useState(loginData.apiToken ? loginData.apiToken : '');
  const [saveApiToken, set_saveApiToken] = useState(false);
  const [nodesSavedLocallyChosenIndex, set_nodesSavedLocallyChosenIndex] = useState('' as string);

  useEffect(() => {
    const parsed = nodesSavedLocally.map((node, index) => {
      return {
        name: node.localName ? `${node.localName} (${node.apiEndpoint})` : node.apiEndpoint,
        localName: node.localName,
        value: index.toString(),
        apiEndpoint: node.apiEndpoint,
        apiToken: node.apiToken,
      };
    }) as ParsedNode[];
    set_nodesSavedLocallyParsed(parsed);
  }, [nodesSavedLocally]);

  useEffect(() => {
    // Update the Select based on loginData from the Store
    if (!loginData.apiEndpoint) return;
    const existingItemIndex = nodesSavedLocally.findIndex((item: any) => item.apiEndpoint === loginData.apiEndpoint);
    if (existingItemIndex !== -1) set_nodesSavedLocallyChosenIndex(existingItemIndex.toString());
    const existingItem = nodesSavedLocally[existingItemIndex] as ParsedNode;
    if (existingItem && existingItem.apiToken.length > 0 && loginData.apiToken === existingItem.apiToken)
      set_saveApiToken(true);
  }, [loginData]);

  useEffect(() => {
    // Update the TextFields based on loginData from the Store
    if (loginData.apiEndpoint === apiEndpoint && loginData.apiToken === apiToken) return;
    const apiEndpointSP = searchParams.get('apiEndpoint');
    const apiTokenSP = searchParams.get('apiToken');
    if (!apiEndpointSP && !apiTokenSP) return;

    if (loginData.localName) {
      set_localName(loginData.localName);
    }
    if (loginData.apiEndpoint) {
      set_apiEndpoint(loginData.apiEndpoint);
    }
    if (loginData.apiToken) {
      set_apiToken(loginData.apiToken);
    }

    // If have have saved the node with the same apiToken, we check the saveApiToken checkbox
    const existingItemIndex = nodesSavedLocally.findIndex(
      (item) => item.apiEndpoint === loginData.apiEndpoint && item.apiToken === loginData.apiToken
    );

    if (
      existingItemIndex !== -1 &&
      nodesSavedLocally[existingItemIndex].apiToken &&
      (nodesSavedLocally[existingItemIndex].apiToken?.length ?? 0) > 0
    ) {
      set_saveApiToken(true);
    }
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

  const useNode = async () => {
    set_searchParams({
      apiToken,
      apiEndpoint,
    });

    dispatch(authActions.resetState());
    dispatch(nodeActions.resetState());
    dispatch(appActions.resetNodeState());
    dispatch(nodeActions.closeMessagesWebsocket());
    dispatch(nodeActions.closeLogsWebsocket());
    dispatch(
      authActions.useNodeData({
        apiEndpoint,
        apiToken,
        localName,
      })
    );
    const loginInfo = await dispatch(
      authActionsAsync.loginThunk({
        apiEndpoint,
        apiToken,
      })
    ).unwrap();
    if (loginInfo) {
      dispatch(
        nodeActionsAsync.getAddressesThunk({
          apiToken,
          apiEndpoint,
        })
      );
      dispatch(
        nodeActionsAsync.getInfoThunk({
          apiToken,
          apiEndpoint,
        })
      );
      dispatch(
        nodeActionsAsync.getAliasesThunk({
          apiToken,
          apiEndpoint,
        })
      );
      dispatch(nodeActions.initializeMessagesWebsocket());
      dispatch(nodeActions.initializeLogsWebsocket());
    }
  };

  const clearLocalNodes = () => {
    set_nodesSavedLocallyChosenIndex('');
    dispatch(authActions.clearLocalNodes());
  };

  const handleSelectlocalNodes = (event: SelectChangeEvent<unknown>) => {
    const index = event.target.value as string;
    const chosenNode = nodesSavedLocally[parseInt(index)] as ParsedNode;
    set_nodesSavedLocallyChosenIndex(index);
    set_apiEndpoint(chosenNode.apiEndpoint);
    set_apiToken(chosenNode.apiToken);
    set_saveApiToken(chosenNode.apiToken?.length > 0);
    set_localName(chosenNode.localName);
  };

  return (
    <Section
      className="Section--selectNode"
      id="Section--selectNode"
      yellow
    >
      <Select
        label={'Node credentials saved in browser local storage'}
        values={nodesSavedLocallyParsed}
        disabled={nodesSavedLocally.length === 0}
        value={nodesSavedLocallyChosenIndex}
        onChange={handleSelectlocalNodes}
        style={{ width: '100%' }}
        renderValue={(value) => {
          return '1';
        }}
      />
      <button
        disabled={nodesSavedLocally.length === 0}
        onClick={clearLocalNodes}
      >
        Clear node credentials from the browser local storage
      </button>
      <br />
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
      <br />
      <button
        onClick={saveNode}
        disabled={apiEndpoint.length === 0}
      >
        Save node credentials in browser local storage
      </button>
      <button
        onClick={useNode}
        disabled={apiEndpoint.length === 0 || apiToken.length === 0}
      >
        Connect to the node
      </button>
      <br />
      {connecting && <CircularProgress />}
      <span>{error}</span>
    </Section>
  );
}

export default Section1;
