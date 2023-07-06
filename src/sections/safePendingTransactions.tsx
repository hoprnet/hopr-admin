// MUI
import { Paper, Tooltip } from '@mui/material';

// STORE
import { useAppDispatch, useAppSelector } from '../store';

// COMPONENTS
import Section from '../future-hopr-lib-components/Section';
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';

// LIBS
import styled from '@emotion/styled';
import { SafeMultisigTransactionWithTransfersResponse } from '@safe-global/api-kit';
import { useAccount } from 'wagmi';

// HOOKS
import { useEthersSigner } from '../hooks';
import { formatEther } from 'viem';
import { useState } from 'react';
import { safeActionsAsync } from '../store/slices/safe';

const StyledContainer = styled(Paper)`
  min-width: 600px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
`;

const StyledPendingSafeTransactionWithFeedback = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledPendingSafeTransactionInfo = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

const StyledApproveButton = styled(Button)`
  align-self: flex-end;
  text-transform: uppercase;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  min-width: 170px;
  align-content: baseline;
`;

const ApproveTransactionRow = ({ transaction }: { transaction: SafeMultisigTransactionWithTransfersResponse }) => {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const { address } = useAccount();
  const [isLoadingApproving, set_isLoadingApproving] = useState<boolean>(false);
  const [isLoadingExecuting, set_isLoadingExecuting] = useState<boolean>(false);

  const isTransactionExecutable = () => {
    if (!signer) return false;
    return (transaction.confirmations?.length ?? 0) >= transaction.confirmationsRequired;
  };
  /**
   * Checks if transaction is pending approval from connected signer
   * @returns boolean
   */
  const isTransactionPendingApprovalFromSigner = () => {
    const foundSigner = transaction?.confirmations?.find((confirmation) => confirmation.owner === address);
    if (foundSigner) {
      return false;
    }
    return true;
  };

  const executeTx = () => {
    if (signer) {
      set_isLoadingExecuting(true);
      dispatch(
        safeActionsAsync.executeTransactionThunk({
          safeAddress: transaction.safe,
          signer,
          safeTransaction: transaction,
        }),
      )
        .unwrap()
        .then(() => {
          set_isLoadingExecuting(false);
        })
        .catch(() => {
          set_isLoadingExecuting(false);
        });
    }
  };

  const approveTx = () => {
    if (signer) {
      set_isLoadingApproving(true);
      dispatch(
        safeActionsAsync.confirmTransactionThunk({
          signer,
          safeAddress: transaction.safe,
          safeTransactionHash: transaction.safeTxHash,
        }),
      )
        .unwrap()
        .then(() => {
          set_isLoadingApproving(false);
        })
        .catch(() => {
          set_isLoadingApproving(false);
        });
    }
  };

  if (transaction.isExecuted) return <></>;

  return (
    <StyledPendingSafeTransactionWithFeedback>
      <StyledPendingSafeTransactionInfo>
        <p>{String(transaction.nonce)}</p>
        <p>Send</p>
        <p>{formatEther(BigInt(transaction.value))}</p>
        <p>{`${transaction.confirmations?.length ?? 0}/${transaction.confirmationsRequired}`}</p>
        {isTransactionExecutable() ? (
          <StyledButtonGroup>
            <StyledApproveButton onClick={executeTx}>execute</StyledApproveButton>
          </StyledButtonGroup>
        ) : (
          <Tooltip title={!isTransactionPendingApprovalFromSigner() && 'You have already approved'}>
            <span>
              <StyledApproveButton
                onClick={approveTx}
                disabled={!isTransactionPendingApprovalFromSigner()}
              >
                approve/sign
              </StyledApproveButton>
            </span>
          </Tooltip>
        )}
      </StyledPendingSafeTransactionInfo>
      {isLoadingApproving && <p>Approving transaction with nonce...</p>}
      {isLoadingExecuting && <p>Executing transaction...</p>}
    </StyledPendingSafeTransactionWithFeedback>
  );
};

const SafeQueue = () => {
  const transactions = useAppSelector((state) => state.safe.allTransactions);
  const selectedSafeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);

  if (!selectedSafeAddress)
    return (
      <Section
        center
        fullHeightMin
      >
        <StyledContainer>
          <Title>Connect to safe</Title>
        </StyledContainer>
      </Section>
    );
  return (
    <Section
      center
      fullHeightMin
    >
      <StyledContainer>
        <Title>Queued transactions</Title>
        {transactions?.results.map(
          (transaction) =>
            transaction.txType === 'MULTISIG_TRANSACTION' && (
              <ApproveTransactionRow
                key={transaction.safeTxHash}
                transaction={transaction}
              />
            ),
        )}
      </StyledContainer>
    </Section>
  );
};

export default SafeQueue;
