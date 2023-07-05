//Stores
import { useAppDispatch, useAppSelector } from '../store';

// Libraries
import styled from '@emotion/styled';

// MUI
import TextField from '@mui/material/TextField';

// components
import { SafeMultisigTransactionWithTransfersResponse } from '@safe-global/api-kit';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import Section from '../future-hopr-lib-components/Section';
import { useSigner } from '../hooks';
import { safeActionsAsync } from '../store/slices/safe';
import Card from './components/Card';

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
  const safeTxs = useAppSelector((state) => state.safe.safeTransactions);
  const selectedSafeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);
  const { native: nodeNativeAddress } = useAppSelector((state) => state.node.addresses);
  const [value, set_value] = useState<string>('');
  const [isLoading, set_isLoading] = useState<boolean>();
  const [proposedTxHash, set_proposedTxHash] = useState<string>();
  const [proposedTx, set_proposedTx] = useState<SafeMultisigTransactionWithTransfersResponse>();

  const { signer } = useSigner();

  useEffect(() => {
    if (proposedTxHash) {
      const foundProposedTx = safeTxs?.results.find(
        (tx) => tx.txType === 'MULTISIG_TRANSACTION' && tx.safeTxHash === proposedTxHash,
      );
      if (foundProposedTx?.txType === 'MULTISIG_TRANSACTION') {
        set_proposedTx(foundProposedTx);
      }
    }
  }, [safeTxs, proposedTxHash]);

  const proposeTx = () => {
    if (signer && Number(value) && selectedSafeAddress && nodeNativeAddress) {
      set_isLoading(true);
      dispatch(
        safeActionsAsync.createSafeTransactionThunk({
          signer,
          safeAddress: selectedSafeAddress,
          safeTransactionData: {
            to: nodeNativeAddress,
            value: parseUnits(value as `${number}`, 18).toString(),
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
      const safeTx = safeTxs?.results.find((tx) => {
        if (tx.txType === 'MULTISIG_TRANSACTION' && tx.safeTxHash === proposedTxHash) {
          return true;
        }
        return false;
      });

      if (safeTx?.txType === 'MULTISIG_TRANSACTION') {
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
                value={value}
                onChange={(e) => set_value(e.target.value)}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
              />
              <StyledCoinLabel>xdai</StyledCoinLabel>
            </StyledInputGroup>
          </StyledForm>
          {proposedTx && proposedTx.confirmationsRequired !== proposedTx.confirmations?.length && (
            <StyledPendingSafeTransactions>
              <StyledDescription>
                transaction is pending{' '}
                {(proposedTx.confirmationsRequired ?? 0) - (proposedTx.confirmations?.length ?? 0)} approvals
              </StyledDescription>
              <StyledApproveButton
                onClick={() => {
                  if (signer) {
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
                approve
              </StyledApproveButton>
            </StyledPendingSafeTransactions>
          )}
          <StyledButtonGroup>
            <StyledGrayButton>back</StyledGrayButton>
            {!proposedTx ? (
              <StyledBlueButton
                disabled={!Number(value) || !signer || !selectedSafeAddress || !nodeNativeAddress}
                onClick={proposeTx}
              >
                next
              </StyledBlueButton>
            ) : (
              <StyledBlueButton
                disabled={
                  !signer ||
                  !selectedSafeAddress ||
                  !nodeNativeAddress ||
                  proposedTx.confirmationsRequired !== proposedTx.confirmations?.length
                }
                onClick={executeTx}
              >
                confirm
              </StyledBlueButton>
            )}
          </StyledButtonGroup>
          {isLoading && <p>Signing transaction with nonce...</p>}
        </div>
      </Card>
    </Section>
  );
}

export default XdaiToNode;
