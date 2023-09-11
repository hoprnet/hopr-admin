import { TextField } from '@mui/material';
import Section from '../../../../future-hopr-lib-components/Section';
import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import Card from '../../../../components/Card';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { useEthersSigner } from '../../../../hooks';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { sendNotification } from '../../../../hooks/useWatcher/notifications';

const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

const NodeAddress = () => {
  const dispatch = useAppDispatch();
  const safeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const account = useAppSelector((store) => store.web3.account);
  const navigate = useNavigate();
  const signer = useEthersSigner();
  const [address, set_address] = useState('');
  const [isLoading, set_isLoading] = useState(false);

  const addDelegate = async () => {
    if (signer && safeAddress && account) {
      set_isLoading(true);
      await dispatch(
        safeActionsAsync.addSafeDelegateThunk({
          signer,
          options: {
            safeAddress,
            delegateAddress: address,
            delegatorAddress: account,
            label: 'node',
          },
        }),
      ).unwrap()
        .catch(e => {
          if (e.error == "Safe= does not exist or it's still not indexed") {
            const errMsg = "Your safe wasn't indexed yet by HOPR Safe Infrastructure. Please try in 5min."
            sendNotification({
              notificationPayload: {
                source: 'safe',
                name: errMsg,
                url: null,
                timeout: null,
              },
              toastPayload: { message: errMsg, type: 'error' },
              dispatch,
            });
          }
        });
      set_isLoading(false);
    }
  };

  if (!safeAddress) {
    return (
      <Section
        center
        fullHeightMin
        lightBlue
      >
        <Card title="Connect to safe" />
      </Section>
    );
  }

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card title="Please enter your node address">
        <>
          <TextField
            type="text"
            label="Node Address"
            placeholder="Your address..."
            value={address}
            onChange={(e) => set_address(e.target.value)}
          />
          <ButtonContainer>
            <StyledGrayButton onClick={() => navigate(-1)}>Back</StyledGrayButton>
            <Button
              disabled={!address || !signer || !safeAddress}
              onClick={addDelegate}
            >
              Confirm
            </Button>
          </ButtonContainer>
          {isLoading && <p>Adding delegate...</p>}
        </>
      </Card>
    </Section>
  );
};

export default NodeAddress;
