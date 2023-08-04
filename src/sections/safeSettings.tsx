import { Container, FlexContainer, Text } from '../steps/safeOnboarding/styled';
import { MenuItem, Select, TextField } from '@mui/material';
import { safeActionsAsync, safeActions } from '../store/slices/safe';
import { useAppDispatch, useAppSelector } from '../store';
import { useEthersSigner } from '../hooks';
import { useState, useEffect } from 'react';
import Button from '../future-hopr-lib-components/Button';
import Section from '../future-hopr-lib-components/Section';
import styled from '@emotion/styled';

const RemoveOwnerDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

function SafeSettings() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((state) => state.safe.info);
  const safeAddress = useAppSelector((state) => state.safe.selectedSafeAddress);

  const signer = useEthersSigner();
  const [threshold, set_threshold] = useState(safe?.threshold || 0);
  const [newOwner, set_newOwner] = useState('');

  useEffect(() => {
    fetchInitialStateForSigner();
  }, [signer]);

  useEffect(() => {
    if (safeAddress && signer) {
      dispatch(
        safeActionsAsync.getSafeInfoThunk({
          signer,
          safeAddress: safeAddress,
        }),
      );
      set_threshold(safe!.threshold);
    }
  }, [safeAddress]);

  const fetchInitialStateForSigner = async () => {
    if (signer && safeAddress) {
      dispatch(
        safeActionsAsync.getSafeInfoThunk({
          signer,
          safeAddress: safeAddress,
        }),
      );
    }
  };

  const updateSafeThreshold = () => {
    if (signer && safeAddress) {
      dispatch(
        safeActionsAsync.updateSafeThresholdThunk({
          signer: signer,
          newThreshold: threshold,
          safeAddress: safeAddress,
        }),
      );
      dispatch(
        safeActionsAsync.getAllSafeTransactionsThunk({
          safeAddress: safeAddress,
          signer: signer,
        }),
      );
    }
  };

  const handleNewOwnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const owner = event.target.value;
    set_newOwner(owner);
  };

  const removeOwner = (address: string) => {
    if (signer && safeAddress)
      dispatch(
        safeActionsAsync.removeOwnerFromSafeThunk({
          ownerAddress: address,
          safeAddress: safeAddress,
          signer,
          threshold: safe?.threshold,
        }),
      );
  };

  const addOwner = () => {
    if (signer && safeAddress)
      dispatch(
        safeActionsAsync.addOwnerToSafeThunk({
          ownerAddress: newOwner,
          safeAddress: safeAddress,
          signer: signer,
          threshold: safe?.threshold,
        }),
      );
  };

  return (
    <Section
      className="Section--safe-settings"
      id="Section--safe-settings"
      lightBlue
      fullHeightMin
    >
      <h1>Safe Settings</h1>
      <h2>Threshold</h2>
      <Container column>
        <Text>Any transaction requires the confirmation of:</Text>
        <Text>Currently: {safe?.threshold}</Text>
        <FlexContainer>
          <Text>New:</Text>
          <Select
            value={threshold}
            onChange={(e) => set_threshold(Number(e.target.value))}
          >
            {safe?.owners.map((_, index) => (
              <MenuItem
                key={index + 1}
                value={`${index + 1}`}
              >
                {index + 1}
              </MenuItem>
            ))}
          </Select>
          <Text>Out of {safe?.owners.length} owner(s).</Text>
        </FlexContainer>
        <Button
          disabled={threshold === safe?.threshold || threshold == 0}
          onClick={updateSafeThreshold}
        >
          Update
        </Button>
      </Container>
      <h2>Add Owner</h2>
      <Container column>
        <TextField
          type="text"
          name="newOwner"
          label="address"
          placeholder="New owner address here..."
          onChange={handleNewOwnerChange}
          value={newOwner}
        />
        <Button
          onClick={addOwner}
          disabled={newOwner === '' || safe === null || safe?.owners.includes(newOwner)}
        >
          Add owner
        </Button>
      </Container>
      <h2>Remove Owner</h2>
      <Container column>
        {safe?.owners.map((address, id) => (
          <RemoveOwnerDiv key={`remove-ownner_${id}`}>
            <p>{address}</p>
            <Button onClick={() => removeOwner(address)}>Remove</Button>
          </RemoveOwnerDiv>
        ))}
      </Container>
    </Section>
  );
}

export default SafeSettings;
