import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
  TableRow
} from '@mui/material';
import { AllTransactionsListResponse, EthereumTxWithTransfersResponse, SafeModuleTransactionWithTransfersResponse, SafeMultisigTransactionWithTransfersResponse } from '@safe-global/api-kit'
import { useEffect, useState } from 'react';
import { useEthersSigner } from '../hooks';
import { useAppDispatch, useAppSelector } from '../store';
import { safeActionsAsync } from '../store/slices/safe';
import { formatEther } from 'viem';
import styled from '@emotion/styled';
import { truncateEthereumAddress } from '../utils/helpers';
import Section from '../future-hopr-lib-components/Section';

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
    }
  };

  return getTransactionTypeRow(transaction);
}

export default function SafeTransactionHistoryPage() {
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
    <Section lightBlue>
      <TableContainer
        component={Paper}
        title="Transaction history"
      >
        <Table aria-label="safe transaction history">
          <TableHead>
            <TableRow>
              <TableCell>Nonce</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
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
    </Section>
  );
}
