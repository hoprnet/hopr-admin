import { Address, useWaitForTransaction } from 'wagmi';
import { Loading } from './loading';
import styled from '@emotion/styled';

const FeedbackLoading = styled.div`
  height: 30px;
  width: 30px;
`;

const FeedbackContainer = styled.div`
  display: flex;
  min-height: 60px;
  align-items: center;
  color: #000050;
  gap: 1rem;
  &.error {
    color: #9b0000;
  }
  p {
    overflow-wrap: anywhere;
  }
`;

export const FeedbackTransaction = ({
  isWalletLoading,
  transactionHash,
  confirmations,
  errorMessage,
  feedbackTexts,
}: {
  isWalletLoading?: boolean;
  transactionHash?: Address;
  confirmations: number;
  errorMessage?: string | null;
  feedbackTexts: {
    loading: string;
    idle?: string;
    success?: string;
    error?: string;
  };
}) => {
  let { status } = useWaitForTransaction({
    confirmations,
    hash: transactionHash,
  });

  if(errorMessage) {
    status = 'error';
    feedbackTexts.error = errorMessage;
  }

  if (isWalletLoading) {
    return <WalletFeedback />
  }

  return (
    <TransactionFeedbackText
      status={status}
      feedbackTexts={feedbackTexts}
    />
  );
};

const WalletFeedback = () => {
  return (
    <FeedbackContainer>
      <FeedbackLoading>
        <Loading />
      </FeedbackLoading>
      <p>Check your Wallet...</p>
    </FeedbackContainer>
  );
}

const TransactionFeedbackText = ({
  status,
  feedbackTexts,
}: {
  status: 'error' | 'success' | 'idle' | 'loading';
  feedbackTexts: {
    loading: string;
    idle?: string;
    success?: string;
    error?: string;
  };
}) => {
  if (status === 'loading') {
    return (
      <FeedbackContainer>
        <FeedbackLoading>
          <Loading />
        </FeedbackLoading>
        <p>{feedbackTexts.loading}</p>
      </FeedbackContainer>
    );
  } else if (status === 'success' && feedbackTexts.success) {
    return <FeedbackContainer>
      <p>{feedbackTexts.success}</p>
    </FeedbackContainer>;
  } else if (status === 'error' &&  feedbackTexts.error) {
    return <FeedbackContainer className='error'>
      <p>{feedbackTexts.error}</p>
    </FeedbackContainer>;
  }

  return <FeedbackContainer></FeedbackContainer>;
};
