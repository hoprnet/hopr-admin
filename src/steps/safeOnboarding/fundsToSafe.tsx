import { useEffect, useState } from 'react';
import { formatEther, parseEther, parseUnits } from 'viem';
import {
  erc20ABI,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWalletClient
} from 'wagmi';

import {
  ButtonContainer,
  Lowercase,
  MaxButton,
  StyledCoinLabel,
  StyledDescription,
  StyledForm,
  StyledGrayButton,
  StyledInputGroup,
  StyledInstructions,
  StyledTextField,
  Text
} from './styled';
import Button from '../../future-hopr-lib-components/Button';
import Card from '../components/Card';
import {
  CallContractTransactionInput,
  TransactionType,
  TransferFundsTransactionInput,
  encodeMulti,
  encodeSingle,
  isValid
} from 'ethers-multisend';
import multiSendAbi from '../../abi/multiSendAbi.json';

const wxhoprSmartContractAddress = '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1';
const multiSendSmartContractAddress = '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526';

type Address = `0x${string}`;
type NumberLiteral = `${number}`;

type FundsToSafeProps = {
  account: Address;
  set_step: (step: number) => void;
};

const FundsToSafe = ({
  account,
  set_step,
}: FundsToSafeProps) => {
  const selectedSafeAddress = '0x379aC695fEDB8D351dA25f7C51bE402557Cad3C4';
  const { data: walletClient } = useWalletClient();
  const [xdaiValue, set_xdaiValue] = useState('');
  const [wxhoprValue, set_wxhoprValue] = useState('');

  const { data: xDAI_balance } = useBalance({ address: account });
  const { data: wxHOPR_balance } = useBalance({
    address: account,
    token: wxhoprSmartContractAddress,
    watch: true,
  });

  useEffect(() => {
    if (account) {
      updateBalances();
    } else {
      set_xdaiValue('');
      set_wxhoprValue('');
    }
  }, [account, xDAI_balance, wxHOPR_balance]);

  const updateBalances = () => {
    if (account && xDAI_balance && wxHOPR_balance) {
      set_xdaiValue(formatEther(xDAI_balance?.value - parseUnits(`${0.002}`, 18)));
      set_wxhoprValue(wxHOPR_balance.formatted);
    }
  };

  const setMax_xDAI = () => {
    if (xDAI_balance) {
      set_xdaiValue(formatEther(xDAI_balance?.value - parseUnits(`${0.002}`, 18)));
    }
  };

  const setMax_wxHOPR = () => {
    if (wxHOPR_balance) {
      set_wxhoprValue(wxHOPR_balance.formatted);
    }
  };

  const encodeMultiSendTransactions = () => {
    const xDaiTransaction: TransferFundsTransactionInput = {
      id: 'xDai',
      amount: xdaiValue,
      to: selectedSafeAddress,
      type: TransactionType.transferFunds,
      decimals: 18,
      token: null,
    };

    const wxHoprTransaction: TransferFundsTransactionInput = {
      id: 'wxHopr',
      amount: parseEther(wxhoprValue).toString(),
      to: selectedSafeAddress,
      type: TransactionType.transferFunds,
      decimals: 18,
      token: wxhoprSmartContractAddress,
    };

    const encodedTransactions = encodeMulti(
      [encodeSingle(xDaiTransaction), encodeSingle(wxHoprTransaction)],
      multiSendSmartContractAddress,
    );
    console.log(xdaiValue);
    return encodedTransactions;
  };

  const handleDeployClick = async () => {
    console.log(xdaiValue, wxhoprValue);
    if (xdaiValue && wxhoprValue) {
      const encodedTransaction = encodeMultiSendTransactions();
      const tx = await walletClient?.sendTransaction({
        to: encodedTransaction.to as Address,
        data: encodedTransaction.data as unknown as Address,
        value: BigInt(encodedTransaction.value),
      });

      console.log(tx);
    }
  };

  return (
    <Card
      image={{
        src: '/assets/funds-to-safe.svg',
        alt: 'Funds to safe image',
        height: 134,
      }}
      title="Move funds to Safe"
      description="You're about to create a new Safe and move funds to it. There will be an deployment fee in xDAi charged to your wallet. Please confirm it."
      descriptionLeft
    >
      <>
        <StyledForm>
          <StyledInstructions>
            <Text>
              Move <Lowercase>x</Lowercase>DAI to safe
            </Text>
            <StyledDescription>
              Add-in the amount of <Lowercase>x</Lowercase>DAI you like to deposit to your safe. In a later step these
              will then be moved to your node.
            </StyledDescription>
          </StyledInstructions>
          <StyledInputGroup>
            <StyledTextField
              type="number"
              variant="outlined"
              placeholder="-"
              size="small"
              value={xdaiValue}
              onChange={(e) => set_xdaiValue(e.target.value)}
              InputProps={{ inputProps: {
                style: { textAlign: 'right' },
                min: 0,
                pattern: '[0-9]*',
              } }}
            />
            <StyledCoinLabel>
              <Lowercase>x</Lowercase>DAI
            </StyledCoinLabel>
            <MaxButton onClick={setMax_xDAI}>Max</MaxButton>
          </StyledInputGroup>
        </StyledForm>
        <StyledForm>
          <StyledInstructions>
            <Text>
              Stake <Lowercase>wx</Lowercase>HOPR into safe
            </Text>
            <StyledDescription>
              Add-in the amount of <Lowercase>wx</Lowercase>HOPR you like to deposit to your safe. We suggest to move
              all your <Lowercase>wx</Lowercase>HOPR to the safe.
            </StyledDescription>
          </StyledInstructions>
          <StyledInputGroup>
            <StyledTextField
              type="number"
              variant="outlined"
              placeholder="-"
              size="small"
              value={wxhoprValue}
              onChange={(e) => set_wxhoprValue(e.target.value)}
              InputProps={{ inputProps: {
                style: { textAlign: 'right' },
                min: 0,
                pattern: '[0-9]*',
              } }}
            />
            <StyledCoinLabel>
              <Lowercase>wx</Lowercase>HOPR
            </StyledCoinLabel>
            <MaxButton onClick={setMax_wxHOPR}>Max</MaxButton>
          </StyledInputGroup>
        </StyledForm>
        <ButtonContainer>
          <StyledGrayButton onClick={() => set_step(0)}>Back</StyledGrayButton>
          <Button onClick={handleDeployClick}>Deploy</Button>
        </ButtonContainer>
        {false && <span>Check your Wallet...</span>}
      </>
    </Card>
  );
};

export default FundsToSafe;
