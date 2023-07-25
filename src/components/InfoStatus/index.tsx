import styled from '@emotion/styled';
import { useAppSelector } from '../../store';
import { useBalance } from 'wagmi';
import { useEffect, useState } from 'react';
import { FetchBalanceResult } from '@wagmi/core';

const Container = styled.div`
  background-color: #cadeff;
  border-radius: 1rem;
  display: flex;
  gap: 1rem;
  min-height: 80px;
  min-width: 255px;
  padding: 1rem;
  position: absolute;
  top: 45px;
  right: 231px;
  font-size: 8px;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconContainer = styled.div`
  height: 1rem;
  width: 1rem;
`;

const Icons = styled(FlexColumn)`
  margin-top: 1.75rem;
`;

const IconAndText = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

const Icon = styled.img`
  display: block;
  height: 100%;
  width: 100%;
`;

const Text = styled.p`
  font-weight: 600;
`;

const Title = styled.p`
  text-transform: uppercase;
  font-weight: 600;
`;

const Balance = styled(FlexColumn)`
  background-color: #ddeaff;
  text-align: right;
  padding: 0rem 2rem;
  border-radius: 1rem 1rem 1rem 1rem;
`;

const SafeContainer = styled.div<{ show: boolean }>`
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  width: 83.2px;
`;

const Safe = styled(Balance)``;

const Wallet = styled(Balance)``;

export default function InfoStatus() {
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress);
  const account = useAppSelector((selector) => selector.web3.account) as `0x${string}`;
  const wxhoprSmartContractAddress = '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1';
  const xhoprSmartContractAddress = '0xD057604A14982FE8D88c5fC25Aac3267eA142a08';

  const { data: xDAI_balance } = useBalance({
    address: account,
    watch: true,
  });
  const { data: wxHOPR_balance } = useBalance({
    address: account,
    token: wxhoprSmartContractAddress,
    watch: true,
  });
  const { data: xHOPR_balance } = useBalance({
    address: account,
    token: xhoprSmartContractAddress,
    watch: true,
  });

  const safeXdaiBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    watch: true,
  }).data?.formatted;
  const safeWxHoprBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: wxhoprSmartContractAddress,
    watch: true,
  }).data?.formatted;
  const safexHoprBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: xhoprSmartContractAddress,
    watch: true,
  }).data?.formatted;

  console.log(safeXdaiBalance);
  console.log(safeWxHoprBalance);
  console.log(safexHoprBalance);

  const truncateBalance3Decimals = (value: string | undefined) => {
    if (typeof value !== 'undefined' && value.includes('.')) {
      const [before, after] = value.split('.');
      return `${before}.${after.substring(0, 2)}`;
    }
    return value;
  };

  return (
    <Container>
      <Icons>
        <IconAndText>
          <IconContainer>
            <Icon
              src="/assets/wxHoprIcon.svg"
              alt="wxHOPR Icon"
            />
          </IconContainer>
          <Text>wxHOPR</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer>
            <Icon
              src="/assets/xHoprIcon.svg"
              alt="xHOPR Icon"
            />
          </IconContainer>
          <Text>xHOPR</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer>
            <Icon
              src="/assets/xDaiIcon.svg"
              alt="xDai Icon"
            />
          </IconContainer>
          <Text>xDAI</Text>
        </IconAndText>
      </Icons>
      <SafeContainer show={!!selectedSafeAddress}>
        {selectedSafeAddress && (
          <>
            <Title>Safe</Title>
            <Safe>
              <p>{truncateBalance3Decimals(safeWxHoprBalance) ?? 0}</p>
              <p>{truncateBalance3Decimals(safexHoprBalance) ?? 0}</p>
              <p>{truncateBalance3Decimals(safeXdaiBalance) ?? 0}</p>
            </Safe>
          </>
        )}
      </SafeContainer>
      <div>
        <Title>Wallet</Title>
        <Wallet>
          <p>{truncateBalance3Decimals(wxHOPR_balance?.formatted) ?? 0}</p>
          <p>{truncateBalance3Decimals(xHOPR_balance?.formatted) ?? 0}</p>
          <p>{truncateBalance3Decimals(xDAI_balance?.formatted) ?? 0}</p>
        </Wallet>
      </div>
    </Container>
  );
}
