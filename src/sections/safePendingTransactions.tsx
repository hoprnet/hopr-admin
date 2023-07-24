// MUI
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';

// MUI ICONS
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// STORE
import {
  useAppDispatch, useAppSelector 
} from '../store';
import { safeActionsAsync } from '../store/slices/safe';

// COMPONENTS
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import Section from '../future-hopr-lib-components/Section';

// LIBS
import styled from '@emotion/styled';
import { useAccount } from 'wagmi';
import { default as dayjs } from 'dayjs';
import { default as utc } from 'dayjs/plugin/utc';
import { default as timezone } from 'dayjs/plugin/timezone';
import { default as relativeTime } from 'dayjs/plugin/relativeTime';

// HOOKS
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import {
  useEffect, useState 
} from 'react';
import { formatEther } from 'viem';
import { useEthersSigner } from '../hooks';
import { truncateEthereumAddress } from '../utils/helpers';
import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit';

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
  margin: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  align-content: baseline;
`;

const StyledCollapsibleCell = styled(TableCell)`
  padding-bottom: 0;
  padding-top: 0;
`;

const StyledBox = styled(Box)`
  margin: 1;
  display: flex;
  justify-content: space-evenly;
`;

const StyledTransactionHashWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & svg {
    align-self: flex-end;
    height: 16px;
    width: 16px;
  }
`;

const GnosisLink = styled.a`
  display: inline-flex;
  gap: 2px;
  text-decoration: underline;

  & svg {
    align-self: flex-end;
    height: 16px;
    width: 16px;
  }
`;

const GNOSIS_BASE_URL = 'https://gnosisscan.io';

/**
 * Checks if transaction is pending approval from connected signer
 * @returns boolean
 */
const isTransactionPendingApprovalFromSigner = (
  transaction: SafeMultisigTransactionResponse,
  address: string | undefined,
) => {
  const foundSigner = transaction?.confirmations?.find((confirmation) => confirmation.owner === address);
  if (foundSigner) {
    return false;
  }
  return true;
};

