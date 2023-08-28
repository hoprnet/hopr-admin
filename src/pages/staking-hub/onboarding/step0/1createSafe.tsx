import { useState } from 'react';
import { useWalletClient } from 'wagmi';

// Components
import { IconButton, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer } from '../components';
import {
  ButtonContainer,
  Container,
  FlexContainer,
  StyledError,
  StyledGrayButton,
  Text
} from '../safeOnboarding/styled';

// Icons
import CopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

const CreateSafe = () => {
  const dispatch = useAppDispatch();
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState<unknown>('');
  const [owners, set_owners] = useState<{ id: string; address: string }[]>([]);
  const [threshold] = useState(1);
  const account = useAppSelector((store) => store.web3.account);
  const { data: walletClient } = useWalletClient();

  const updateOwnerAddress = (id: string, address: string) => {
    set_owners((prevOwners) => {
      return prevOwners.map((prevOwner) => {
        if (prevOwner.id === id) {
          return {
            ...prevOwner,
            address,
          };
        } else return prevOwner;
      });
    });
  };

  const removeOwner = (id: string) => {
    set_owners((prevOwners) => {
      return prevOwners.filter((prevOwner) => prevOwner.id !== id);
    });
  };

  const handleContinueClick = async () => {
    if (!walletClient) return;

    const config = {
      owners: [account as string],
      threshold,
    };

    try {
      set_error('');
      set_loading(true);
      await dispatch(
        safeActionsAsync.createSafeWithConfigThunk({
          config,
          walletClient,
        }),
      ).unwrap();
      dispatch(stakingHubActions.setOnboardingStep(2));
    } catch (error) {
      if (error instanceof Error) {
        set_error(error.message);
      } else {
        set_error(JSON.stringify(error, null, 2));
      }
      //  set_step(0);
    } finally {
      set_loading(false);
    }
  };

  return (
    <StepContainer
      title="Create Safe"
      description="Set the owner wallets of your Safe and how many need to confirm to execute a valid transaction."
    >
      <Container>
        <Text>Owner address</Text>
        <FlexContainer>
          <Text>{account}</Text>
          <IconButton
            size="small"
            onClick={() => navigator.clipboard.writeText(account ? account : '')}
          >
            <CopyIcon />
          </IconButton>
          <IconButton
            size="small"
            href={`https://gnosisscan.io/address/${account}`}
            target="_blank"
          >
            <LaunchIcon />
          </IconButton>
        </FlexContainer>
      </Container>
      {owners.length > 1 &&
        owners.slice(1).map((owner) => {
          return (
            <FlexContainer key={owner.id}>
              <TextField
                label="Address"
                placeholder="New owner address here..."
                fullWidth
                onChange={(e) => updateOwnerAddress(owner.id, e.target.value)}
              />
              <IconButton onClick={() => removeOwner(owner.id)}>
                <DeleteIcon />
              </IconButton>
            </FlexContainer>
          );
        })}

      <ButtonContainer>
        <StyledGrayButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(1));
          }}
        >
          Back
        </StyledGrayButton>
        <Button
          onClick={handleContinueClick}
          disabled={loading}
        >
          DEPLOY
        </Button>
      </ButtonContainer>
      {loading && <CircularProgress />}
      {error && (
        <StyledError>
          <strong>There was an error:</strong> {JSON.stringify(error)}
        </StyledError>
      )}
    </StepContainer>
  );
};

export default CreateSafe;
