import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { Store } from '../types/index';

//Stores
import { authActions, authActionsAsync } from '../store/slices/auth';
import { nodeActions, nodeActionsAsync } from '../store/slices/node';

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
      name: elem.localName ?  elem.localName : elem.apiEndpoint,
      localName: elem.localName,
      value: index,
      apiEndpoint: elem.apiEndpoint,
      apiToken: elem.apiToken,
    };
  });
  const connecting = useAppSelector(
    (store: Store) => store.auth.status.connecting
  );
  const connected = useAppSelector(
    (store: Store) => store.auth.status.connected
  );

  const [localName, set_localName] = useState('');
  const [apiEndpoint, set_apiEndpoint] = useState('');
  const [apiToken, set_apiToken] = useState('');
  const [saveApiToken, set_saveApiToken] = useState(false);
  const [nodesSavedLocallyChosenIndex, set_nodesSavedLocallyChosenIndex] = useState('' as number | '');

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
    dispatch(authActions.useNodeData({ apiEndpoint, apiToken }));
    dispatch(
      authActions.addNodeData({
        apiEndpoint,
        apiToken: saveApiToken ? apiToken : '',
        localName: localName ? localName : '',
      })
    );
    dispatch(authActionsAsync.loginThunk({ apiEndpoint, apiToken }));
    dispatch(nodeActionsAsync.getInfoThunk({ apiToken, apiEndpoint }));
    dispatch(nodeActionsAsync.getAddressesThunk({ apiToken, apiEndpoint }));
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
          console.log('onChange')
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
