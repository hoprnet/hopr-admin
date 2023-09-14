import { Address, useWaitForTransaction } from 'wagmi';
import { Loading } from './loading';
import styled from '@emotion/styled';

const FeedbackLoading = styled.div`
  height: 40px;
  width: 40px;
`;

const FeedbackContainer = styled.div`
  display: flex;
  align-items: center;
  color: #000050;
  gap: 1rem;
`;

export const FeedbackTransaction = ({
  transactionHash,
  confirmations,
  feedbackTexts,
}: {
  transactionHash?: Address;
  confirmations: number;
  feedbackTexts: {
    loading: string;
    idle?: string;
    success?: string;
    error?: string;
  };
}) => {
  const { status } = useWaitForTransaction({
    confirmations,
    hash: transactionHash,
  });

  return (
    <FeedbackText
      status={status}
      feedbackTexts={feedbackTexts}
    />
  );
};

const FeedbackText = ({
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
      {feedbackTexts.success}
    </FeedbackContainer>;
  } else if (status === 'error' &&  feedbackTexts.error) {
    return <FeedbackContainer>
      {feedbackTexts.error}
    </FeedbackContainer>;
  }

  return <></>;
};