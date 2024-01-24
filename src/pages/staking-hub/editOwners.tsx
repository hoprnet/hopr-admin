// UI
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_ALLOWANCE, HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../config'
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
import { useEthersSigner } from '../../hooks';
import { StepContainer } from './onboarding/components';
import { Lowercase, StyledCoinLabel, StyledInputGroup, StyledTextField } from './onboarding/styled';

import StartOnboarding from '../../components/Modal/staking-hub/StartOnboarding';
import NetworkOverlay from '../../components/NetworkOverlay';

// Blockchain
import { Address, parseUnits } from 'viem';
import { createApproveTransactionData } from '../../utils/blockchain';

// Store
import { useState } from 'react';
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
  const [loading, set_loading] = useState(false);

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
          <Button onClick={() => addOwner()}>EXECUTE</Button>
        </StyledInputGroup>
        <br/><br/><br/>
        <div className="inline"><h4 className="inline">Required confirmations:</h4> {safeThreshold} out of {safeOwners.length} owners.</div>

      </StepContainer>

      <StartOnboarding/>
      <NetworkOverlay/>
    </Section>
  );
}
