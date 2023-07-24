import { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

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
} from './styled';
import Button from '../../future-hopr-lib-components/Button';
import Card from '../components/Card';
import { IconButton, MenuItem, Select, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// Icons
import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { safeActionsAsync } from '../../store/slices/safe';
import { useAppDispatch } from '../../store';

type OwnersAndConfirmationsProps = {
  account: `0x${string}`;
  signer: ethers.providers.JsonRpcSigner | undefined;
  set_step: (step: number) => void;
};

const OwnersAndConfirmations = ({
  account, signer, set_step, 
}: OwnersAndConfirmationsProps) => {
  const dispatch = useAppDispatch();
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState<any>('');
  const [owners, set_owners] = useState<{ id: string; address: string }[]>([]);
  const [threshold, set_threshold] = useState(1);

  useEffect(() => {
    if (account) {
      addOwner(account);
    }
    return () => set_owners([]);
  }, [account]);

  const addOwner = (address: string) => {
    set_owners((prevOwners) => {
      return [
        ...prevOwners,
        {
          id: nanoid(),
          address,
        },
      ];
    });
  };

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
    if (!signer) return;

    const config = {
      owners: owners.map((owner) => owner.address),
      threshold,
    };

    try {
      set_error('');
      set_loading(true);
      await dispatch(
        safeActionsAsync.createSafeWithConfigThunk({
          config,
          signer,
        }),
      ).unwrap();
      set_step(1);
    } catch (error) {
      if (error instanceof Error) {
        set_error(error.message);
      } else {
        set_error(JSON.stringify(error, null, 2));
      }
      set_step(0);
    } finally {
      set_loading(false);
    }
  };

  return (
    <Card
      title="Owners and confirmations"
      description="Set the owner wallets of your Safe and how many need to confirm to execute a valid transaction."
      descriptionLeft
    >
      <>
        <Subtitle>Setting owners</Subtitle>
        <Container>
          <Text>Owner address</Text>
          <FlexContainer>
            <Text>{account}</Text>
            <IconButton
              size="small"
              onClick={() => navigator.clipboard.writeText(account)}
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
        <AddButton
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => addOwner('')}
        >
          Add new owner
        </AddButton>
        <Subtitle>Threshold</Subtitle>
        <Container column>
          <Text>Any transaction requires the confirmation of:</Text>
          <FlexContainer>
            <Select
              value={threshold}
              onChange={(e) => set_threshold(Number(e.target.value))}
            >
              {owners.map((owner, index) => (
                <MenuItem
                  key={owner.id}
                  value={`${index + 1}`}
                >
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
            <Text>Out of {owners.length} owner(s).</Text>
          </FlexContainer>
        </Container>
        <ButtonContainer>
          <StyledGrayButton>Back</StyledGrayButton>
          <Button
            onClick={handleContinueClick}
            disabled={loading}
          >
            Continue
          </Button>
        </ButtonContainer>
        {loading && <CircularProgress />}
        {error && (
          <StyledError>
            <strong>There was an error:</strong> {error}
          </StyledError>
        )}
      </>
    </Card>
  );
};

export default OwnersAndConfirmations;
