import styled from '@emotion/styled';
import { useState } from 'react';
import { useEthersSigner } from '../../../hooks';
import { useAppDispatch, useAppSelector } from '../../../store';
import { safeActionsAsync } from '../../../store/slices/safe';

// HOPR Components
import { OperationType } from '@safe-global/safe-core-sdk-types';
import Button from '../../../future-hopr-lib-components/Button';
import { GrayCard } from '../../../future-hopr-lib-components/Cards/GrayCard';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* justify-items: center; */
    /* align-items: center; */
    padding: 16px;
    flex-grow: 1;
    gap: 32px;
    p.center {
        width: calc( 100% - 32px);
        text-align: center;
    }
    div.center {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .line {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        width: 100%;
    }

    .half-line {
        display: flex;
        flex-wrap: wrap;
        width: calc(50% - 1rem);
    }

    #redeemed-tickets, #earned-rewards, #wxhopr-total-stake, #xdai-in-safe, #Update-Node-Configuration {
        flex: 1;
    }
`



function SafeDashboard() {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as `0x${string}`;
  const moduleAddress = useAppSelector((store) => store.stakingHub.onboarding.moduleAddress)
  const needsUpdate = useAppSelector((store) => store.stakingHub.config.needsUpdate.data);
  const [updating, set_updating] = useState(false)


  const updateConfig = async () => {

    if (signer && moduleAddress) {
      set_updating(true);
      const moduleAddressWithout0x = moduleAddress.slice(2).toLocaleLowerCase()
      console.log({ moduleAddress, moduleAddressWithout0x })
      const newConfig = `0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000016b00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000693bac5ce61c720ddc68533991ceb41199d8f8ae00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000d4fdec44db9d44b8f2b6d529620f9c0c7066a2c100${moduleAddressWithout0x}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024a2450f89693bac5ce61c720ddc68533991ceb41199d8f8ae010103030303030303030303000000000000000000000000000000000000000000`;

      dispatch(
        safeActionsAsync.createAndExecuteContractTransactionThunk({
          data: newConfig,
          signer,
          safeAddress: selectedSafeAddress,
          operation: OperationType.DelegateCall,
          smartContractAddress: '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526', //multisend contract
        }),
      )
        .unwrap()
        .then((transactionResponse) => {
          console.log(`transaction went through`)
          //     set_proposedTxHash(transactionResponse);
        })
        .finally(() => {
          set_updating(false);
        });
    }

  }


  
  return (
    <Container
      className='SafeDashboard'
    >
      <div className='half-line'>
        <GrayCard
          id="Update-Node-Configuration"
          title="Safe Configuration"
          currency={needsUpdate ? <span style={{ color: 'red' }}>Update needed</span> : <span>Current version</span>}
          buttons={[
            {
              text: 'UPDATE',
              onClick: updateConfig,
              pending: updating,
              disabled: !needsUpdate,
            },
          ]}
        />
      </div>

      <p className='center'>In order to adjust the settings of your safe or transfer assets that are not supported by the HOPR Staking Hub use any of the below mentioned third party general purpose Safe user interfaces:</p>
      <div className='center'>
        <Button

          href={`https://app.safe.global/home?safe=gno:${selectedSafeAddress}`}
        >
                safe.global
        </Button>
        <Button

          href={`https://app.onchainden.com/safes/gnosis:${selectedSafeAddress}`}
        >
                OnChainDen.com
        </Button>
      </div>
    
    </Container>
  );
}

export default SafeDashboard;
