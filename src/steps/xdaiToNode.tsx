//Stores
import { useAppDispatch, useAppSelector } from '../store';

// Libraries
import styled from '@emotion/styled';

// MUI
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// components
import { SafeMultisigTransactionWithTransfersResponse } from '@safe-global/api-kit';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import Section from '../future-hopr-lib-components/Section';
import { useEthersSigner } from '../hooks';
import { safeActionsAsync } from '../store/slices/safe';
import Card from '../components/Card';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

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
  const pendingTransactions = useAppSelector((state) => state.safe.pendingTransactions);
  const selectedSafeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);
  const { native: nodeNativeAddress } = useAppSelector((state) => state.node.addresses);
  const [xdaiValue, set_xdaiValue] = useState<string>('');
  const [isLoading, set_isLoading] = useState<boolean>();
  const [proposedTxHash, set_proposedTxHash] = useState<string>();
  const [proposedTx, set_proposedTx] = useState<SafeMultisigTransactionResponse>();

  const signer = useEthersSigner();

  useEffect(() => {
    if (proposedTxHash) {
      const foundProposedTx = pendingTransactions?.results.find((tx) => tx.safeTxHash === proposedTxHash);
      if (foundProposedTx) {
        set_proposedTx(foundProposedTx);
      }
    }
  }, [pendingTransactions, proposedTxHash]);

  const proposeTx = () => {
    if (signer && Number(xdaiValue) && selectedSafeAddress && nodeNativeAddress) {
      set_isLoading(true);
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
          set_isLoading(false);
        })
        .catch(() => {
          set_isLoading(false);
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
          safeActionsAsync.executeTransactionThunk({
            safeAddress: selectedSafeAddress,
            signer,
            safeTransaction: safeTx,
          }),
        );
      }
    }
  };

  const transactionHasEnoughApprovals = () => {
    if (!proposedTx) return false;
    if (!proposedTx.confirmations) return false;

    return proposedTx.confirmations.length >= proposedTx.confirmationsRequired;
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
      return transactionHasEnoughApprovals() ? { errors: [] } : { errors: ['transaction requires more approvals'] };
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
                {transactionHasEnoughApprovals()
                  ? 'transaction has been approved by all required owners'
                  : `transaction is pending ${
                    (proposedTx?.confirmationsRequired ?? 0) - (proposedTx?.confirmations?.length ?? 0)
                  } approvals`}
              </StyledDescription>
              {!transactionHasEnoughApprovals() && (
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
            {!proposedTx ? (
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
                    onClick={executeTx}
                  >
                    execute
                  </StyledBlueButton>
                </span>
              </Tooltip>
            )}
          </StyledButtonGroup>
          {isLoading && <p>Signing transaction with nonce...</p>}
        </div>
      </Card>
    </Section>
  );
}

export default XdaiToNode;