const ActionButtons = ({ transaction }: { transaction: SafeMultisigTransactionResponse }) => {
  const signer = useEthersSigner();
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const safeNonce = useAppSelector((state) => state.safe.safeInfo?.nonce);
  const [isLoadingApproving, set_isLoadingApproving] = useState<boolean>(false);
  const [isLoadingExecuting, set_isLoadingExecuting] = useState<boolean>(false);
  const [isLoadingRejecting, set_isLoadingRejecting] = useState<boolean>(false);

  const executeTx = (transaction: SafeMultisigTransactionResponse) => {
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

  const approveTx = (transaction: SafeMultisigTransactionResponse) => {
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

  const rejectTx = (transaction: SafeMultisigTransactionResponse) => {
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

  const isTransactionApproved = (transaction: SafeMultisigTransactionResponse) => {
    if (!signer) return false;
    return (transaction.confirmations?.length ?? 0) >= transaction.confirmationsRequired;
  };

  const isTransactionExecutable = (transaction: SafeMultisigTransactionResponse) => {
    if (!signer) return false;
    if (safeNonce !== transaction.nonce) return false;

    return true;
  };

  if (isTransactionApproved(transaction)) {
    return (
      <>
        <StyledButtonGroup>
          <Tooltip title={!isTransactionExecutable(transaction) && `Earlier actions should be handled first`}>
            <span>
              <StyledRejectButton
                disabled={!isTransactionExecutable(transaction)}
                onClick={() => rejectTx(transaction)}
              >
                reject
              </StyledRejectButton>
            </span>
          </Tooltip>
          <Tooltip title={!isTransactionExecutable(transaction) && `Earlier actions should be handled first`}>
            <span>
              <StyledApproveButton
                disabled={!isTransactionExecutable(transaction)}
                onClick={() => executeTx(transaction)}
              >
                execute
              </StyledApproveButton>
            </span>
          </Tooltip>
        </StyledButtonGroup>
        {isLoadingExecuting && <p>Executing transaction...</p>}
        {isLoadingRejecting && <p>Rejecting transaction...</p>}
      </>
    );
  } else {
    return (
      <>
        <StyledButtonGroup>
          <Tooltip title={!isTransactionPendingApprovalFromSigner(transaction, address) && 'You have already approved'}>
            <span>
              <StyledApproveButton
                onClick={() => approveTx(transaction)}
                disabled={!isTransactionPendingApprovalFromSigner(transaction, address)}
              >
                approve/sign
              </StyledApproveButton>
            </span>
          </Tooltip>
        </StyledButtonGroup>
        {isLoadingApproving && <p>Approving transaction with nonce...</p>}
      </>
    );
  }
};

const PendingTransactionRow = ({ transaction }: { transaction: SafeMultisigTransactionResponse }) => {
  const { address } = useAccount();
  const [open, set_open] = useState(false);

  const getTransactionStatus = (transaction: SafeMultisigTransactionResponse) => {
    if (transaction.confirmations?.length === transaction.confirmationsRequired) {
      return 'Awaiting execution';
    }

    if (isTransactionPendingApprovalFromSigner(transaction, address)) {
      return 'Needs your confirmation ';
    }

    return 'Awaiting confirmation';
  };

  const getType = (transaction: SafeMultisigTransactionResponse) => {
    if (transaction.dataDecoded) {
      const decodedData = getDecodedData(transaction);
      return typeof decodedData === 'string' ? decodedData : decodedData?.method;
    } else if (BigInt(transaction.value)) {
      return 'Sent';
    } else {
      return 'Rejection';
    }
  };

  const getDecodedData = (transaction: SafeMultisigTransactionResponse) => {
    if (typeof transaction.dataDecoded === 'string') {
      return transaction.dataDecoded;
    } else if (typeof transaction.dataDecoded === 'object') {
      const transactionData = transaction.dataDecoded as unknown as {
        method: string;
        parameters: { name: string; type: string; value: string }[];
      };
      return transactionData;
    }
  };

  const formatDateToUserTimezone = (date: string) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    // guess user timezone;
    const userTimezone = dayjs.tz.guess();
    const formattedDate = `${dayjs(date).tz(userTimezone).format('YYYY-MM-DD HH:MM')} GMT ${dayjs(date)
      .tz(userTimezone)
      .format('Z')}`;

    return formattedDate;
  };

  const calculateRelativeTime = (date: string) => {
    // add relative time plugin to dayjs
    dayjs.extend(relativeTime);
    const daysSinceDate = dayjs().diff(date, 'days');

    if (daysSinceDate > 7) {
      return formatDateToUserTimezone(date);
    }

    const relativeDateString = dayjs(date).fromNow();
    return relativeDateString;
  };

  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          scope="row"
        >
          <Tooltip title={formatDateToUserTimezone(transaction.submissionDate)}>
            <span>{calculateRelativeTime(transaction.submissionDate)}</span>
          </Tooltip>
        </TableCell>
        <TableCell align="right">{getType(transaction)}</TableCell>
        <TableCell align="right"> {formatEther(BigInt(transaction.value))}</TableCell>
        <TableCell align="right">{`${transaction.confirmations?.length}/${transaction.confirmationsRequired}`}</TableCell>
        <TableCell align="right">{getTransactionStatus(transaction)}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => set_open(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <StyledCollapsibleCell colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <StyledBox>
              <List>
                <p>Nonce: {transaction.nonce}</p>
                <p>Created: {formatDateToUserTimezone(transaction.submissionDate)}</p>
                <StyledTransactionHashWithIcon>
                  <span>To: {truncateEthereumAddress(transaction.to)}</span>
                  <GnosisLink
                    href={`${GNOSIS_BASE_URL}/address/${transaction.to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OpenInNewIcon />
                  </GnosisLink>
                </StyledTransactionHashWithIcon>
                <StyledTransactionHashWithIcon>
                  <span>Safe hash: {truncateEthereumAddress(transaction.safeTxHash)}</span>
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.safeTxHash);
                    }}
                  >
                    {' '}
                    <ContentCopyIcon />
                  </IconButton>
                </StyledTransactionHashWithIcon>
              </List>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
              />
              <List>
                <h4>Confirmations {`(${transaction.confirmations?.length}/${transaction.confirmationsRequired})`}</h4>
                {transaction.confirmations?.map((confirmation) => (
                  <StyledTransactionHashWithIcon key={confirmation.owner}>
                    <span>- {truncateEthereumAddress(confirmation.owner)}</span>
                    <GnosisLink
                      href={`${GNOSIS_BASE_URL}/address/${confirmation.owner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon />
                    </GnosisLink>
                  </StyledTransactionHashWithIcon>
                ))}
                <ActionButtons transaction={transaction} />
              </List>
            </StyledBox>
          </Collapse>
        </StyledCollapsibleCell>
      </TableRow>
    </>
  );
};

const SafeQueue = () => {
  const dispatch = useAppDispatch();
  const pendingTransactions = useAppSelector((state) => state.safe.pendingTransactions);
  const selectedSafeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);
  const signer = useEthersSigner();

  useEffect(() => {
    if (signer && selectedSafeAddress) {
      dispatch(
        safeActionsAsync.getPendingSafeTransactionsThunk({
          safeAddress: selectedSafeAddress,
          signer,
        }),
      );
    }

    const updateSafeNonceInterval = setInterval(() => {
      if (!signer || !selectedSafeAddress) return;
      // update safe nonce
      dispatch(
        safeActionsAsync.getSafeInfoThunk({
          signer: signer,
          safeAddress: selectedSafeAddress,
        }),
      );
    }, 10000);

    return () => {
      clearInterval(updateSafeNonceInterval);
    };
  }, [selectedSafeAddress]);

  const sortByDate = (pendingTransactions: SafeMultisigTransactionListResponse) => {
    if (!pendingTransactions.count) return null;
    const sortedCopy: SafeMultisigTransactionListResponse = JSON.parse(JSON.stringify(pendingTransactions));

    // sort from oldest date to newest
    return sortedCopy.results.sort(
      (prevDay, nextDay) => dayjs(prevDay.submissionDate).valueOf() - dayjs(nextDay.submissionDate).valueOf(),
    );
  };

  return (
    <Section
      lightBlue
      fullHeightMin
    >
      <StyledContainer>
        {!selectedSafeAddress ? (
          <Title>Connect to safe</Title>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="safe pending transactions">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Confirmations</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingTransactions &&
                  !!pendingTransactions?.count &&
                  sortByDate(pendingTransactions)?.map((transaction, key) => (
                    <PendingTransactionRow
                      transaction={transaction}
                      key={key}
                    />
                  ))}
                {pendingTransactions && !pendingTransactions?.count && <span>No entries</span>}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </StyledContainer>
    </Section>
  );
};

export default SafeQueue;
