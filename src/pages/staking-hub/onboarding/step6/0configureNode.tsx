import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { Address } from 'viem';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { StepContainer } from '../components';
import { useEthersSigner } from '../../../../hooks';

// Web3
import { createIncludeNodeTransactionData, encodeDefaultPermissions } from '../../../../utils/blockchain';

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

export default function ConfigureNode() {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const nodeAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const safeModules = useAppSelector((state) => state.safe.info.data?.modules);
  const signer = useEthersSigner();
  const [isLoading, set_isLoading] = useState(false);
  const [includeNodeResponse, set_includeNodeResponse] = useState('');

  const includeNode = async () => {
    if (signer && selectedSafeAddress && safeModules && safeModules.at(0) && nodeAddress) {
      set_isLoading(true);
      dispatch(
        safeActionsAsync.createAndExecuteContractTransactionThunk({
          smartContractAddress: safeModules.at(0) as Address,
          data: createIncludeNodeTransactionData(encodeDefaultPermissions(nodeAddress)),
          safeAddress: selectedSafeAddress,
          signer,
        }),
      )
        .unwrap()
        .then((transactionResult) => {
          set_isLoading(false);
          set_includeNodeResponse(transactionResult);
          dispatch(stakingHubActions.setOnboardingStep(14));
        })
        .catch((e) => {
          set_isLoading(false);
        });
    }
  };

  return (
    <StepContainer
      title="Configure Node"
      description={'You need to sign a transaction to connect your node to your existing HOPR safe.'}
      image={{
        src: '/assets/node-blue.svg',
        height: 200,
      }}
    >
      <ButtonContainer>
        <Button
          onClick={includeNode}
          pending={isLoading}
        >
          SIGN
        </Button>
      </ButtonContainer>
    </StepContainer>
  );
}
