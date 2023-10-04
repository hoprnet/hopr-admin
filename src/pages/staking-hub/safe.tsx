import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { useEthersSigner } from '../../hooks';
import { observePendingSafeTransactions } from '../../hooks/useWatcher/safeTransactions';
import { Address, formatEther } from 'viem';
import { appActions } from '../../store/slices/app';
import { HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, HOPR_NODE_SAFE_REGISTRY, HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../config'
import { erc20ABI, useContractRead, useWalletClient } from 'wagmi';
import { web3 } from '@hoprnet/hopr-sdk';
import { nodeManagementModuleAbi } from '../../abi/nodeManagementModuleAbi';
import { MAX_UINT256, createApproveTransactionData, createIncludeNodeTransactionData, encodeDefaultPermissions } from '../../utils/blockchain'

//Stores
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { stakingHubActionsAsync } from '../../store/slices/stakingHub';

function SafeSection() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((store) => store.safe);
  const stakingHub = useAppSelector((store) => store.stakingHub);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const safesByOwner = useAppSelector((store) => store.safe.safesByOwner.data);
  const allTransactions = useAppSelector((store) => store.safe.allTransactions.data);
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);
  const safeModules = useAppSelector((state) => state.safe.info.data?.modules);
  const { account } = useAppSelector((store) => store.web3);
  const signer = useEthersSigner();
  const { data: walletClient } = useWalletClient();
  const [threshold, set_threshold] = useState(1);
  const [owners, set_owners] = useState('');
  const [nodeAddress, set_nodeAddress] = useState('');
  const [includeNodeResponse, set_includeNodeResponse] = useState('');
  const [safeAddressForRegistry, set_safeAddressForRegistry] = useState('');
  const [nodeAddressForRegistry, set_nodeAddressForRegistry] = useState('');
  const activePendingSafeTransaction = useAppSelector(
    (store) => store.app.configuration.notifications.pendingSafeTransaction,
  );

  const { data: allowanceData } = useContractRead({
    address: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [selectedSafeAddress, HOPR_CHANNELS_SMART_CONTRACT_ADDRESS],
    enabled: !!selectedSafeAddress,
  });

  const { data: isNodeResponse } = useContractRead({
    address: safeModules ? (safeModules.at(0) as Address) : '0x',
    abi: nodeManagementModuleAbi,
    functionName: 'isNode',
    args: [nodeAddress],
    enabled: !!safeModules?.at(0) && !!nodeAddress && !!includeNodeResponse,
    watch: true,
  });

  const { data: isNodeSafeRegistered } = useContractRead({
    address: HOPR_NODE_SAFE_REGISTRY,
    abi: web3.hoprNodeSafeRegistryABI,
    functionName: 'isNodeSafeRegistered',
    args: [
      {
        safeAddress: safeAddressForRegistry,
        nodeChainKeyAddress: nodeAddressForRegistry,
      },
    ],
    enabled: !!safeAddressForRegistry && !!nodeAddressForRegistry,
    watch: true,
  });

  useEffect(() => {
    fetchInitialStateForSigner();
  }, [signer]);

  const fetchInitialStateForSigner = async () => {
    if (signer) {
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
      lightBlue
      fullHeightMin
    >
      <h1>Safe</h1>
      <h2>existing safes</h2>
      {safesByOwner.map((safeAddress) => (
        <button
          key={safeAddress}
          onClick={() => {
            if (signer) {
              dispatch(appActions.resetState());
              observePendingSafeTransactions({
                dispatch,
                active: activePendingSafeTransaction,
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
              safeActionsAsync.createVanillaSafeWithConfigThunk({
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
        create vanilla safe with config
      </button>
      <button
        onClick={() => {
          if (walletClient) {
            dispatch(
              safeActionsAsync.createSafeWithConfigThunk({
                config: {
                  owners: owners.split(','),
                  threshold,
                },
                walletClient,
              }),
            );
          }
        }}
      >
        EXPERIMENTAL: create safe with config
      </button>
      <h2>add node to node module</h2>
      <label htmlFor="nodeAddress">node address</label>
      <input
        id="nodeAddress"
        value={nodeAddress}
        type="text"
        onChange={(event) => {
          set_nodeAddress(event.target.value);
        }}
      />
      <button
        disabled={!selectedSafeAddress}
        onClick={() => {
          if (signer && selectedSafeAddress) {
            dispatch(
              safeActionsAsync.getSafeInfoThunk({
                safeAddress: selectedSafeAddress,
                signer,
              }),
            );
          }
        }}
      >
        get info for recently created safe
      </button>
      <button
        disabled={!safeModules?.length}
        onClick={() => {
          if (signer && selectedSafeAddress && safeModules && safeModules.at(0) && nodeAddress) {
            dispatch(
              safeActionsAsync.createAndExecuteContractTransactionThunk({
                smartContractAddress: safeModules.at(0) as Address,
                data: createIncludeNodeTransactionData(encodeDefaultPermissions(nodeAddress)),
                safeAddress: selectedSafeAddress,
                signer,
              }),
            )
              .unwrap()
              .then((transactionResult) => {
                set_includeNodeResponse(transactionResult);
              });
          }
        }}
      >
        EXPERIMENTAL: add node to module
      </button>
      <span>is Node: {JSON.stringify(isNodeResponse)}</span>
      <h2>registerNodeAndSafeToNRThunk</h2>
      <label htmlFor="safeAddressForRegistry">safe Address</label>
      <input
        id="safeAddressForRegistry"
        value={safeAddressForRegistry}
        type="text"
        onChange={(event) => {
          set_safeAddressForRegistry(event.target.value);
        }}
      />
      <label htmlFor="">node Address</label>
      <input
        id="nodeAddressForRegistry"
        value={nodeAddressForRegistry}
        type="text"
        onChange={(event) => {
          set_nodeAddressForRegistry(event.target.value);
        }}
      />
      <button
        disabled={!safeAddressForRegistry || !nodeAddressForRegistry}
        onClick={() => {
          if (walletClient && safeAddressForRegistry && nodeAddressForRegistry) {
            dispatch(
              stakingHubActionsAsync.registerNodeAndSafeToNRThunk({
                safeAddress: safeAddressForRegistry,
                nodeAddress: nodeAddressForRegistry,
                walletClient,
              }),
            );
          }
        }}
      >
        Register Node And Safe To NR
      </button>
      <h2>create tx proposal to yourself on selected safe</h2>
      <button
        disabled={!selectedSafeAddress}
        onClick={async () => {
          if (selectedSafeAddress && signer) {
            const signerAddress = await signer.getAddress();
            dispatch(
              safeActionsAsync.createSafeTransactionThunk({
                safeAddress: selectedSafeAddress,
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
      <h2>is safe registered</h2>
      <label htmlFor="safeAddressForRegistry">safe Address</label>
      <input
        id="safeAddressForRegistry"
        value={safeAddressForRegistry}
        type="text"
        onChange={(event) => {
          set_safeAddressForRegistry(event.target.value);
        }}
      />
      <label htmlFor="">node Address</label>
      <input
        id="nodeAddressForRegistry"
        value={nodeAddressForRegistry}
        type="text"
        onChange={(event) => {
          set_nodeAddressForRegistry(event.target.value);
        }}
      />
      <span>is safe registered: {JSON.stringify(isNodeSafeRegistered)}</span>

      <h2>transactions actions</h2>
      {allTransactions?.results.map((transaction, key) => (
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
                      safeActionsAsync.executePendingTransactionThunk({
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
        disabled={!selectedSafeAddress || !signer}
        onClick={() => {
          if (signer && selectedSafeAddress) {
            dispatch(
              safeActionsAsync.createSafeContractTransaction({
                data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, MAX_UINT256),
                signer,
                safeAddress: selectedSafeAddress,
                smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
              }),
            );
          }
        }}
      >
        set to max and approve
      </button>
      <h2>safe store</h2>
      <pre>{JSON.stringify(safe, null, 4)}</pre>
      <h2>Staking Hub store</h2>
      <pre>{JSON.stringify(stakingHub, null, 4)}</pre>
    </Section>
  );
}

export default SafeSection;
