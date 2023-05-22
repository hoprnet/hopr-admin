import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '../types/index'
import { authActions } from '../store/slices/auth';
import Section from '../future-hopr-lib-components/Section';
import Select from '../future-hopr-lib-components/Select'

function Section1() {
  const dispatch = useDispatch();
  const nodesSavedLocally = useSelector((store : Store) => store.auth.nodes).map((elem: any, index: number)=>
    {return {name: elem.ip, value: index, ip: elem.ip, apiKey: elem.apiKey}}
  );
  const [ip, set_ip] = useState('');
  const [apiKey, set_apiKey] = useState('');
  const [nodesSavedLocallyChosenIndex, set_nodesSavedLocallyChosenIndex] = useState('' as number | '');

  const useNodeAndSaveIt = () => {
    console.log({ip, apiKey});
    dispatch(authActions.useNodeData({ip, apiKey}));
    dispatch(authActions.addNodeData({ip, apiKey}));
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
      <br/>
      <button
        onClick={useNodeAndSaveIt}
        disabled={ip.length === 0 || apiKey.length === 0}
      >
        Use node
      </button>
    </Section>
  );
}

export default Section1;
