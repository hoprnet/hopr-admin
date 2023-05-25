import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { Store } from '../types/index'
import { authActions, authActionsAsync } from '../store/slices/auth';
import { nodeActions, nodeActionsAsync } from '../store/slices/node';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import Select from '../future-hopr-lib-components/Select'
import Checkbox from '../future-hopr-lib-components/Toggles/Checkbox';

//MUI
import CircularProgress from '@mui/material/CircularProgress';


function Section1() {
  const dispatch = useAppDispatch();
  const nodesSavedLocally = useAppSelector((store : Store) => store.auth.nodes).map((elem: any, index: number)=>
    {return {name: elem.ip, value: index, ip: elem.ip, apiKey: elem.apiKey}}
  );
  const connecting = useAppSelector((store : Store) => store.auth.status.connecting);
  const connected = useAppSelector((store : Store) => store.auth.status.connected);

  return(
    <Section
      className="Section--selectNode"
      id="Section--selectNode"
      yellow
    >
     

    </Section>
  );
}

export default Section1;
