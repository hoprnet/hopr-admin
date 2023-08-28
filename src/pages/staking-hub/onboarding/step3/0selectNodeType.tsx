import styled from '@emotion/styled';
import Section from '../../../../future-hopr-lib-components/Section';
import Button from '../../../../future-hopr-lib-components/Button';
import Card from '../../../../components/Card';
import { StepContainer } from '../components';

//Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

const NodeContainer = styled.div`
  display: flex;
  gap: 2.5rem;
  justify-content: center;
`;

const Node = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
  max-width: 320px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
`;
const Image = styled.img`
  height: 100%;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
`;

const Price = styled(Title)``;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  height: 160px;
  gap: 0.5rem;
`;

const Stack = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  align-self: center;
  text-transform: uppercase;
`;

export default function SelectNodeType() {
  const dispatch = useAppDispatch();
  return (
    <StepContainer title="SELECT NODE TYPE">
      <NodeContainer>
        <Node>
          <ImageContainer>
            <Image src="/assets/docker.svg" />
          </ImageContainer>
          <Title>Docker Version</Title>
          <Price>Free</Price>
          <TextContainer>
            If you want to run a node on your own hardware without the HOPR Node PC, that’s perfectly acceptable and
            possible as well!
          </TextContainer>
        </Node>
        <Node>
          <ImageContainer>
            <Image
              src="/images/dappnode.png"
              width={310}
            />
          </ImageContainer>
          <Title>Dappnode</Title>
          <Price>$ 1,630.70</Price>
          <TextContainer>
            <span>
              <b>CPU:</b> Intel NUC i7 Series 10
            </span>
            <span>
              <b>Memory:</b> 32gb
            </span>
            <span>
              <b>Storage:</b> 2TB NVMe
            </span>
            <br />
            <span>
              <b>Bonus tokens:</b> 1000 HOPR tokens
            </span>
          </TextContainer>
          <Stack>
            <StyledButton
              href="https://dappnode.com/collections/frontpage/products/hopr-special-edition"
              target="_blank"
            >
              Order
            </StyledButton>
          </Stack>
        </Node>
      </NodeContainer>
      <Button
        onClick={() => {
          dispatch(stakingHubActions.setOnboardingStep(7));
        }}
      >
        CONTINUE
      </Button>
    </StepContainer>
  );
}
