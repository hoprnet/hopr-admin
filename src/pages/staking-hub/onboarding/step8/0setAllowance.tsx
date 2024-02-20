import { useState, useEffect } from 'react';

// UI
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { useEthersSigner } from '../../../../hooks';
import { StepContainer } from '../components';
import { Lowercase, StyledCoinLabel, StyledInputGroup, StyledTextField } from '../styled';
import { useNavigate } from 'react-router-dom';

// Web3
import { Address, parseUnits } from 'viem';
import {
  HOPR_CHANNELS_SMART_CONTRACT_ADDRESS,
  DEFAULT_ALLOWANCE,
   HOPR_TOKEN_USED_CONTRACT_ADDRESS,
   wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS
} from '../../../../../config'
import { createApproveTransactionData } from '../../../../utils/blockchain';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { formatEther } from 'viem';

// Store
import { FeedbackTransaction } from '../../../../components/FeedbackTransaction';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import SafeTransactionButton from '../../../../components/SafeTransactionButton';

const StyledText = styled.h3`
  color: var(--414141, #414141);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-align: end;
  margin: 0;
  margin-top: 5px;
`;

export const SSafeTransactionButton = styled(SafeTransactionButton)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export default function SetAllowance() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress) as Address;
  const moduleAddress = useAppSelector((state) => state.stakingHub.onboarding.moduleAddress) as Address;
  const walletAddress =  useAppSelector((store) => store.web3.account);
  const pendingTransations = useAppSelector((store) => store.safe.pendingTransactions.data?.results);
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const threshold = safeInfo?.threshold;
  const signer = useEthersSigner();
  const [wxHoprValue, set_wxHoprValue] = useState('');
  const [isWalletLoading, set_isWalletLoading] = useState(false);
  const [transactionHash, set_transactionHash] = useState<Address>();
  const [thisTransactionIsWaitingToSign, set_thisTransactionIsWaitingToSign] = useState(false);
  const [thisTransactionHasSignaturesIsWaitingToExecute, set_thisTransactionHasSignaturesIsWaitingToExecute] = useState<false | SafeMultisigTransactionResponse>(false);

  useEffect(()=>{
    if(walletAddress && wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS && threshold && threshold > 1) {
      if(pendingTransations && pendingTransations.length !== 0) {
        try{
          for(let i = 0; i < pendingTransations.length; i++) {
            if(
              pendingTransations[i] &&
              wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS === pendingTransations[i].to &&
              pendingTransations[i].data && typeof(pendingTransations[i].data) === 'string' &&
              //ex: "0x095ea7b3000000000000000000000000693bac5ce61c720ddc68533991ceb41199d8f8ae00000000000000000000000000000000000000000000006c5db2a4d815dc0000"
              //  pendingTransations[i].data.slice(0,10) === '0xb5736962' && pendingTransations[i].data.slice(50,73) === '01020100000000000000000' &&
              // @ts-ignore
              pendingTransations[i].data.slice(34,74).toLowerCase() === HOPR_CHANNELS_SMART_CONTRACT_ADDRESS.toLowerCase().slice(2,42) &&
              pendingTransations[i].confirmations!.length > 0
            ) {
              console.log('[Onboarding check] We have an onboarding TX created for that ALLOWANCE', pendingTransations[i])
              const confirmationsDone = pendingTransations[i].confirmations!.length | 0;
              const confirmations = pendingTransations[i].confirmations;

              //If not last signature needed
              for(let j = 0; j < confirmationsDone; j++) {
                // @ts-ignore
                const confirmation = confirmations[j];
                const signerOfTheConfirmation = confirmation.owner;
                if(signerOfTheConfirmation === walletAddress) {
                  set_thisTransactionIsWaitingToSign(true);
                  return;
                }
              }

              // If this is the last signature or we have all signatures
              if(pendingTransations[i].confirmationsRequired - 1 >= confirmationsDone) {
                console.log('pendingTransations[i]', pendingTransations[i]);
                set_thisTransactionHasSignaturesIsWaitingToExecute(pendingTransations[i]);
                // @ts-ignore
                if(pendingTransations[i].dataDecoded?.parameters[1].value) {
                  // @ts-ignore
                  set_wxHoprValue(formatEther(pendingTransations[i].dataDecoded?.parameters[1].value))
                }
                return
              }

            }
          }
        } catch (e) {
          console.error("Error while trying to get onboarding status with multi-sig account.", e)
        }
      }
    }
  },[threshold, pendingTransations, wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS, walletAddress])

  const executeAllowance = async () => {
    if (signer && selectedSafeAddress && HOPR_CHANNELS_SMART_CONTRACT_ADDRESS) {
      set_isWalletLoading(true);
      await dispatch(
        safeActionsAsync.createAndExecuteSafeContractTransactionThunk({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, parseUnits(wxHoprValue, 18)),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      )
        .unwrap()
        .then((hash) => {
          set_transactionHash(hash as Address);
          dispatch(stakingHubActions.setOnboardingStep(16));
        })
        .finally(() => {
          set_isWalletLoading(false);
        });
    }
  };

  const signAllowance = async () => {
    if (signer && selectedSafeAddress && HOPR_CHANNELS_SMART_CONTRACT_ADDRESS) {
      set_isWalletLoading(true);
      await dispatch(
        safeActionsAsync.createSafeContractTransactionThunk({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, parseUnits(wxHoprValue, 18)),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      )
        .unwrap()
        .finally(() => {
          set_isWalletLoading(false);
          navigate('/staking/dashboard#transactions');
        });
    }
  };

  const executeSignedAllowance = async (transaction: SafeMultisigTransactionResponse) => {
    if (signer && selectedSafeAddress && moduleAddress){
      await dispatch(
        safeActionsAsync.executePendingTransactionThunk({
          safeAddress: transaction.safe,
          signer,
          safeTransaction: transaction,
        }),
      ).unwrap().then(() => {
        dispatch(stakingHubActions.setOnboardingStep(16));
      });
    }
  };

  return (
    <StepContainer
      title="SET wxHOPR ALLOWANCE"
      description={`Your node will need to access wxHOPR from your safe to fund payment channels on the HOPR network. You can set a maximum allowance to reduce your funds at risk in case your node is ever compromised.`}
      buttons={
        thisTransactionHasSignaturesIsWaitingToExecute ?
        <Button
          onClick={()=>{executeSignedAllowance(thisTransactionHasSignaturesIsWaitingToExecute)}}
        >
          EXECUTE
        </Button>
        :
        <SSafeTransactionButton
          executeOptions={{
            onClick: executeAllowance,
            disabled: wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+'),
            pending: isWalletLoading,
            buttonText: 'EXECUTE',
          }}
          safeInfo={safeInfo}
          signOptions={{
            onClick: signAllowance,
            disabled: wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+') || thisTransactionIsWaitingToSign,
            pending: isWalletLoading,
            buttonText: 'SIGN',
            tooltipText: thisTransactionIsWaitingToSign ? 'You need to sign this transaction by using another owner' : undefined
          }}
        />
      }
    >
      <StyledInputGroup style={{ alignItems: 'flex-start' }}>
        <StyledText>NODE ALLOWANCE</StyledText>
        <StyledTextField
          type="number"
          variant="outlined"
          placeholder="-"
          size="small"
          value={wxHoprValue}
          onChange={(e) => set_wxHoprValue(e.target.value)}
          InputProps={{ inputProps: {
            style: { textAlign: 'right' },
            min: 0,
            pattern: '[0-9]*',
          } }}
          helperText={`Suggested value is ${DEFAULT_ALLOWANCE} wxHopr`}
          disabled={!!thisTransactionHasSignaturesIsWaitingToExecute}
        />
        <StyledCoinLabel style={{ lineHeight: '40px' }}>
          <Lowercase>wx</Lowercase>HOPR
        </StyledCoinLabel>
        <Button
          onClick={() => set_wxHoprValue(DEFAULT_ALLOWANCE.toString())}
          disabled={!!thisTransactionHasSignaturesIsWaitingToExecute}
        >DEFAULT</Button>
      </StyledInputGroup>
      {thisTransactionHasSignaturesIsWaitingToExecute &&
        <span>
          <br/>
          This transaction was already proposed by another owner. You can simply execute it.
        </span>
      }
      <FeedbackTransaction
        confirmations={1}
        isWalletLoading={isWalletLoading}
        feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
        transactionHash={transactionHash}
      />
    </StepContainer>
  );
}
