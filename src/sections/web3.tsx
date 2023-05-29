import React, { useState, useEffect } from 'react';
import { Store } from '../types/index';

//Stores
import { useAppDispatch, useAppSelector } from '../store';
import { authActions, authActionsAsync } from '../store/slices/auth';
import { nodeActions, nodeActionsAsync } from '../store/slices/node';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';

function Section_Web3() {
  const web3 = useAppSelector((store: Store) => store.web3);

  return (
    <Section className="Section--web3" id="Section--web3" yellow>
      WEB3 REDUX STORE
      <pre>{JSON.stringify(web3, null, 4)}</pre>
    </Section>
  );
}

export default Section_Web3;
