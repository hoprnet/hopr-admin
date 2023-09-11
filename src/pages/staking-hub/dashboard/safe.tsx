import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled'
import { useEthersSigner } from '../../../hooks';
import { useAppDispatch, useAppSelector } from '../../../store';
import { safeActionsAsync } from '../../../store/slices/safe';

// HOPR Components
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
  const needsUpdate = useAppSelector((store) => store.stakingHub.config.needsUpdate.data);
  const [updating, set_updating] = useState(false)


  const updateConfig = async () => {
    

    if (signer) {
        set_updating(true);

        const newConfig = `0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000016b00`;

        dispatch(
            safeActionsAsync.createAndExecuteContractTransactionThunk({
                data: newConfig,
                signer,
                safeAddress: selectedSafeAddress,
                smartContractAddress: '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526', //multisend contract
            }),
        )
        .unwrap()
        .then((transactionResponse) => {
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
            currency={needsUpdate ? <span style={{color: 'red'}}>Update needed</span> : <span>Current version</span>}
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
