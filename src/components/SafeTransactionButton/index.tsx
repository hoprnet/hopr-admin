import { SafeInfoResponse } from '@safe-global/api-kit';
import Button from '../../future-hopr-lib-components/Button';
import { useEffect, useState } from 'react';
import { getUserCanSkipProposal } from '../../utils/safeTransactions';
import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';

type SafeButtonProps = {
  // connected safe info that contains threshold
  safeInfo?: SafeInfoResponse | null;
  // specific props for sign button
  signOptions: {
    pending?: boolean;
    disabled?: boolean;
    tooltipText?: string;
    onClick: () => void;
  };
  // specific props for execute button
  executeOptions: {
    pending?: boolean;
    disabled?: boolean;
    tooltipText?: string;
    onClick: () => void;
  };
};

/**
 * Default button for SafeButton
 */
const StyledBlueButton = styled(Button)`
  text-transform: uppercase;
  padding: 0.2rem 4rem;
`;

/**
 * Button to choose to either sign or execute transactions for safe.
 * If the transaction is signed by others it can not be executed by this button
 * Multisig execution should be handled in Transactions page
 */
export default function SafeTransactionButton(props: SafeButtonProps) {
  const [userCanSkipProposal, set_userCanSkipProposal] = useState(false);

  useEffect(() => {
    if (props.safeInfo) {
      set_userCanSkipProposal(getUserCanSkipProposal(props.safeInfo));
    }
  }, [props.safeInfo]);

  if (userCanSkipProposal) {
    return (
      <Tooltip title={props.executeOptions.tooltipText}>
        <span>
          <StyledBlueButton
            pending={!!props.executeOptions?.pending ?? false}
            disabled={!!props.executeOptions?.disabled ?? false}
            onClick={props.executeOptions.onClick}
          >
            Execute
          </StyledBlueButton>
        </span>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={props.signOptions.tooltipText}>
        <span>
          <StyledBlueButton
            pending={!!props.signOptions?.pending ?? false}
            disabled={!!props.signOptions?.disabled ?? false}
            onClick={props.signOptions.onClick}
          >
            Sign
          </StyledBlueButton>
        </span>
      </Tooltip>
    );
  }
}
