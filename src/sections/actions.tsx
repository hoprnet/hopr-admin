// MUI
import {
  Box,
  Collapse,
  Container,
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
import { useAppDispatch, useAppSelector } from '../store';
import { safeActions, safeActionsAsync } from '../store/slices/safe';

// COMPONENTS
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import Section from '../future-hopr-lib-components/Section';

// LIBS
import styled from '@emotion/styled';
import { erc20ABI, useAccount } from 'wagmi';
import { default as dayjs } from 'dayjs';
import SafeApiKit, {
  AllTransactionsListResponse,
  EthereumTxWithTransfersResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse,
  SafeMultisigTransactionListResponse
} from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

// HOOKS
import { useEffect, useState } from 'react';
import {
  Abi,
  Address,
  DecodeFunctionResultReturnType,
  decodeFunctionData,
  formatEther
} from 'viem'
import { useEthersSigner } from '../hooks';
import { truncateEthereumAddress } from '../utils/helpers';
import { ethers } from 'ethers';
import { calculateTimeInGMT, formatDateToUserTimezone } from '../utils/date';

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

const StyledBlueButton = styled(Button)`
  align-self: flex-end;
  text-transform: uppercase;
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

const StyledTableHead = styled(TableHead)`
  background-color: #aec5db;
  text-transform: uppercase;
`;

const StyledPaper = styled(Paper)`
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
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


const StyledJSON = styled.div`
  max-width: 16rem;
  overflow-wrap: break-word;
`

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
              <StyledBlueButton
                disabled={!isTransactionExecutable(transaction)}
                onClick={() => rejectTx(transaction)}
              >
                reject
              </StyledBlueButton>
            </span>
          </Tooltip>
          <Tooltip title={!isTransactionExecutable(transaction) && `Earlier actions should be handled first`}>
            <span>
              <StyledBlueButton
                disabled={!isTransactionExecutable(transaction)}
                onClick={() => executeTx(transaction)}
              >
                execute
              </StyledBlueButton>
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
              <StyledBlueButton
                onClick={() => approveTx(transaction)}
                disabled={!isTransactionPendingApprovalFromSigner(transaction, address)}
              >
                approve/sign
              </StyledBlueButton>
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
  const signer = useEthersSigner();
  const dispatch = useAppDispatch();
  const [open, set_open] = useState(false);
  const [source, set_source] = useState<string>();
  const [request, set_request] = useState<string>();
  // value can represent token value or json params if there is no
  const [value, set_value] = useState<string>();
  const [currency, set_currency] = useState<string>();
  const [dateInUserTimezone, set_dateInUserTimezone] = useState<string>();
  const [dateInGMT, set_dateInGMT] = useState<string>();
  const [transactionStatus, set_transactionStatus] = useState<string>();

  useEffect(() => {
    if (signer && transaction) {
      set_source(getSourceOfTransaction(transaction));
      set_request(getRequest(transaction));
      getValueFromTransaction(transaction, signer).then((value) => set_value(value?.toString()));
      getCurrencyFromTransaction(transaction, signer).then((currency) => set_currency(currency));
      set_dateInGMT(calculateTimeInGMT(transaction.submissionDate));
      set_dateInUserTimezone(formatDateToUserTimezone(transaction.submissionDate));
      set_transactionStatus(getTransactionStatus(transaction));
    }
  }, [signer, transaction]);

  const getTransactionStatus = (transaction: SafeMultisigTransactionResponse) => {
    if (transaction.confirmations?.length === transaction.confirmationsRequired) {
      return 'Awaiting execution';
    }

    if (isTransactionPendingApprovalFromSigner(transaction, address)) {
      return 'Needs your confirmation ';
    }

    return 'Awaiting confirmation';
  };

  const getRequest = (transaction: SafeMultisigTransactionResponse) => {
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

  const getSourceOfTransaction = (transaction: SafeMultisigTransactionResponse) => {
    // if there are no signatures this is from a delegate
    if (!transaction.confirmations?.length) {
      return '-';
    }

    return truncateEthereumAddress(transaction.confirmations.at(0)?.owner ?? '');
  };

  const getCurrencyFromTransaction = async (
    transaction: SafeMultisigTransactionResponse,
    signer: ethers.providers.JsonRpcSigner,
  ) => {
    const isNativeTransaction = !transaction.data;
    if (isNativeTransaction) {
      return 'xDai';
    }

    const token = await dispatch(
      safeActionsAsync.getToken({
        signer,
        tokenAddress: transaction.to,
      }),
    ).unwrap();

    if (!token.name && !token.symbol) {
      // this is not a token contract
      return JSON.stringify(transaction.dataDecoded);
    }

    return token.symbol;
  };

  const getValueFromTransaction = async (
    transaction: SafeMultisigTransactionResponse,
    signer: ethers.providers.JsonRpcSigner,
  ) => {
    const isNativeTransaction = !transaction.data;
    if (isNativeTransaction) {
      return formatEther(BigInt(transaction.value));
    }

    const token = await dispatch(
      safeActionsAsync.getToken({
        signer,
        tokenAddress: transaction.to,
      }),
    ).unwrap();

    if (!token.name && !token.symbol) {
      // this is not a token contract
      return JSON.stringify(transaction.dataDecoded);
    }

    const decodedData = decodeFunctionData({
      abi: erc20ABI,
      data: transaction.data as Address,
    });

    const value = getValueFromERC20Functions(decodedData);

    return value;
  };

  const getValueFromERC20Functions = (
    decodedData: ReturnType<typeof decodeFunctionData<typeof erc20ABI>>,
  ): string | null => {
    if (decodedData.functionName === 'transfer') {
      return formatEther(decodedData.args[1]);
    }

    if (decodedData.functionName === 'approve') {
      return formatEther(decodedData.args[1]);
    }

    if (decodedData.functionName === 'transferFrom') {
      return formatEther(decodedData.args[2]);
    }

    return null;
  };

  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          scope="row"
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => set_open(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Tooltip title={dateInGMT}>
            <span>{dateInUserTimezone}</span>
          </Tooltip>
        </TableCell>
        <TableCell align="left">{source}</TableCell>
        <TableCell align="left">{request}</TableCell>
        <TableCell align="left">{`${
          value && value.length > 18 ? value.slice(0, 18).concat('...') : value
        } ${currency}`}</TableCell>
        <TableCell align="left">
          <ActionButtons transaction={transaction} />
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
                <p>Created: {dateInUserTimezone}</p>
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
                <StyledJSON>
                  {!!transaction.dataDecoded && <p>data: {JSON.stringify(transaction.dataDecoded, null, 8)}</p>}
                </StyledJSON>
              </List>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
              />
              <List>
                <p>status: {transactionStatus}</p>
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
              </List>
            </StyledBox>
          </Collapse>
        </StyledCollapsibleCell>
      </TableRow>
    </>
  );
};

function EthereumTransactionRow(props: { transaction: EthereumTxWithTransfersResponse }) {
  const { transaction } = props;
  const [open, set_open] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          scope="row"
        ></TableCell>
        <TableCell align="right">Received</TableCell>
        <TableCell align="right">
          {transaction.transfers[0] ? formatEther(BigInt(transaction.transfers[0].value)) : ''}
        </TableCell>
        <TableCell align="right">{transaction.executionDate}</TableCell>
        <TableCell align="right">Success</TableCell>
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
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Hash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transaction.transfers.map((transfer) => (
                    <TableRow key={transfer.transactionHash}>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        {truncateEthereumAddress(transfer.from)}
                      </TableCell>
                      <TableCell>{truncateEthereumAddress(transfer.to)}</TableCell>
                      <TableCell align="right">{formatEther(BigInt(transfer.value))}</TableCell>
                      <TableCell align="right">{truncateEthereumAddress(transfer.transactionHash)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledBox>
          </Collapse>
        </StyledCollapsibleCell>
      </TableRow>
    </>
  );
}

function MultisigTransactionRow(props: { transaction: SafeMultisigTransactionWithTransfersResponse }) {
  const { transaction } = props;
  const [open, set_open] = useState(false);

  const getType = (transaction: SafeMultisigTransactionWithTransfersResponse) => {
    if (transaction.dataDecoded) {
      const decodedData = getDecodedData(transaction);
      return typeof decodedData === 'string' ? decodedData : decodedData?.method;
    } else if (BigInt(transaction.value)) {
      return 'Sent';
    } else {
      return 'Rejection';
    }
  };

  const getDecodedData = (transaction: SafeMultisigTransactionWithTransfersResponse) => {
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

  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          scope="row"
        >
          {transaction.nonce}
        </TableCell>
        <TableCell align="right">{getType(transaction)}</TableCell>
        <TableCell align="right"> {formatEther(BigInt(transaction.value))}</TableCell>
        <TableCell align="right">{transaction.executionDate}</TableCell>
        <TableCell align="right">{transaction.isExecuted ? 'Success' : 'Not executed'}</TableCell>
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
                <p>Created: {transaction.submissionDate}</p>
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
                {transaction.isExecuted && (
                  <>
                    <StyledTransactionHashWithIcon>
                      <span>Transaction hash: {truncateEthereumAddress(transaction.transactionHash)}</span>
                      <GnosisLink
                        href={`${GNOSIS_BASE_URL}/tx/${transaction.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewIcon />
                      </GnosisLink>
                    </StyledTransactionHashWithIcon>
                    <p>Executed: {transaction.executionDate}</p>
                  </>
                )}
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
                {transaction.executor && (
                  <>
                    <h4>Executor</h4>
                    <StyledTransactionHashWithIcon>
                      <span>- {truncateEthereumAddress(transaction.executor)}</span>
                      <GnosisLink
                        href={`${GNOSIS_BASE_URL}/address/${transaction.executor}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewIcon />
                      </GnosisLink>
                    </StyledTransactionHashWithIcon>
                  </>
                )}
              </List>
            </StyledBox>
          </Collapse>
        </StyledCollapsibleCell>
      </TableRow>
    </>
  );
}

function ModuleTransactionRow(props: { transaction: SafeModuleTransactionWithTransfersResponse }) {
  const { transaction } = props;
  const [open, set_open] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          scope="row"
        ></TableCell>
        <TableCell align="right">{transaction.module}</TableCell>
        <TableCell align="right">{transaction.value}</TableCell>
        <TableCell align="right">{transaction.executionDate}</TableCell>
        <TableCell align="right">{transaction.txType}</TableCell>
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
    </>
  );
}

function TransactionHistoryRow(props: { transaction: AllTransactionsListResponse['results'][0] }) {
  const { transaction } = props;

  const getTransactionTypeRow = (transaction: AllTransactionsListResponse['results'][0]) => {
    if (transaction.txType === 'ETHEREUM_TRANSACTION') {
      return <EthereumTransactionRow transaction={transaction} />;
    } else if (transaction.txType === 'MULTISIG_TRANSACTION') {
      return <MultisigTransactionRow transaction={transaction} />;
    } else if (transaction.txType === 'MODULE_TRANSACTION') {
      return <ModuleTransactionRow transaction={transaction} />;
    } else {
      return <></>;
    }
  };

  return getTransactionTypeRow(transaction);
}

function TransactionHistoryTable() {
  const dispatch = useAppDispatch();
  const safeTransactions = useAppSelector((state) => state.safe.allTransactions);
  const selectedSafeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);
  const signer = useEthersSigner();

  const fetchAllSafeTransaction = () => {
    if (signer && selectedSafeAddress) {
      dispatch(
        safeActionsAsync.getAllSafeTransactionsThunk({
          signer,
          safeAddress: selectedSafeAddress,
        }),
      );
    }
  };

  useEffect(() => {
    fetchAllSafeTransaction();
  }, [signer, selectedSafeAddress]);

  if (!selectedSafeAddress) {
    return <div>connect to safe</div>;
  }

  return (
    <TableContainer
      component={StyledPaper}
      title="Transaction history"
    >
      <Table aria-label="safe transaction history">
        <StyledTableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Source</TableCell>
            <TableCell align="right">Capability</TableCell>
            <TableCell align="right">Value/Currency</TableCell>
            <TableCell />
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {safeTransactions?.results.map((transaction, key) => (
            <TransactionHistoryRow
              transaction={transaction}
              key={key}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const PendingTransactionsTable = () => {
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

  return !selectedSafeAddress ? (
    <Title>Connect to safe</Title>
  ) : (
    <TableContainer component={StyledPaper}>
      <Table aria-label="safe pending transactions">
        <StyledTableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="left">Source</TableCell>
            <TableCell align="left">Capability</TableCell>
            <TableCell align="left">Value/Currency</TableCell>
            <TableCell align="left">Action</TableCell>
            <TableCell />
          </TableRow>
        </StyledTableHead>
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
  );
};

function SafeActions() {
  return (
    <Section
      lightBlue
      fullHeightMin
    >
      <StyledContainer>
        <div>
          <Title>pending actions</Title>
          <p>1. Transaction have to be signed/rejected according to their tabular order.</p>
          <p>2. After signing all parties can click on EXECUTE. One signature is sufficient.</p>
        </div>
        <PendingTransactionsTable />
        <Title>history</Title>
        <TransactionHistoryTable />
      </StyledContainer>
    </Section>
  );
}

export default SafeActions;
