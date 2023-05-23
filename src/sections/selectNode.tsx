import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { Store } from '../types/index'
import { authActions, login } from '../store/slices/auth';


// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import Select from '../future-hopr-lib-components/Select'
import Checkbox from '../future-hopr-lib-components/Toggles/Checkbox';

//MUI
import CircularProgress from '@mui/material/CircularProgress';


function Section1() {
  const dispatch = useAppDispatch();
  const nodesSavedLocally = useSelector((store : Store) => store.auth.nodes).map((elem: any, index: number)=>
    {return {name: elem.ip, value: index, ip: elem.ip, apiKey: elem.apiKey}}
  );
  const connecting = useSelector((store : Store) => store.auth.status.connecting);
  const connected = useSelector((store : Store) => store.auth.status.connected);

  const [ip, set_ip] = useState('');
  const [apiKey, set_apiKey] = useState('');
  const [saveApiKey, set_saveApiKey] = useState(false);
  const [nodesSavedLocallyChosenIndex, set_nodesSavedLocallyChosenIndex] = useState('' as number | '');

  const useNodeAndSaveIt = () => {
    dispatch(authActions.useNodeData({ip, apiKey}));
    dispatch(authActions.addNodeData({ip, apiKey: saveApiKey ? apiKey : ''}));
    dispatch(login({ip, apiKey}))
  };

  const clearLocalNodes = () => {
    set_nodesSavedLocallyChosenIndex('');
    dispatch(authActions.clearLocalNodes());
  };

  return (
    <Section
      className="Section--selectNode"
      id="Section--selectNode"
      yellow
    >
      <Select
        label={'nodesSavedLocally'}
        values={nodesSavedLocally}
        disabled={nodesSavedLocally.length === 0}
        value={nodesSavedLocallyChosenIndex}
        onChange={event=> {
          const index = event.target.value as number
          const chosenNode = nodesSavedLocally[index];
          set_nodesSavedLocallyChosenIndex(index);
          set_ip(chosenNode.ip);
          set_apiKey(chosenNode.apiKey);
        }}
        style={{width:'100%'}}
      />
      <button
        disabled={nodesSavedLocally.length === 0}
        onClick={clearLocalNodes}
      >
        Clear local nodes
      </button>
      IP: 
      <input
        value={ip}
        onChange={(event)=>{set_ip(event.target.value)}}
        style={{width:'100%'}}
      >
      </input>
      API key:
      <input
        value={apiKey}
        onChange={(event)=>{set_apiKey(event.target.value)}}
        style={{width:'100%'}}
      >
      </input>
      <Checkbox 
        label={'Save API Key locally'}
        value={saveApiKey}
        onChange={(event)=>{set_saveApiKey(event.target.checked)}}
      />
      <button
        onClick={useNodeAndSaveIt}
        disabled={ip.length === 0 || apiKey.length === 0}
      >
        Use node
      </button>
      {/* TODO: Add 'save' button */}
      {
        connecting && 
        <CircularProgress />
      }

    </Section>
  );
}

export default Section1;
