import { useEffect } from 'react';
import { Store } from '../types/index';

//Stores
import { useAppDispatch, useAppSelector } from '../store';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import { useSigner } from '../hooks';
import { actionsAsync } from '../store/slices/safe/actionsAsync';
import { useWalletClient } from 'wagmi';

function SafeSection() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((store: Store) => store.safe);
  const { signer } = useSigner();

  useEffect(() => {
    if (signer) {
      dispatch(actionsAsync.getSafesByOwnerThunk({ signer }));
    }
  }, [signer]);
  return (
    <Section className="Section--safe" id="Section--safe" yellow>
      SAFE REDUX STORE
      <pre>{JSON.stringify(safe, null, 4)}</pre>
    </Section>
  );
}

export default SafeSection;
