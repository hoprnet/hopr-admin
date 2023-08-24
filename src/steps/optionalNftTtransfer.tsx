import { useState } from 'react';
import styled from '@emotion/styled';

//HOPR Components
import Button from '../future-hopr-lib-components/Button';
import { StepContainer } from './components';

//Store
import { useAppSelector, useAppDispatch } from '../store';
import { stakingHubActions } from '../store/slices/stakingHub';

// Mui
import Radio from '@mui/material/Radio';
import MuiButton from '@mui/material/Button';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ConfirmButton = styled(Button)`
  width: 200px;
  align-self: center;
`;

const OptionContaiener = styled.div`
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
  const communityNftId = useAppSelector((store) => store.web3.communityNftId);

  function whichNFTimage() {
    if (communityNftId === null) return '/assets/nft-NOT-detected-in-wallet.png';
    if (communityNftId !== null) return '/assets/nft-detected-in-wallet.png';
  }

  return (
    <StepContainer
      title="OPTIONAL NFT TRANSFER"
      description={
        'Transfer your NR (Network Registry) NFT to join the network with only 10,000 wxHOPR. If you do not have one Please select the 30,000 option and continue.'
      }
    >
      <OptionContaiener>
        <Option
          className={`${option === 0 ? 'chosen' : ''}`}
          onClick={() => {
            set_option(0);
          }}
          disabled={communityNftId === null}
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
              }}
              disabled={communityNftId === null}
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
      </OptionContaiener>

      <Content>
        <ConfirmButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(5));
          }}
          disabled={option === null}
        >
          CONTINUE
        </ConfirmButton>
      </Content>
    </StepContainer>
  );
}