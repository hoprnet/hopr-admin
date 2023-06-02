import React, { useState, useEffect } from 'react';
import { Store } from '../types/index';

//Stores
import { useAppDispatch, useAppSelector } from '../store';
import { authActions, authActionsAsync } from '../store/slices/auth';
import { nodeActions, nodeActionsAsync } from '../store/slices/node';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';

function Section_Web3() {
  const safe = useAppSelector((store: Store) => store.safe);

  return (
    <Section
      className="Section--safe"
      id="Section--safe"
      yellow
    >
      SAFE REDUX STORE
      <pre>{JSON.stringify(safe, null, 4)}</pre>
    </Section>
  );
}

export default Section_Web3;
