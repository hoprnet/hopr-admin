import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { parseUnits } from 'viem';
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';
import { createSendTokensTransactionData } from '../../utils/blockchain';
import { useEthersSigner } from '../../hooks';
import { xHOPR_TOKEN_SMART_CONTRACT_ADDRESS, wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS } from '../../../config';

// components
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
import Card from '../../components/Card';

// Mui
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Select from '../../future-hopr-lib-components/Select';
import { SelectChangeEvent } from '@mui/material/Select';
import { getUserActionForPendingTransaction, getUserCanSkipProposal } from '../../utils/safeTransactions';

const StyledForm = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  border-bottom: 1px solid #414141;
  justify-content: center;
  padding-bottom: 16px;
`;

const StyledInstructions = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledText = styled.h3`
  color: var(--414141, #414141);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-align: end;
`;

const StyledDescription = styled.p`
  color: #414141;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.35px;
`;

const StyledInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  gap: 10px;
`;

const StyledCoinLabel = styled.p`
  color: var(--414141, #414141);
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.35px;
`;

const StyledButtonGroup = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const StyledBlueButton = styled(Button)`
  text-transform: uppercase;
  padding: 0.2rem 4rem;
`;

const StyledPendingSafeTransactions = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWithLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const supportedTokens = [
  {
    value: 'xdai',
    name: 'xDai',
  },
  {
    value: 'wxhopr',
    name: 'wxHOPR',
    smartContract: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
  },
  {
    value: 'xhopr',
    name: 'xHOPR',
    smartContract: xHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
  },
];

const supportedTokensValues = supportedTokens.map((elem) => elem.value);
type SupportedTokens = (typeof supportedTokensValues)[number];
const isSupportedToken = (x: string | null): x is SupportedTokens => (x ? supportedTokensValues.includes(x) : false);

function SafeWithdraw() {
  const dispatch = useAppDispatch();
  // hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenParam = searchParams.get('token');
  const pendingTransactions = useAppSelector((store) => store.safe.pendingTransactions.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const address = useAppSelector((store) => store.web3.account);
  // local state
  const [userCanSkipProposal, set_userCanSkipProposal] = useState(false);
  const [userAction, set_userAction] = useState<'EXECUTE' | 'SIGN' | null>(null);
  const [ethValue, set_ethValue] = useState<string>('');
  const [receiver, set_receiver] = useState<string>('');
  const [token, set_token] = useState<SupportedTokens>(isSupportedToken(tokenParam) ? tokenParam : 'xdai');
  const [isSigning, set_isSigning] = useState<boolean>();
  const [isExecuting, set_isExecuting] = useState<boolean>();
  const [proposedTxHash, set_proposedTxHash] = useState<string>();
  const [proposedTx, set_proposedTx] = useState<SafeMultisigTransactionResponse>();

  const signer = useEthersSigner();

  useEffect(() => {
    if (proposedTxHash) {
      const foundProposedTx = pendingTransactions?.results.find((tx) => tx.transactionHash === proposedTxHash);
      if (foundProposedTx && address) {
        set_proposedTx(foundProposedTx);
        set_userAction(getUserActionForPendingTransaction(foundProposedTx, address));
      }
    }
  }, [pendingTransactions, proposedTxHash, address]);

  useEffect(() => {
    set_userCanSkipProposal(getUserCanSkipProposal(safeInfo));
  }, [safeInfo]);

  const proposeTx = () => {
    if (signer && Number(ethValue) && selectedSafeAddress) {
      set_isSigning(true);

      if (token === 'xdai') {
        const parsedValue = parseUnits(ethValue as `${number}`, 18).toString();
        dispatch(
          safeActionsAsync.createSafeTransactionThunk({
            signer,
            safeAddress: selectedSafeAddress,
            safeTransactionData: {
              to: receiver,
              value: parsedValue as string,
              data: '0x',
            },
          }),
        )
          .unwrap()
          .then((safeTxHash) => {
            set_proposedTxHash(safeTxHash);
          })
          .finally(() => {
            set_isSigning(false);
          });
      } else {
        const smartContractAddress = supportedTokens.filter((elem) => elem.value === token)[0].smartContract as string;
        const parsedValue = parseUnits(ethValue as `${number}`, 18).toString() as unknown;
        dispatch(
          safeActionsAsync.createSafeContractTransaction({
            data: createSendTokensTransactionData(receiver as `0x${string}`, parsedValue as bigint),
            signer,
            safeAddress: selectedSafeAddress,
            smartContractAddress,
          }),
        )
          .unwrap()
          .then((safeTxHash) => {
            set_proposedTxHash(safeTxHash);
          })
          .finally(() => {
            set_isSigning(false);
          });
      }
    }
  };

  const executeTx = async () => {
    set_isExecuting(true);
    if (proposedTxHash && signer && selectedSafeAddress) {
      const safeTx = pendingTransactions?.results.find((tx) => {
        if (tx.safeTxHash === proposedTxHash) {
          return true;
        }
        return false;
      });

      if (safeTx) {
        await dispatch(
          safeActionsAsync.executePendingTransactionThunk({
            safeAddress: selectedSafeAddress,
            signer,
            safeTransaction: safeTx,
          }),
        )
          .unwrap()
          .finally(() => {
            set_isExecuting(false);
          });
      } else {
        set_isExecuting(false);
      }
    }
  };

  const createAndExecuteTx = () => {
    if (signer && Number(ethValue) && selectedSafeAddress) {
      set_isExecuting(true);
      if (token === 'xdai') {
        const parsedValue = parseUnits(ethValue as `${number}`, 18).toString();
        dispatch(
          safeActionsAsync.createAndExecuteTransactionThunk({
            signer,
            safeAddress: selectedSafeAddress,
            safeTransactionData: {
              to: receiver,
              value: parsedValue as string,
              data: '0x',
            },
          }),
        )
          .unwrap()
          .then((transactionResponse) => {
            set_proposedTxHash(transactionResponse);
          })
          .finally(() => {
            set_isExecuting(false);
          });
      } else {
        const smartContractAddress = supportedTokens.filter((elem) => elem.value === token)[0].smartContract as string;
        const parsedValue = parseUnits(ethValue as `${number}`, 18).toString() as unknown;
        dispatch(
          safeActionsAsync.createAndExecuteContractTransactionThunk({
            data: createSendTokensTransactionData(receiver as `0x${string}`, parsedValue as bigint),
            signer,
            safeAddress: selectedSafeAddress,
            smartContractAddress,
          }),
        )
          .unwrap()
          .then((transactionResponse) => {
            set_proposedTxHash(transactionResponse);
          })
          .finally(() => {
            set_isExecuting(false);
          });
      }
    }
  };

  const getErrorsForSafeTx = ({ customValidator }: { customValidator?: () => { errors: string[] } }) => {
    const errors: string[] = [];

    if (!signer) {
      errors.push('wallet is required');
    }

    if (!selectedSafeAddress) {
      errors.push('safe is required');
    }

    if (!receiver) {
      errors.push('receiver is required');
    }

    // only require xDai value if there
    // is no proposed tx
    if (!ethValue && !proposedTx) {
      errors.push('xDai value is required');
    }

    if (customValidator) {
      const customErrors = customValidator();
      errors.push(...customErrors.errors);
    }

    return errors;
  };

  const getErrorsForApproveButton = () =>
    getErrorsForSafeTx({ customValidator: () => {
      return Number(ethValue) ? { errors: [] } : { errors: ['xdai value is required'] };
    } });

  const getErrorsForExecuteButton = () =>
    getErrorsForSafeTx({ customValidator: () => {
      // no user action means the user can not do anything
      return !userAction ? { errors: [] } : { errors: ['transaction requires more approvals'] };
    } });

  const handleChangeToken = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as string;
    if (isSupportedToken(value)) {
      set_token(value);
      setSearchParams(`token=${value}`);
    }
  };

  // multiple owners is out of scope for initial version
  // const handleApprove = () => {
  //   if (signer && proposedTx) {
  //     dispatch(
  //       safeActionsAsync.confirmTransactionThunk({
  //         signer,
  //         safeAddress: proposedTx.safe,
  //         safeTransactionHash: proposedTx.safeTxHash,
  //       }),
  //     );
  //   }
  // };

  return (
    <Section
      lightBlue
      center
      fullHeightMin
    >
      <Card
        image={{
          src: '/assets/funds-safe-withdraw.svg',
          height: 130,
          alt: 'Withdraw Token from Safe',
        }}
        title="Withdraw from Staking Hub"
      >
        <div>
          <StyledForm>
            <StyledInstructions>
              <StyledText>WITHDRAW</StyledText>
            </StyledInstructions>
            <StyledInputGroup>
              <InputWithLabel>
                <Select
                  size="small"
                  values={supportedTokens}
                  value={token}
                  onChange={handleChangeToken}
                  style={{
                    width: '230px',
                    margin: 0,
                  }}
                />
                <StyledCoinLabel>Token</StyledCoinLabel>
              </InputWithLabel>
              <InputWithLabel>
                <TextField
                  variant="outlined"
                  placeholder="-"
                  size="small"
                  value={receiver}
                  onChange={(e) => set_receiver(e.target.value)}
                  InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                />
                <StyledCoinLabel>Receiver</StyledCoinLabel>
              </InputWithLabel>
              <InputWithLabel>
                <TextField
                  variant="outlined"
                  placeholder="-"
                  size="small"
                  value={ethValue}
                  onChange={(e) => set_ethValue(e.target.value)}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                />
                <StyledCoinLabel>{supportedTokens.filter((elem) => elem.value === token)[0].name}</StyledCoinLabel>
              </InputWithLabel>
            </StyledInputGroup>
          </StyledForm>
          {!!proposedTx && (
            <StyledPendingSafeTransactions>
              <StyledDescription>
                {userAction === 'EXECUTE'
                  ? 'transaction has been approved by required owners, now can be executed'
                  : `transaction is pending ${
                    (proposedTx?.confirmationsRequired ?? 0) - (proposedTx?.confirmations?.length ?? 0)
                  } approvals`}
              </StyledDescription>
              {/* Multiple owners are out of scope, leaving the code here for the future */}
              {/* {!transactionHasEnoughApprovals() && (
                <StyledApproveButton onClick={handleApprove}>approve/sign</StyledApproveButton>
              )} */}
            </StyledPendingSafeTransactions>
          )}
          <StyledButtonGroup>
            {!userCanSkipProposal ? (
              <Tooltip title={isSigning ? 'Signing transaction' : getErrorsForApproveButton().at(0)}>
                <span>
                  <StyledBlueButton
                    disabled={!!getErrorsForApproveButton().length || isSigning}
                    onClick={proposeTx}
                  >
                    Sign
                  </StyledBlueButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title={isExecuting ? 'Executing transaction' : getErrorsForExecuteButton().at(0)}>
                <span>
                  <StyledBlueButton
                    disabled={!!getErrorsForExecuteButton().length || isExecuting}
                    // no need to propose tx with only 1 threshold
                    onClick={proposedTx ? executeTx : createAndExecuteTx}
                  >
                    Execute
                  </StyledBlueButton>
                </span>
              </Tooltip>
            )}
          </StyledButtonGroup>
          {isSigning && <p>Signing transaction with nonce...</p>}
        </div>
      </Card>
    </Section>
  );
}

export default SafeWithdraw;
