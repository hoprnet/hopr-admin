import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useEthersSigner } from '../../hooks';
import { StepContainer } from './onboarding/components';
import { StyledInputGroup, StyledTextField } from './onboarding/styled';
import { browserClient } from '../../providers/wagmi';

// Components
import StartOnboarding from '../../components/Modal/staking-hub/StartOnboarding';
import NetworkOverlay from '../../components/NetworkOverlay';
import ConfirmModal from '../../components/Modal/staking-hub/ConfirmModal';
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';

// Mui
import { MenuItem, Select, TextField } from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';

// Blockchain
import { Address, parseUnits } from 'viem';
import { createApproveTransactionData } from '../../utils/blockchain';

// Store
import SafeTransactionButton from '../../components/SafeTransactionButton';
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActions, safeActionsAsync } from '../../store/slices/safe';
import { stakingHubActions } from '../../store/slices/stakingHub';

//Icons
import DeleteIcon from '@mui/icons-material/Delete';



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

const FlexContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

const Text = styled.p<{ center?: boolean }>`
  text-align: ${(props) => props.center && 'center'};
  font-weight: 500;
  color: #414141;
  margin: 0;
`;


export const SSafeTransactionButton = styled(SafeTransactionButton)`
  padding: 6px 16px;
`;

export default function EditOwners() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress) as Address;
  const safeModules = useAppSelector((state) => state.safe.info.data?.modules);
  const safeOwners = useAppSelector((store) => store.safe.info.data?.owners);
  const safeThreshold = useAppSelector((store) => store.stakingHub.safeInfo.data.threshold);
  const walletAddress = useAppSelector((store) => store.web3.account);
  const signer = useEthersSigner();
  const [newOwner, set_newOwner] = useState('');
  const [newThreshold, set_newThreshold] = useState<null | string>(null);
  const [updateSafeThresholdConfirm, set_updateSafeThresholdConfirm] = useState(false);
  const [pending, set_pending] = useState(false);
  const [confirmAddOwner, set_confirmAddOwner] = useState(false);
  const [confirmRemoveOwner, set_confirmRemoveOwner] = useState<false | string>(false);

  useEffect(()=>{
    set_newThreshold(safeThreshold);
  }, [safeThreshold])

  const addOwnerExecute = async () => {
    if (signer && selectedSafeAddress) {
      set_pending(true);
      const transactionData = await dispatch(
        safeActionsAsync.createAddOwnerToSafeTransactionDataThunk({
          ownerAddress: newOwner,
          safeAddress: selectedSafeAddress,
          signer: signer,
        }),
      ).unwrap();

      if (transactionData) {
        const transactionHash = await dispatch(safeActionsAsync.createAndExecuteSafeTransactionThunk({
          safeAddress: selectedSafeAddress,
          signer,
          safeTransactionData: transactionData,
        })).unwrap().then(async(transactionHash)=>{
          browserClient && await browserClient.waitForTransactionReceipt({ hash: transactionHash as `0x${string}` });
          dispatch(safeActions.addOwnerToSafe(newOwner));
          set_newOwner('');
        }).finally(async()=>{
          set_confirmAddOwner(false);
          set_pending(false);
          await fetch('https://stake.hoprnet.org/api/hub/generatedSafe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionHash: transactionHash,
              safeAddress: selectedSafeAddress,
              moduleAddress: safeModules?.[0] ?? '',
              ownerAddress: newOwner,
            }),
          });
        });
      }
    }
  };

  const addOwnerSign = async () => {
    if (signer && selectedSafeAddress) {
      set_pending(true);
      const transactionData = await dispatch(
        safeActionsAsync.createAddOwnerToSafeTransactionDataThunk({
          ownerAddress: newOwner,
          safeAddress: selectedSafeAddress,
          signer: signer,
        }),
      ).unwrap();

      if (transactionData) {
        await dispatch(
          safeActionsAsync.createSafeTransactionThunk({
            safeAddress: selectedSafeAddress,
            signer,
            safeTransactionData: transactionData,
          })).unwrap().finally(()=>{
            set_newOwner('');
            set_confirmAddOwner(false);
            set_pending(false);
          });
      }
    }
  };

  const updateSafeThresholdExecute = async () => {
    if (signer && selectedSafeAddress) {
      set_pending(true);
      const removeTransactionData = await dispatch(
        safeActionsAsync.createSetThresholdToSafeTransactionDataThunk({
          signer: signer,
          newThreshold: Number(newThreshold),
          safeAddress: selectedSafeAddress,
        })).unwrap();

      if (removeTransactionData) {
        await dispatch(
          safeActionsAsync.createAndExecuteSafeTransactionThunk({
            signer,
            safeAddress: selectedSafeAddress,
            safeTransactionData: removeTransactionData,
          })).unwrap().then(async(transactionHash)=>{
            browserClient && await browserClient.waitForTransactionReceipt({ hash: transactionHash as `0x${string}` });
          set_updateSafeThresholdConfirm(false);
          dispatch(stakingHubActions.updateThreshold(newThreshold));
        }).finally(()=>{
          set_pending(false);
        });

      }
    }
  };

  const updateSafeThresholdSign = async () => {
    if (signer && selectedSafeAddress) {
      set_pending(true);
      const removeTransactionData = await dispatch(
        safeActionsAsync.createSetThresholdToSafeTransactionDataThunk({
          signer: signer,
          newThreshold: Number(newThreshold),
          safeAddress: selectedSafeAddress,
        })).unwrap();

      if (removeTransactionData) {
        await dispatch(
          safeActionsAsync.createSafeTransactionThunk({
            signer: signer,
            safeAddress: selectedSafeAddress,
            safeTransactionData: removeTransactionData,
          }),
        ).unwrap().then(res => {
          set_updateSafeThresholdConfirm(false);
        }).finally(()=>{
          set_pending(false);
        });

      }
    }
  };

  const removeOwnerExecute = async () => {
    if (signer && selectedSafeAddress && confirmRemoveOwner && safeThreshold) {
      set_pending(true);
      const transactionData = await dispatch(safeActionsAsync.createRemoveOwnerFromSafeTransactionDataThunk({
        ownerAddress: confirmRemoveOwner,
        safeAddress: selectedSafeAddress,
        signer,
        threshold: parseInt(safeThreshold),
      })).unwrap()

      if (!transactionData) return;

      const transactionHash = await dispatch(safeActionsAsync.createAndExecuteSafeTransactionThunk({
        safeAddress: selectedSafeAddress,
        signer,
        safeTransactionData: transactionData,
      })).unwrap().then(async(transactionHash)=>{
        browserClient && await browserClient.waitForTransactionReceipt({ hash: transactionHash as `0x${string}` });
        dispatch(safeActions.removeOwnerFromSafe(confirmRemoveOwner));
      }).finally(async()=>{
        // set_confirmRemoveOwner(false);
        // set_pending(false);
        if(walletAddress && confirmRemoveOwner.toLowerCase() === walletAddress.toLowerCase()) {
          setTimeout(()=>{
            window.location.href = window.location.origin;
          }, 2_000)
        }
      });

    }
  };

  const removeOwnerSign = async () => {
    if (signer && selectedSafeAddress && confirmRemoveOwner && safeThreshold) {
      set_pending(true);
      const transactionData = await dispatch(safeActionsAsync.createRemoveOwnerFromSafeTransactionDataThunk({
        ownerAddress: confirmRemoveOwner,
        safeAddress: selectedSafeAddress,
        signer,
        threshold: parseInt(safeThreshold),
      })).unwrap()

      if (transactionData) {
        await dispatch(
          safeActionsAsync.createSafeTransactionThunk({
            safeAddress: selectedSafeAddress,
            signer,
            safeTransactionData: transactionData,
          })).unwrap().finally(()=>{
            set_confirmRemoveOwner(false);
            set_pending(false);
          });
      }
    }
  };
  const cantRemoveOwner = safeOwners?.length === parseInt(safeThreshold ? safeThreshold : '0');

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >

      <StepContainer
        title='MANAGE SAFE ACCOUNT OWNERS'
        description={`Add, remove and replace existing owners.`}
      >
        <br/><br/>
        <h4 className="inline">Owners ({safeOwners?.length}):</h4>
        <ul>
          {safeOwners?.map(owner =>
          <li key={`safe_owner_${owner}`}>
            {owner}
            {
              safeOwners.length !== 1 &&
              <Tooltip title={cantRemoveOwner ? 'Safe threshold can`t be lower than number of owners. Change nubmer of required confirmations first.' : 'Remove owner from Safe'}>
                <span>
                  <IconButton
                    aria-label="Remove owner from Safe"
                    disabled={cantRemoveOwner}
                    onClick={() => {
                      set_confirmRemoveOwner(owner ? owner : false);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            }
          </li>)}
        </ul>
        <StyledInputGroup style={{ alignItems: 'flex-start' }}>
          <StyledText>ADD OWNER</StyledText>
          <StyledTextField
            variant="outlined"
            placeholder="0x..."
            size="small"
            value={newOwner}
            style={{
              width: '500px',
            }}
            onChange={(e) => set_newOwner(e.target.value)}
          />
          <Button
            disabled={!newOwner.includes('0x')}
            onClick={()=>{set_confirmAddOwner(true)}}
          >
            ADD
          </Button>
        </StyledInputGroup>
        <br/><br/><br/>
        <div className="inline"><h4 className="inline">Required confirmations:</h4> <Select
            value={newThreshold}
            onChange={(e) => set_newThreshold(e.target.value)}
            MenuProps={{ disableScrollLock: true }}
            style={{
              width: '80px',
            }}
          >
            {safeOwners?.map((_, index) => (
              <MenuItem
                key={index + 1}
                value={`${index + 1}`}
              >
                {index + 1}
              </MenuItem>
            ))}
          </Select> out of {safeOwners?.length} owner(s)
        </div>
        <Button
          disabled={newThreshold === safeThreshold || newThreshold === '0'}
          onClick={()=>{set_updateSafeThresholdConfirm(true)}}
        >UPDATE</Button>
      </StepContainer>

      <ConfirmModal
        open={confirmAddOwner}
        onNotConfirm={()=>{set_confirmAddOwner(false)}}
        title={'Add owner'}
        description={`Are you sure that you want to add new owner (${newOwner}) to your safe?`}
        notConfirmText={'NO'}
        confirmButton={
          <SSafeTransactionButton
            executeOptions={{
              pending: pending,
              onClick: addOwnerExecute,
              buttonText: 'ADD',
            }}
            signOptions={{
              pending: pending,
              onClick: addOwnerSign,
              buttonText: 'SIGN ADD',
            }}
            safeInfo={safeInfo}
          />
        }
      />

      <ConfirmModal
        open={updateSafeThresholdConfirm}
        onNotConfirm={()=>{set_updateSafeThresholdConfirm(false)}}
        title={'Update threshold'}
        description={`Are you sure that you want to change threshold to ${newThreshold} owners`}
        notConfirmText={'NO'}
        confirmButton={
          <SSafeTransactionButton
            executeOptions={{
              pending: pending,
              onClick: updateSafeThresholdExecute,
              buttonText: 'UPDATE',
            }}
            signOptions={{
              pending: pending,
              onClick: updateSafeThresholdSign,
              buttonText: 'SIGN UPDATE',
            }}
            safeInfo={safeInfo}
          />
        }
      />

        <ConfirmModal
          open={!!confirmRemoveOwner}
          onNotConfirm={()=>{set_confirmRemoveOwner(false)}}
          title={'Remove owner'}
          description={`Are you sure that you want to change remove ${confirmRemoveOwner} from owners?`}
          notConfirmText={'NO'}
          confirmButton={
            <SSafeTransactionButton
              executeOptions={{
                pending: pending,
                onClick: removeOwnerExecute,
                buttonText: 'REMOVE',
              }}
              signOptions={{
                pending: pending,
                onClick: removeOwnerSign,
                buttonText: 'SIGN REMOVE',
              }}
              safeInfo={safeInfo}
          />
        }
      />
{/*
      <StartOnboarding/>
      <NetworkOverlay/> */}
    </Section>
  );
}
