import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { AllTransactionsListResponse, EthereumTxWithTransfersResponse, SafeModuleTransactionWithTransfersResponse, SafeMultisigTransactionWithTransfersResponse } from '@safe-global/api-kit'
import { useEffect, useState } from 'react';
import { useSigner } from '../hooks';
import { useAppDispatch, useAppSelector } from '../store';
import { safeActionsAsync } from '../store/slices/safe';
import { formatEther, parseEther } from 'viem';

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
      <TableRow>
        <TableCell>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              >
                Description
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
              >
                {/* <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.price * 100) / 100}</TableCell>
                    </TableRow>
                  ))}
                </TableBody> */}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function MultisigTransactionRow(props: { transaction: SafeMultisigTransactionWithTransfersResponse }) {
  const { transaction } = props;
  const [open, set_open] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          scope="row"
        >
          {transaction.nonce}
        </TableCell>
        <TableCell align="right">{BigInt(transaction.value) ? 'Sent' : 'Rejection'}</TableCell>
        <TableCell align="right"> {formatEther(BigInt(transaction.value))}</TableCell>
        <TableCell align="right">{transaction.executionDate}</TableCell>
        <TableCell align="right">{transaction.isExecuted ? 'SUCCESS' : 'NOT EXECUTED'}</TableCell>
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
        <TableCell>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              >
                Description
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
              >
                {/* <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.price * 100) / 100}</TableCell>
                    </TableRow>
                  ))}
                </TableBody> */}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
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
        >
          {}
        </TableCell>
        <TableCell align="right">{transaction.to}</TableCell>
        <TableCell align="right">{transaction.executionDate}</TableCell>
        <TableCell align="right">{transaction.blockNumber}</TableCell>
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
      <TableRow>
        <TableCell>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              >
                Description
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
              >
                {/* <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.price * 100) / 100}</TableCell>
                    </TableRow>
                  ))}
                </TableBody> */}
              </Table>
            </Box>
          </Collapse>
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
  const safeTransactions = useAppSelector((state) => state.safe.safeTransactions);
  const selectedSafeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);
  const { signer } = useSigner();

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
    <TableContainer component={Paper}>
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
  );
}
