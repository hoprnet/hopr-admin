import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled'
import { useAppSelector } from '../../../store';

// HOPR Components
import Button from '../../../future-hopr-lib-components/Button';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    align-items: center;
    padding: 16px;
    flex-grow: 1;
    gap: 32px;
    p {
        width: calc( 100% - 32px);
        text-align: center;
    }
    div {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
        justify-content: center;
    }

`


function SafeDashboard() {
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as `0x${string}`;
  return (
    <Container
        className='SafeDashboard'
    >
        <p>In order to adjust the settings of your safe or transfer assets that are not supported by the HOPR Staking Hub use any of the below mentioned third party general purpose Safe user interfaces:</p>
        <div>
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
