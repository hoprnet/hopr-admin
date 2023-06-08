import { useEffect } from 'react';

//Stores
import { useAppDispatch, useAppSelector } from '../store';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import { useSigner } from '../hooks';
import { actionsAsync } from '../store/slices/safe/actionsAsync';
import { utils } from "ethers"
function SafeSection() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((store) => store.safe);
  const { signer } = useSigner();

  useEffect(() => {
    if (signer) {
      dispatch(actionsAsync.getSafesByOwnerThunk({ signer }));
    }
  }, [signer]);

  return (
    <Section className="Section--safe" id="Section--safe" yellow>
      <h1>SAFE REDUX STORE</h1>
      <pre>{JSON.stringify(safe, null, 4)}</pre>
      <h1>
        exiting safes
      </h1>
      {safe.safesByOwner.map(safeAddress => (
        <button key={safeAddress} onClick={() => {
          if (signer) {
            dispatch(actionsAsync.getSafeInfoThunk({ signer, safeAddress }))
            dispatch(actionsAsync.getAllSafeTransactionsThunk({ signer, safeAddress }))
          }
        }}>click to get info from {safeAddress}</button>
      ))}
      <h1>
        create new safe
      </h1>
      <button onClick={() => {
        if (signer) {
          dispatch(actionsAsync.createSafeThunk({ signer }))
        }
      }}>create new default safe</button>
      <h1>create tx proposal to yourself on selected safe</h1>
      <button disabled={!safe.selectedSafeAddress} onClick={async () => {
        if (safe.selectedSafeAddress && signer) {
          const signerAddress = await signer.getAddress();
          dispatch(actionsAsync.createSafeTransactionThunk({
            safeAddress: safe.selectedSafeAddress, signer, safeTransactionData: {
              value: utils.parseEther("0.001").toString(),
              to: signerAddress,
              data: "0x",
            }
          }))
        }
      }}>create tx proposal</button>
    </Section>
  );
}

export default SafeSection;
