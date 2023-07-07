import { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';

//Stores
import { useAppDispatch, useAppSelector } from '../store';
import { safeActionsAsync, safeActions } from '../store/slices/safe';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import { useSigner } from '../hooks';
import { utils } from 'ethers';
import Card from '../steps/components/Card';
import styled from '@emotion/styled';
import {
  IconButton,
  TextField,
  Button as MuiButton,
  Select,
  MenuItem
} from '@mui/material'

// Icons
import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '../future-hopr-lib-components/Button';

const Lowercase = styled.span`
  text-transform: lowercase;
`;

const Container = styled.div<{ column?: boolean }>`
  align-items: ${(props) => (props.column ? 'flex-start' : 'center')};
  display: flex;
  flex-direction: ${(props) => props.column && 'column'};
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #414141;
  gap: 1rem;
  min-height: 39px;
`;

const FlexContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

const AddButton = styled(MuiButton)`
  align-self: flex-start;
  color: #0000b4;
  font-weight: 700;
`;

const ThresholdInput = styled(TextField)`
  max-width: 3rem;

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
`;

const StyledForm = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  border-bottom: 1px solid #414141;
`;

const StyledInstructions = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

const Subtitle = styled.h3`
  color: #414141;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-transform: uppercase;
  margin: 0;
`;

const Text = styled.p`
  margin: 0;
`;

const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
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
  align-items: baseline;
  gap: 10px;
`;

const StyledCoinLabel = styled.p`
  color: var(--414141, #414141);
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

function SafeSection() {
  const dispatch = useAppDispatch();
  const safe = useAppSelector((store) => store.safe);
  const { account } = useAppSelector((store) => store.web3);
  const { signer } = useSigner();
  const [threshold, set_threshold] = useState(1);
  const [owners, set_owners] = useState<{ id: string; address: string }[]>([]);

  useEffect(() => {
    console.log('@  owners:', owners);
  }, [owners]);

  const [xdaiValue, set_xdaiValue] = useState('');
  const [wxhoprValue, set_wxhoprValue] = useState('');

  useEffect(() => {
    fetchInitialStateForSigner();
  }, [signer]);

  useEffect(() => {
    if (account) {
      addOwner(account);
    }
    return () => set_owners([]);
  }, [account]);

  const fetchInitialStateForSigner = async () => {
    if (signer) {
      dispatch(safeActions.resetState());
      dispatch(safeActionsAsync.getSafesByOwnerThunk({ signer }));
    }
  };

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
      return prevOwners.map((prevOwner) =>
        prevOwner.id === id
          ? {
            ...prevOwner,
            address,
          }
          : prevOwner,
      );
    });
  };

  const removeOwner = (id: string) => {
    set_owners((prevOwners) => {
      return prevOwners.filter((prevOwner) => prevOwner.id !== id);
    });
  };

  if (!account) {
    return (
      <Section
        className="Section--safe"
        id="Section--safe"
        yellow
      >
        <h2>connect signer</h2>
      </Section>
    );
  }

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card title="Owners and confirmations">
        <>
          <Text>Set the owner wallets of your Safe and how many need to confirm to execute a valid transaction.</Text>
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
              <Select value={threshold}>
                {owners.map((_, index) => (
                  <MenuItem
                    key={index + 1}
                    value={index + 1}
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
              onClick={() => {
                if (signer) {
                  dispatch(
                    safeActionsAsync.createSafeWithConfigThunk({
                      config: {
                        owners: owners.map((owner) => owner.address),
                        threshold,
                      },
                      signer,
                    }),
                  );
                }
              }}
            >
              Continue
            </Button>
          </ButtonContainer>
          {/* <StyledForm>
            <StyledInstructions>
              <StyledText>
                Move <Lowercase>x</Lowercase>DAI to safe
              </StyledText>
              <StyledDescription>
                Add-in the amount of <Lowercase>x</Lowercase>DAI you like to deposit to your safe. In a later step these
                will then be moved to your node.
              </StyledDescription>
            </StyledInstructions>
            <StyledInputGroup>
              <TextField
                variant="outlined"
                placeholder="-"
                size="small"
                value={xdaiValue}
                onChange={(e) => set_xdaiValue(e.target.value)}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
              />
              <StyledCoinLabel>
                <Lowercase>x</Lowercase>DAI
              </StyledCoinLabel>
            </StyledInputGroup>
          </StyledForm>
          <StyledForm>
            <StyledInstructions>
              <StyledText>
                Stake <Lowercase>wx</Lowercase>HOPR into safe
              </StyledText>
              <StyledDescription>
                Add-in the amount of <Lowercase>wx</Lowercase>HOPR you like to deposit to your safe. We suggest to move
                all your <Lowercase>wx</Lowercase>HOPR to the safe.
              </StyledDescription>
            </StyledInstructions>
            <StyledInputGroup>
              <TextField
                variant="outlined"
                placeholder="-"
                size="small"
                value={wxhoprValue}
                onChange={(e) => set_wxhoprValue(e.target.value)}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
              />
              <StyledCoinLabel>
                <Lowercase>wx</Lowercase>HOPR
              </StyledCoinLabel>
            </StyledInputGroup>
          </StyledForm> */}
        </>
      </Card>
    </Section>
    // <Section
    //   className="Section--safe"
    //   id="Section--safe"
    //   yellow
    // >
    //   <h1>Safe</h1>
    //   <h2>existing safes</h2>
    //   {safe.safesByOwner.map((safeAddress) => (
    //     <button
    //       key={safeAddress}
    //       onClick={() => {
    //         if (signer) {
    //           dispatch(
    //             safeActionsAsync.getSafeInfoThunk({
    //               signer,
    //               safeAddress,
    //             }),
    //           );
    //           dispatch(
    //             safeActionsAsync.getAllSafeTransactionsThunk({
    //               signer,
    //               safeAddress,
    //             }),
    //           );
    //         }
    //       }}
    //     >
    //       click to get info from {safeAddress}
    //     </button>
    //   ))}
    //   <h2>create new safe</h2>
    //   <label htmlFor="threshold">threshold</label>
    //   <input
    //     id="threshold"
    //     value={threshold}
    //     type="number"
    //     onChange={(event) => {
    //       set_threshold(Number(event.target.value));
    //     }}
    //   />
    //   <label htmlFor="owners">owners</label>
    //   <input
    //     id="owners"
    //     style={{ width: '100%' }}
    //     placeholder="account addresses separated with ,"
    //     value={owners}
    //     onChange={(event) => {
    //       set_owners(event.target.value);
    //     }}
    //   />
    //   <button
    //     onClick={() => {
    //       if (signer) {
    //         dispatch(
    //           safeActionsAsync.createSafeWithConfigThunk({
    //             config: {
    //               owners: owners.split(','),
    //               threshold,
    //             },
    //             signer,
    //           }),
    //         );
    //       }
    //     }}
    //   >
    //     create safe with config
    //   </button>
    //   <button
    //     onClick={() => {
    //       if (signer) {
    //         dispatch(safeActionsAsync.createSafeThunk({ signer }));
    //       }
    //     }}
    //   >
    //     create new default safe
    //   </button>
    //   <h2>create tx proposal to yourself on selected safe</h2>
    //   <button
    //     disabled={!safe.selectedSafeAddress}
    //     onClick={async () => {
    //       if (safe.selectedSafeAddress && signer) {
    //         const signerAddress = await signer.getAddress();
    //         dispatch(
    //           safeActionsAsync.createSafeTransactionThunk({
    //             safeAddress: safe.selectedSafeAddress,
    //             signer,
    //             safeTransactionData: {
    //               value: utils.parseEther('0.001').toString(),
    //               to: signerAddress,
    //               data: '0x',
    //             },
    //           }),
    //         );
    //       }
    //     }}
    //   >
    //     create tx proposal
    //   </button>
    //   <h2>transactions actions</h2>
    //   {safe.safeTransactions?.results.map((transaction, key) => (
    //     <div key={key}>
    //       <p>
    //         {transaction.txType} {transaction.to}
    //       </p>
    //       {transaction.txType === 'MULTISIG_TRANSACTION' ? (
    //         transaction.confirmationsRequired === transaction.confirmations?.length ? (
    //           <button
    //             onClick={() => {
    //               if (signer) {
    //                 dispatch(
    //                   safeActionsAsync.executeTransactionThunk({
    //                     signer,
    //                     safeAddress: transaction.safe,
    //                     safeTransaction: transaction,
    //                   }),
    //                 );
    //               }
    //             }}
    //           >
    //             execute
    //           </button>
    //         ) : (
    //           <button
    //             onClick={() => {
    //               if (signer) {
    //                 dispatch(
    //                   safeActionsAsync.confirmTransactionThunk({
    //                     signer,
    //                     safeAddress: transaction.safe,
    //                     safeTransactionHash: transaction.safeTxHash,
    //                   }),
    //                 );
    //               }
    //             }}
    //           >
    //             confirm
    //           </button>
    //         )
    //       ) : null}
    //     </div>
    //   ))}
    //   <h2>store</h2>
    //   <pre>{JSON.stringify(safe, null, 4)}</pre>
    // </Section>
  );
}

export default SafeSection;
