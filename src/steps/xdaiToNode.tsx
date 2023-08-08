//Stores
import { useAppDispatch, useAppSelector } from '../store';

// Libraries
import styled from '@emotion/styled';

// MUI
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// components
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import Section from '../future-hopr-lib-components/Section';
import { useEthersSigner } from '../hooks';
import { safeActionsAsync } from '../store/slices/safe';
import Card from '../components/Card';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { getUserActionForPendingTransaction, getUserCanSkipProposal } from '../utils/safeTransactions';
import { useAccount } from 'wagmi';

const StyledForm = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  border-bottom: 1px solid #414141;
`;

const StyledInstructions = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

const StyledText = styled.h3`
  color: var(--414141, #414141);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

const StyledDescription = styled.p`
  color: #414141;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.35px;
`;

const StyledInputGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const StyledCoinLabel = styled.p`
  color: var(--414141, #414141);
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

const StyledButtonGroup = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  outline: 2px solid #000050;
  line-height: 30px;
  border-radius: 20px;
  padding: 0.2rem 4rem;
`;

const StyledBlueButton = styled(Button)`
  text-transform: uppercase;
  padding: 0.2rem 4rem;
`;

const StyledPendingSafeTransactions = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledApproveButton = styled(Button)`
  align-self: flex-start;
  text-transform: uppercase;
`;

function XdaiToNode() {
  const dispatch = useAppDispatch();
  // injected states
  const pendingTransactions = useAppSelector((state) => state.safe.pendingTransactions);
  const safeInfo = useAppSelector((state) => state.safe.info);
  const selectedSafeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);
  const { native: nodeNativeAddress } = useAppSelector((state) => state.node.addresses);
  const { address } = useAccount();
  // local states
  const [userCanSkipProposal, set_userCanSkipProposal] = useState(false);
  const [userAction, set_userAction] = useState<'EXECUTE' | 'SIGN' | null>(null);
  const [xdaiValue, set_xdaiValue] = useState<string>('');
  const [isProposalLoading, set_isProposalLoading] = useState<boolean>();
  const [isExecutionLoading, set_isExecutionLoading] = useState<boolean>();
  const [proposedTxHash, set_proposedTxHash] = useState<string>();
  const [proposedTx, set_proposedTx] = useState<SafeMultisigTransactionResponse>();

  const signer = useEthersSigner();

  useEffect(() => {
    if (proposedTxHash) {
      const foundProposedTx = pendingTransactions?.results.find((tx) => tx.safeTxHash === proposedTxHash);
      if (foundProposedTx && address) {
        set_proposedTx(foundProposedTx);
        set_userAction(getUserActionForPendingTransaction(foundProposedTx, address));
      }
    }
  }, [pendingTransactions, proposedTxHash, address]);

  useEffect(() => {
    set_userCanSkipProposal(getUserCanSkipProposal(safeInfo));
  }, [safeInfo]);

  const proposeTx = () => {
    if (signer && Number(xdaiValue) && selectedSafeAddress && nodeNativeAddress) {
      set_isProposalLoading(true);
      dispatch(
        safeActionsAsync.createSafeTransactionThunk({
          signer,
          safeAddress: selectedSafeAddress,
          safeTransactionData: {
            to: nodeNativeAddress,
            value: parseUnits(xdaiValue as `${number}`, 18).toString(),
            data: '0x',
          },
        }),
      )
        .unwrap()
        .then((safeTxHash) => {
          set_proposedTxHash(safeTxHash);
          set_isProposalLoading(false);
        })
        .catch(() => {
          set_isProposalLoading(false);
        });
    }
  };

  const executeTx = () => {
    if (proposedTxHash && signer && selectedSafeAddress) {
      const safeTx = pendingTransactions?.results.find((tx) => {
        if (tx.safeTxHash === proposedTxHash) {
          return true;
        }
        return false;
      });
      if (safeTx) {
        dispatch(
          safeActionsAsync.executePendingTransactionThunk({
            safeAddress: selectedSafeAddress,
            signer,
            safeTransaction: safeTx,
          }),
        );
      }
    }
  };

  const createAndExecuteTx = () => {
    if (!signer || !Number(xdaiValue) || !selectedSafeAddress || !nodeNativeAddress) return;
    set_isExecutionLoading(true);

    dispatch(
      safeActionsAsync.createAndExecuteTransactionThunk({
        signer,
        safeAddress: selectedSafeAddress,
        safeTransactionData: {
          to: nodeNativeAddress,
          value: parseUnits(xdaiValue as `${number}`, 18).toString(),
          data: '0x',
        },
      }),
    )
      .unwrap()
      .then(() => {
        set_isExecutionLoading(false);
      })
      .catch(() => {
        set_isExecutionLoading(false);
      });
  };

  const getErrorsForSafeTx = ({ customValidator }: { customValidator?: () => { errors: string[] } }) => {
    const errors: string[] = [];

    if (!signer) {
      errors.push('wallet is required');
    }

    if (!selectedSafeAddress) {
      errors.push('safe is required');
    }

    if (!nodeNativeAddress) {
      errors.push('node is required');
    }

    // only require xDai value if there
    // is no proposed tx
    if (!xdaiValue && !proposedTx) {
      errors.push('xDai value is required');
    }

    if (customValidator) {
      const customErrors = customValidator();
      errors.push(...customErrors.errors);
    }

    return errors;
  };

  const getErrorsForApproveButton = () =>
    getErrorsForSafeTx({ customValidator: () => {
      return Number(xdaiValue) ? { errors: [] } : { errors: ['xdai value is required'] };
    } });

  const getErrorsForExecuteButton = () =>
    getErrorsForSafeTx({ customValidator: () => {
      // no user action means the user can not do anything
      return !userAction ? { errors: [] } : { errors: ['transaction requires more approvals'] };
    } });

  return (
    <Section
      lightBlue
      center
      fullHeightMin
    >
      <Card
        image={{
          src: '/assets/xdai-to-node.svg',
          height: 130,
          alt: 'send xdai to node image',
        }}
        title="fund your node with xdai"
      >
        <div>
          <StyledForm>
            <StyledInstructions>
              <StyledText>SEND xdAI to Node</StyledText>
              <StyledDescription>
                Add-in the amount of xDAI you like to transfer from your safe to your node.
              </StyledDescription>
            </StyledInstructions>
            <StyledInputGroup>
              <TextField
                variant="outlined"
                placeholder="-"
                size="small"
                value={xdaiValue}
                onChange={(e) => set_xdaiValue(e.target.value)}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
              />
              <StyledCoinLabel>xdai</StyledCoinLabel>
            </StyledInputGroup>
          </StyledForm>
          {!!proposedTx && (
            <StyledPendingSafeTransactions>
              <StyledDescription>
                {userAction === 'EXECUTE'
                  ? 'transaction has been approved by all required owners'
                  : `transaction is pending ${
                    (proposedTx?.confirmationsRequired ?? 0) - (proposedTx?.confirmations?.length ?? 0)
                  } approvals`}
              </StyledDescription>
              {userAction === 'SIGN' && (
                <StyledApproveButton
                  onClick={() => {
                    if (signer && proposedTx) {
                      dispatch(
                        safeActionsAsync.confirmTransactionThunk({
                          signer,
                          safeAddress: proposedTx.safe,
                          safeTransactionHash: proposedTx.safeTxHash,
                        }),
                      );
                    }
                  }}
                >
                  approve/sign
                </StyledApproveButton>
              )}
            </StyledPendingSafeTransactions>
          )}
          <StyledButtonGroup>
            <StyledGrayButton>back</StyledGrayButton>
            {!userCanSkipProposal ? (
              <Tooltip title={getErrorsForApproveButton().at(0)}>
                <span>
                  {' '}
                  <StyledBlueButton
                    disabled={!!getErrorsForApproveButton().length}
                    onClick={proposeTx}
                  >
                    approve/sign
                  </StyledBlueButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title={getErrorsForExecuteButton().at(0)}>
                <span>
                  {' '}
                  <StyledBlueButton
                    disabled={!!getErrorsForExecuteButton().length}
                    // no need to propose tx with only 1 threshold
                    onClick={proposedTx ? executeTx : createAndExecuteTx}
                  >
                    execute
                  </StyledBlueButton>
                </span>
              </Tooltip>
            )}
          </StyledButtonGroup>
          {isProposalLoading && <p>Signing transaction with nonce...</p>}
          {isExecutionLoading && <p>Executing transaction with nonce...</p>}
        </div>
      </Card>
    </Section>
  );
}

export default XdaiToNode;
