import { useEffect, useState } from 'react';

//Stores
import { useAppDispatch, useAppSelector } from '../store';
import { safeActionsAsync } from '../store/slices/safe';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import { useEthersSigner } from '../hooks';
import { utils } from 'ethers';
import { observePendingSafeTransactions } from '../hooks/useWatcher/safeTransactions';
import { appActions } from '../store/slices/app';
import { Address, encodeFunctionData, formatEther } from 'viem';
import { erc20ABI, useContractRead } from 'wagmi';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';
import { HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, HOPR_TOKEN_SMART_CONTRACT_ADDRESS } from '../../config';

// Maximum possible value for uint256
const MAX_UINT256 = BigInt(2 ** 256) - BigInt(1);


function SafeSection() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((store) => store.safe);
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);
  const { account } = useAppSelector((store) => store.web3);
  const signer = useEthersSigner();
  const [threshold, set_threshold] = useState(1);
  const [owners, set_owners] = useState('');

  const { data: allowanceData } = useContractRead({
    address: HOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [safe.selectedSafeAddress as Address, HOPR_CHANNELS_SMART_CONTRACT_ADDRESS],
  });

  useEffect(() => {
    fetchInitialStateForSigner();
  }, [signer]);

  const fetchInitialStateForSigner = async () => {
    if (signer) {
      dispatch(safeActionsAsync.getSafesByOwnerThunk({ signer }));
    }
  };

  const createApproveTransactionData = (spender: Address, value: bigint) => {
    const approveData = encodeFunctionData({
      abi: erc20ABI,
      functionName: 'approve',
      args: [spender, value],
    });
    return approveData;
  };

  const proposeApproveTransactionToSafe = async () => {
    if (signer && safe.selectedSafeAddress) {
      const data = createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, MAX_UINT256);
      // creates a safe transaction with data to interact with a smart contract
      const safeTransactionData: SafeTransactionDataPartial = {
        to: HOPR_TOKEN_SMART_CONTRACT_ADDRESS,
        data,
        value: '0',
      };
      await dispatch(
        safeActionsAsync.createSafeTransactionThunk({
          signer,
          safeAddress: safe.selectedSafeAddress,
          safeTransactionData,
        }),
      ).unwrap();
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
      lightBlue
      fullHeightMin
    >
      <h1>Safe</h1>
      <h2>existing safes</h2>
      {safe.safesByOwner.map((safeAddress) => (
        <button
          key={safeAddress}
          onClick={() => {
            if (signer) {
              dispatch(appActions.resetState());
              observePendingSafeTransactions({
                dispatch,
                previousState: prevPendingSafeTransaction,
                selectedSafeAddress: safeAddress,
                signer,
                updatePreviousData: (newData) => {
                  dispatch(appActions.setPrevPendingSafeTransaction(newData));
                },
              });
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
              dispatch(
                safeActionsAsync.getSafeDelegatesThunk({
                  signer,
                  options: { safeAddress },
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
      <h2>approve hopr token to hopr channels</h2>
      <span>allowance: {formatEther(BigInt(allowanceData?.toString() ?? '0'))}</span>
      <button
        disabled={!safe.selectedSafeAddress || !signer}
        onClick={proposeApproveTransactionToSafe}
      >
        approve
      </button>
      <h2>store</h2>
      <pre>{JSON.stringify(safe, null, 4)}</pre>
    </Section>
  );
}

export default SafeSection;
