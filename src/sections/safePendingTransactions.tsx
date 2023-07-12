// MUI
import { Paper, Tooltip } from '@mui/material';

// STORE
import { useAppDispatch, useAppSelector } from '../store';
import { safeActionsAsync } from '../store/slices/safe';

// COMPONENTS
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import Section from '../future-hopr-lib-components/Section';

// LIBS
import styled from '@emotion/styled';
import { useAccount } from 'wagmi';

// HOOKS
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { useState } from 'react';
import { formatEther } from 'viem';
import { useEthersSigner } from '../hooks';

const StyledContainer = styled(Paper)`
  min-width: 800px;
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
  justify-content: space-around;
  gap: 1rem;
`;

const StyledApproveButton = styled(Button)`
  align-self: flex-end;
  text-transform: uppercase;
`;

const StyledRejectButton = styled(GrayButton)`
  outline: 2px solid #000050;
  line-height: 30px;
  border-radius: 20px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  align-content: baseline;
`;

const ApproveTransactionRow = ({ transaction }: { transaction: SafeMultisigTransactionResponse }) => {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const { address } = useAccount();
  const [isLoadingApproving, set_isLoadingApproving] = useState<boolean>(false);
  const [isLoadingExecuting, set_isLoadingExecuting] = useState<boolean>(false);
  const [isLoadingRejecting, set_isLoadingRejecting] = useState<boolean>(false);

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

  const rejectTx = () => {
    if (signer) {
      set_isLoadingRejecting(true);
      dispatch(
        safeActionsAsync.createSafeRejectionTransactionThunk({
          signer,
          safeAddress: transaction.safe,
          nonce: transaction.nonce,
        }),
      )
        .unwrap()
        .then(() => {
          set_isLoadingRejecting(false);
        })
        .catch(() => {
          set_isLoadingRejecting(false);
        });
    }
  };

  if (transaction.isExecuted) return <></>;

  return (
    <StyledPendingSafeTransactionWithFeedback>
      <StyledPendingSafeTransactionInfo>
        <p>{String(transaction.nonce)}</p>
        <p>{BigInt(transaction.value) ? 'Send' : 'Reject'}</p>
        <p>{formatEther(BigInt(transaction.value))}</p>
        <p>{`${transaction.confirmations?.length ?? 0}/${transaction.confirmationsRequired}`}</p>
        {isTransactionExecutable() ? (
          <StyledButtonGroup>
            <StyledRejectButton onClick={rejectTx}>reject</StyledRejectButton>
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
      {isLoadingRejecting && <p>Rejecting transaction...</p>}
    </StyledPendingSafeTransactionWithFeedback>
  );
};

const SafeQueue = () => {
  const pendingTransactions = useAppSelector((state) => state.safe.pendingTransactions);
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
        <Title>Pending transactions</Title>
        {pendingTransactions?.results.map((transaction) => (
          <ApproveTransactionRow
            key={transaction.safeTxHash}
            transaction={transaction}
          />
        ))}
      </StyledContainer>
    </Section>
  );
};

export default SafeQueue;
