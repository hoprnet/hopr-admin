import { useState } from 'react';
import styled from '@emotion/styled';
import { useWalletClient } from 'wagmi';

//HOPR Components
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer } from '../components';

//Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { web3ActionsAsync } from '../../../../store/slices/web3';

// Mui
import Radio from '@mui/material/Radio';
import MuiButton from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ConfirmButton = styled(Button)`
  width: 200px;
  align-self: center;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px;
  align-items: center;
`;

const Option = styled(MuiButton)`
  display: fle;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
  max-width: 530px;
  width: 100%;
  min-height: 180px;
  background-color: #edf2f7;
  color: #a8a8a8;
  text-align: left;
  border-radius: 30px;
  border: 2px solid #edf2f7;
  text-transform: none;
  &.chosen {
    color: #414141;
    border: 2px solid #000050;
  }
`;

const OptionText = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 300px;
  min-height: 180px;
  align-items: center;
  .big {
    font-size: 20px;
    font-weight: 600;
  }
`;

const SRadio = styled(Radio)`
  &.Mui-checked {
    color: #000050;
  }
`;

const TransferNft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  img {
    width: 116px;
    height: 116px;
  }
  button {
    width: 254px;
    text-transform: uppercase;
  }
`;

export default function optionalNftTtransfer() {
  const dispatch = useAppDispatch();
  const [option, set_option] = useState<0 | 1 | null>(null);
  const communityNftIdInWallet = useAppSelector((store) => store.web3.communityNftId);
  const communityNftIdInSafe = useAppSelector((store) => store.safe.communityNftId);
  const safeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const walletAddress = useAppSelector((store) => store.web3.account);
  const { data: walletClient } = useWalletClient();

  function whichNFTimage() {
    if (communityNftIdInWallet === null) return '/assets/nft-NOT-detected-in-wallet.png';
    if (communityNftIdInWallet !== null) return '/assets/nft-detected-in-wallet.png';
  }

  return (
    <StepContainer
      title="OPTIONAL NFT TRANSFER"
      description={
        'Transfer your NR (Network Registry) NFT to join the network with only 10,000 wxHOPR. If you do not have one Please select the 30,000 option and continue.'
      }
    >
      <>
        <OptionContainer>
          <Option
            className={`${option === 0 ? 'chosen' : ''}`}
            onClick={() => {
              set_option(0);
            }}
            disabled={communityNftIdInWallet === null}
          >
            <OptionText>
              <div className="left">
                <SRadio checked={option === 0} />
              </div>
              <div className="right">
                <span className="big">Minimum 10,000 wxHOPR</span>
                <br />
                <span className="smaller">WITH transferred NR NFT in your safe</span>
              </div>
            </OptionText>
            <TransferNft>
              <img src={whichNFTimage()} />
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  if (!walletClient) return;
                  if (walletAddress && safeAddress && communityNftIdInWallet !== null) {
                    dispatch(
                      web3ActionsAsync.sendNftToSafeThunk({
                        walletAddress,
                        safeAddress,
                        walletClient,
                        communityNftId: communityNftIdInWallet,
                      }),
                    );
                  }
                }}
                disabled={communityNftIdInWallet === null}
              >
              Transfer NFT to Safe
              </Button>
            </TransferNft>
          </Option>
          <Option
            className={`${option === 1 ? 'chosen' : ''}`}
            onClick={() => {
              set_option(1);
            }}
          >
            <OptionText>
              <div className="left">
                <SRadio checked={option === 1} />
              </div>
              <div className="right">
                <span className="big">Minimum 30,000 wxHOPR</span>
              </div>
            </OptionText>
          </Option>
        </OptionContainer>
        <Content>
          {option === 0 && !communityNftIdInSafe ? (
            <Tooltip title="You need to transder Community NFT to the Safe in order to use that option">
              <span style={{ textAlign: 'center' }}>
                <ConfirmButton
                  onClick={() => {
                    dispatch(stakingHubActions.setOnboardingStep(4));
                  }}
                  disabled={option === null || (option === 0 && !communityNftIdInSafe)}
                >
                CONTINUE
                </ConfirmButton>
              </span>
            </Tooltip>
          ) : (
            <ConfirmButton
              onClick={() => {
                dispatch(stakingHubActions.setOnboardingStep(4));
              }}
              disabled={option === null}
            >
            CONTINUE
            </ConfirmButton>
          )}
        </Content>
      </>
    </StepContainer>
  );
}
