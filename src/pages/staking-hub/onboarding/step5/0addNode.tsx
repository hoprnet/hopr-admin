import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { StepContainer } from '../components';
import { useEthersSigner } from '../../../../hooks';
import { getAddress } from 'viem';

// Mui
import { TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

// Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { safeActionsAsync } from '../../../../store/slices/safe';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

export default function AddNode() {
  const dispatch = useAppDispatch();
  const safeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const nodesAddedToSafe = useAppSelector(
    (store) => store.stakingHub.safeInfo.data.registeredNodesInNetworkRegistryParsed,
  );
  const account = useAppSelector((store) => store.web3.account);
  const signer = useEthersSigner();
  const [isLoading, set_isLoading] = useState(false);
  const [address, set_address] = useState('');
  const nodeInNetworkRegistry = nodesAddedToSafe.includes(address.toLocaleLowerCase());

  const addDelegate = async () => {
    if (signer && safeAddress && account) {
      set_isLoading(true);
      await dispatch(
        safeActionsAsync.addSafeDelegateThunk({
          signer,
          options: {
            safeAddress,
            delegateAddress: getAddress(address),
            delegatorAddress: account,
            label: 'node',
          },
        }),
      ).unwrap();
      dispatch(stakingHubActions.setOnboardingNodeAddress(address));
      set_isLoading(false);
      dispatch(stakingHubActions.setOnboardingStep(13));
    }
  };

  return (
    <StepContainer
      title="Add Node"
      description={
        'Please enter and confirm your node address. This will initiate a transaction which you will need to sign.'
      }
      image={{
        src: '/assets/node-blue.svg',
        height: 200,
      }}
    >
      <>
        <TextField
          type="text"
          label="Node Address"
          placeholder="Your address..."
          value={address}
          onChange={(e) => set_address(e.target.value)}
        />
        <ButtonContainer>
          <StyledGrayButton
            onClick={() => {
              dispatch(stakingHubActions.setOnboardingStep(11));
            }}
          >
            Back
          </StyledGrayButton>
          <Tooltip title={!nodeInNetworkRegistry && 'This node is not on the whitelist'}>
            <span>
              <Button
                onClick={addDelegate}
                disabled={!nodeInNetworkRegistry}
                pending={isLoading}
              >
                Continue
              </Button>
            </span>
          </Tooltip>
        </ButtonContainer>
      </>
    </StepContainer>
  );
}
