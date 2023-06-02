import React, { useState, useEffect } from 'react';
import { Store } from '../types/index';

//Stores
import { useAppDispatch, useAppSelector } from '../store';
import { web3Actions } from '../store/slices/web3';
import { actionsAsync as web3ActionsAsync } from '../store/slices/web3/actionsAsync';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';

import ConnectWeb3 from '../components/ConnectWeb3';

function Section_Web3() {
  const dispatch = useAppDispatch();
  const web3 = useAppSelector((store: Store) => store.web3);

  return (
    <Section className="Section--web3" id="Section--web3" yellow>
      WEB3 REDUX STORE
      <pre>{JSON.stringify(web3, null, 4)}</pre>
    </Section>
  );
}

export default Section_Web3;
