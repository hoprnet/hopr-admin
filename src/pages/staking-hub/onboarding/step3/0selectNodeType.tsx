import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { StepContainer, ConfirmButton } from '../components';

//Store
import { useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

// Mui
import MuiButton from '@mui/material/Button';
import { Radio } from '@mui/material';
import { useState } from 'react';

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 115px;
  margin: 0 auto 40px;
  padding-top: 40px;
`;

const Image = styled.img`
  /* height: 100%; */
  width: 200px;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
`;

const Price = styled(Title)`
  &:empty {
    height: 17.5px;
  }
`;

const StyledButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;
  text-decoration: none !important;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin: 16px;
  align-items: center;
  justify-content: center;
`;

const Option = styled(MuiButton)`
  display: flex;
  flex-direction: column;
  justify-content: content;
  gap: 8px;
  max-width: 350px;
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
  max-width: 250px;
  min-height: 180px;
  align-items: center;
  .big {
    font-size: 20px;
    font-weight: 600;
  }

  a {
    color: #007bff; /* Set the desired color for links */
    text-decoration: underline;
  }
`;

const SRadio = styled(Radio)`
  &.Mui-checked {
    color: #000050;
  }
`;

export default function SelectNodeType() {
  const dispatch = useAppDispatch();
  const [option, set_option] = useState<0 | 1 | null>(null);

  return (
    <StepContainer 
      title="SELECT NODE TYPE"
      buttons={
        <ConfirmButton
          onClick={() => {
            const step = option === 0 ? 7 : 8;
            dispatch(stakingHubActions.setOnboardingStep(step));
          }}
          disabled={option === null}
        >
          CONTINUE
        </ConfirmButton>
      }
    >
      <OptionContainer>
        <Option
          className={`${option === 0 ? 'chosen' : ''}`}
          onClick={() => {
            set_option(0);
          }}
        >
          <OptionText>
            <div className="right">
              <Title>Docker Version</Title>
              <Price>Free</Price>
              <ImageContainer>
                <Image src="/assets/docker.svg" />
              </ImageContainer>
              If you want to run a node on your own hardware without the HOPR Node PC, that's perfectly acceptable and
              possible as well!
            </div>
          </OptionText>
          <div>
            <SRadio checked={option === 0} />
          </div>
        </Option>
        <Option
          className={`${option === 1 ? 'chosen' : ''}`}
          onClick={() => {
            set_option(1);
          }}
        >
          <OptionText>
            <div className="rigth">
              <Title>Dappnode</Title>
              <Price></Price>
              <ImageContainer>
                <Image src="/images/dappnode.png" />
                <StyledButton
                  href="https://dappnode.com/collections/frontpage/products/hopr-special-edition"
                  target="_blank"
                >
                  Order
                </StyledButton>
              </ImageContainer>
              <span>
                If you already own a DAppNode, choose this option. If you own an Avado device, please follow{' '}
                <a
                  href="https://docs.hoprnet.org/node/using-avado#how-to-migrate-your-avado-node-to-a-dappnode"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  these
                </a>{' '}
                instructions to migrate to DAppNode OS.
              </span>
            </div>
          </OptionText>

          <div>
            <SRadio checked={option === 1} />
          </div>
        </Option>
      </OptionContainer>
    </StepContainer>
  );
}
