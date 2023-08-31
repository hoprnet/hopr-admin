import { useState } from 'react';

//Stores
import { useAppSelector } from '../../../../store';

// HOPR Components
import Section from '../../../../future-hopr-lib-components/Section';

import OwnersAndConfirmations from './ownersAndConfirmations';
import FundsToSafe from './fundsToSafe';
import SafeDeployed from './safeDeployed';
import { useWalletClient } from 'wagmi';

function SafeOnboarding() {
  const account = useAppSelector((store) => store.web3.account) as `0x${string}`;
  const { data: walletClient } = useWalletClient();
  const [step, set_step] = useState(0);

  if (!account) {
    return (
      <Section
        className="Section--safe"
        id="Section--safe"
        yellow
        fullHeightMin
      >
        <h2>connect signer</h2>
      </Section>
    );
  }

  switch (step) {
  case 0:
    return (
      <Section
        center
        fullHeightMin
        lightBlue
      >
        <OwnersAndConfirmations
          account={account}
          walletClient={walletClient}
          set_step={set_step}
        />
      </Section>
    );
  case 1:
    return (
      <Section
        center
        fullHeightMin
        lightBlue
      >
        <FundsToSafe
          account={account}
          set_step={set_step}
        />
      </Section>
    );
  case 2:
    return (
      <Section
        center
        fullHeightMin
        lightBlue
      >
        <SafeDeployed />
      </Section>
    );
  default:
    return <></>;
  }
}

export default SafeOnboarding;
