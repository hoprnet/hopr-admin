import { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { WalletClient } from 'viem';
import { useWalletClient } from 'wagmi';

// Components
import {
  AddButton,
  ButtonContainer,
  Container,
  StyledError,
  FlexContainer,
  StyledGrayButton,
  Subtitle,
  Text
} from './safeOnboarding/styled';
import { StepContainer } from './components';
import Button from '../future-hopr-lib-components/Button';
import { IconButton, MenuItem, Select, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// Icons
import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { safeActionsAsync } from '../store/slices/safe';
import { stakingHubActions } from '../store/slices/stakingHub';
import { useAppDispatch, useAppSelector } from '../store';

type OwnersAndConfirmationsProps = {
  account: `0x${string}`;
  walletClient: WalletClient | null | undefined;
  set_step: (step: number) => void;
};

const CreateSafe = () => {
  const dispatch = useAppDispatch();
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState<unknown>('');
  const [owners, set_owners] = useState<{ id: string; address: string }[]>([]);
  const [threshold, set_threshold] = useState(1);
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
    console.log(config);
    try {
      set_error('');
      set_loading(true);
      await dispatch(
        safeActionsAsync.createSafeWithConfigThunk({
          config,
          walletClient,
        }),
      ).unwrap();
      dispatch(stakingHubActions.setOnboardingStep(3));
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
