import { SafeInfoResponse } from '@safe-global/api-kit';
import Button from '../../future-hopr-lib-components/Button';
import { useEffect, useState } from 'react';
import { getUserCanSkipProposal } from '../../utils/safeTransactions';
import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';

type SafeButtonProps = {
  // connected safe info that contains threshold
  safeInfo: SafeInfoResponse | null;
  // specific props for sign button
  signOptions: {
    pending?: boolean;
    disabled?: boolean;
    tooltipText?: string;
    buttonText?: string;
    onClick: () => void;
  };
  // specific props for execute button
  executeOptions: {
    pending?: boolean;
    disabled?: boolean;
    tooltipText?: string;
    buttonText?: string;
    onClick: () => void;
  };
};

/**
 * Button to choose to either sign or execute transactions for safe.
 * If the transaction is signed by others it can not be executed by this button
 * Multisig execution should be handled in Transactions page
 */
export default function SafeTransactionButton(props: SafeButtonProps) {
  const [userCanSkipProposal, set_userCanSkipProposal] = useState(false);
  const [indexerDidNotWork, set_indexerDidNotWork] = useState(false);

  useEffect(() => {
    if (props.safeInfo) {
      set_userCanSkipProposal(getUserCanSkipProposal(props.safeInfo));
    } else {
      set_indexerDidNotWork(true)
    }
  }, [props.safeInfo]);

  if (userCanSkipProposal) {
    return (
      <Tooltip title={props.executeOptions.tooltipText}>
        <span>
          <Button
            pending={!!props.executeOptions?.pending ?? false}
            disabled={!!props.executeOptions?.disabled ?? false}
            onClick={props.executeOptions.onClick}
          >
            {props.executeOptions.buttonText ?? 'EXECUTE'}
          </Button>
        </span>
      </Tooltip>
    );
  } else if (indexerDidNotWork) {
    return (
      <Tooltip title='Indexer did not find your safe yet. Please try in 10min'>
        <span>
          <Button
            disabled={true}
          >
            {props.signOptions.buttonText ?? 'SIGN'}
          </Button>
        </span>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={props.signOptions.tooltipText}>
        <span>
          <Button
            pending={!!props.signOptions?.pending ?? false}
            disabled={!!props.signOptions?.disabled ?? false}
            onClick={props.signOptions.onClick}
          >
            {props.signOptions.buttonText ?? 'SIGN'}
          </Button>
        </span>
      </Tooltip>
    );
  }
}
