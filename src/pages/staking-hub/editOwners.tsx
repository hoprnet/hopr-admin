import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useEthersSigner } from '../../hooks';
import { StepContainer } from './onboarding/components';
import { StyledInputGroup, StyledTextField } from './onboarding/styled';

// Components
import StartOnboarding from '../../components/Modal/staking-hub/StartOnboarding';
import NetworkOverlay from '../../components/NetworkOverlay';
import ConfirmModal from '../../components/Modal/staking-hub/ConfirmModal';
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
import { MenuItem, Select, TextField } from '@mui/material';

// Blockchain
import { Address, parseUnits } from 'viem';
import { createApproveTransactionData } from '../../utils/blockchain';

// Store
import SafeTransactionButton from '../../components/SafeTransactionButton';
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';
import { stakingHubActions } from '../../store/slices/stakingHub';



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


export const ConfirmButton = styled(SafeTransactionButton)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export default function EditOwners() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const safeModules = useAppSelector((state) => state.safe.info.data?.modules);
  const safeOwners = useAppSelector((store) => store.stakingHub.safeInfo.data.owners);
  const safeThreshold = useAppSelector((store) => store.stakingHub.safeInfo.data.threshold);
  const signer = useEthersSigner();
  const [newOwner, set_newOwner] = useState('');
  const [newThreshold, set_newThreshold] = useState<null | string>(null);
  const [confirmUpdateSafeThreshold, set_confirmUpdateSafeThreshold] = useState(false);
  const [confirmAddOwner, set_confirmAddOwner] = useState(false);

  useEffect(()=>{
    set_newThreshold(safeThreshold);
  }, [safeThreshold])

  const addOwner = async () => {
    if (signer && selectedSafeAddress) {
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
        })).unwrap();

        dispatch(stakingHubActions.addOwnerToSafe(newOwner));
        set_newOwner('');

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
      }
    }
  };

  const updateSafeThreshold = async () => {
    if (signer && selectedSafeAddress) {
      const removeTransactionData = await dispatch(safeActionsAsync.createSetThresholdToSafeTransactionDataThunk({
        signer: signer,
        newThreshold: Number(newThreshold),
        safeAddress: selectedSafeAddress,
      })).unwrap()

      if (removeTransactionData) {
        await dispatch(
          safeActionsAsync.createSafeTransactionThunk({
            signer: signer,
            safeAddress: selectedSafeAddress,
            safeTransactionData: removeTransactionData,
          }),
        );
      }
    }
  };


  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >

      <StepContainer
        title='MANAGE SAFE ACCOUNT OWNERS'
        description={`Add, remove and replace or rename existing owners.`}
      >
        <br/><br/>
        <h4 className="inline">Owners ({safeOwners.length}):</h4>
        <ul>
          {safeOwners?.map(elem => elem?.owner?.id && <li key={`safe_owner_${elem.owner.id}`}>{elem.owner.id}</li>)}
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
            EXECUTE
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
          </Select> out of {safeOwners.length} owner(s)
        </div>
        <Button
          disabled={newThreshold === safeThreshold || newThreshold === '0'}
          onClick={()=>{set_confirmUpdateSafeThreshold(true)}}
        >UPDATE</Button>
      </StepContainer>

      <ConfirmModal
        open={confirmAddOwner}
        onConfirm={() => addOwner()}
        onNotConfirm={()=>{set_confirmAddOwner(false)}}
        title={'Add owner'}
        description={`Are you sure that you want to add new owner (${newOwner}) to your safe?`}
        confirmText={'YES'}
        notConfirmText={'NO'}
      />

      <ConfirmModal
        open={confirmUpdateSafeThreshold}
        onConfirm={() => updateSafeThreshold()}
        onNotConfirm={()=>{set_confirmUpdateSafeThreshold(false)}}
        title={'Update threshold'}
        description={`Are you sure that you want to change threshold to ${newThreshold} owners`}
        confirmText={'YES'}
        notConfirmText={'NO'}
      />

      <StartOnboarding/>
      <NetworkOverlay/>
    </Section>
  );
}
