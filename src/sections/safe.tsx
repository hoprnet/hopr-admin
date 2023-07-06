import { useEffect, useState } from 'react';

//Stores
import { useAppDispatch, useAppSelector } from '../store';
import { safeActionsAsync, safeActions } from '../store/slices/safe';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import { useEthersSigner } from '../hooks';
import { utils } from 'ethers';
function SafeSection() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((store) => store.safe);
  const { account } = useAppSelector((store) => store.web3);
  const signer = useEthersSigner();
  const [threshold, set_threshold] = useState(1);
  const [owners, set_owners] = useState('');

  useEffect(() => {
    fetchInitialStateForSigner();
  }, [signer]);

  const fetchInitialStateForSigner = async () => {
    if (signer) {
      dispatch(safeActions.resetState());
      dispatch(safeActionsAsync.getSafesByOwnerThunk({ signer }));
    }
  };

  if (!account) {
    return (
      <Section
        className="Section--safe"
        id="Section--safe"
        yellow
      >
        <h2>connect signer</h2>
      </Section>
    );
  }

  return (
    <Section
      className="Section--safe"
      id="Section--safe"
      yellow
    >
      <h1>Safe</h1>
      <h2>existing safes</h2>
      {safe.safesByOwner.map((safeAddress) => (
        <button
          key={safeAddress}
          onClick={() => {
            if (signer) {
              dispatch(
                safeActionsAsync.getSafeInfoThunk({
                  signer,
                  safeAddress,
                }),
              );
              dispatch(
                safeActionsAsync.getAllSafeTransactionsThunk({
                  signer,
                  safeAddress,
                }),
              );
            }
          }}
        >
          click to get info from {safeAddress}
        </button>
      ))}
      <h2>create new safe</h2>
      <label htmlFor="threshold">threshold</label>
      <input
        id="threshold"
        value={threshold}
        type="number"
        onChange={(event) => {
          set_threshold(Number(event.target.value));
        }}
      />
      <label htmlFor="owners">owners</label>
      <input
        id="owners"
        style={{ width: '100%' }}
        placeholder="account addresses separated with ,"
        value={owners}
        onChange={(event) => {
          set_owners(event.target.value);
        }}
      />
      <button
        onClick={() => {
          if (signer) {
            dispatch(
              safeActionsAsync.createSafeWithConfigThunk({
                config: {
                  owners: owners.split(','),
                  threshold,
                },
                signer,
              }),
            );
          }
        }}
      >
        create safe with config
      </button>
      <button
        onClick={() => {
          if (signer) {
            dispatch(safeActionsAsync.createSafeThunk({ signer }));
          }
        }}
      >
        create new default safe
      </button>
      <h2>create tx proposal to yourself on selected safe</h2>
      <button
        disabled={!safe.selectedSafeAddress}
        onClick={async () => {
          if (safe.selectedSafeAddress && signer) {
            const signerAddress = await signer.getAddress();
            dispatch(
              safeActionsAsync.createSafeTransactionThunk({
                safeAddress: safe.selectedSafeAddress,
                signer,
                safeTransactionData: {
                  value: utils.parseEther('0.001').toString(),
                  to: signerAddress,
                  data: '0x',
                },
              }),
            );
          }
        }}
      >
        create tx proposal
      </button>
      <h2>transactions actions</h2>
      {safe.allTransactions?.results.map((transaction, key) => (
        <div key={key}>
          <p>
            {transaction.txType} {transaction.to}
          </p>
          {transaction.txType === 'MULTISIG_TRANSACTION' ? (
            transaction.confirmationsRequired === transaction.confirmations?.length ? (
              <button
                onClick={() => {
                  if (signer) {
                    dispatch(
                      safeActionsAsync.executeTransactionThunk({
                        signer,
                        safeAddress: transaction.safe,
                        safeTransaction: transaction,
                      }),
                    );
                  }
                }}
              >
                execute
              </button>
            ) : (
              <button
                onClick={() => {
                  if (signer) {
                    dispatch(
                      safeActionsAsync.confirmTransactionThunk({
                        signer,
                        safeAddress: transaction.safe,
                        safeTransactionHash: transaction.safeTxHash,
                      }),
                    );
                  }
                }}
              >
                confirm
              </button>
            )
          ) : null}
        </div>
      ))}
      <h2>store</h2>
      <pre>{JSON.stringify(safe, null, 4)}</pre>
    </Section>
  );
}

export default SafeSection;
