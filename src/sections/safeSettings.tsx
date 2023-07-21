import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { safeActionsAsync, safeActions } from '../store/slices/safe';
import { useEthersSigner } from '../hooks';
import Section from '../future-hopr-lib-components/Section';
import { Container, FlexContainer, Text } from '../steps/safeOnboarding/styled';
import { Button, MenuItem, Select } from '@mui/material';

function SafeSettings() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((selector) => selector.safe.safeInfo);
  const currentSafe = useAppSelector((selector) => selector.safe.selectedSafeAddress);
  const signer = useEthersSigner();
  const [threshold, set_threshold] = useState(safe?.threshold || 0);
  const [newOwner, set_newOwner] = useState('');

  useEffect(() => {
    fetchInitialStateForSigner();
    console.log(currentSafe);
  }, [signer]);

  const fetchInitialStateForSigner = async () => {
    if (signer && currentSafe) {
      dispatch(safeActions.resetState());
      dispatch(
        safeActionsAsync.getSafeInfoThunk({
          signer,
          safeAddress: currentSafe,
        }),
      );
      console.log(currentSafe);
      console.log(safe);
    }
  };

  const updateSafeThreshold = () => {
    if (signer && currentSafe) {
      const trx = dispatch(
        safeActionsAsync.updateSafeThresholdThunk({
          signer: signer,
          newThreshold: threshold,
          safeAddress: currentSafe,
        }),
      );
      //   dispatch(
      //     safeActionsAsync.confirmTransactionThunk({
      //       safeAddress: currentSafe,
      //       safeTransactionHash: trx.requestId,
      //       signer,
      //     }),
      //   );
      dispatch(
        safeActionsAsync.getAllSafeTransactionsThunk({
          safeAddress: currentSafe,
          signer: signer,
        }),
      );
      console.log(trx);
    }
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
          disabled={threshold === safe?.threshold}
          onClick={updateSafeThreshold}
        >
          Update
        </Button>
      </Container>
      <h2>Add Owner</h2>
      <Container column></Container>
    </Section>
  );
}

export default SafeSettings;
