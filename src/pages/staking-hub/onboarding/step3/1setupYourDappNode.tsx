import styled from '@emotion/styled';
import Card from '../../../../components/Card';
import Button from '../../../../future-hopr-lib-components/Button';
import Section from '../../../../future-hopr-lib-components/Section';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import CodeCopyBox from '../../../../components/CodeCopyBox';
import { StepContainer } from '../components';

//Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

const ConfirmButton = styled(Button)`
  width: 250px;
  align-self: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StepsContainer = styled.div`
  background-color: #edf2f7;
  border-radius: 20px;
  display: flex;
  gap: 1rem;
  min-height: 290px;
  justify-content: space-around;
  padding: 24px;
`;

const Children = styled.div``;

const InstructionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const NumberWithBackground = styled.div`
  width: 29px;
  height: 29px;
  background-color: #000050;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightArrow = styled.div`
  stroke: #000050;
  align-self: center;
`;

const StyledLink = styled(Link)`
  color: #0000b4;
  font-weight: 700;
  text-decoration: underline;
`;

const CodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

const Instruction = (props: { num: number; description?: string; children?: JSX.Element }) => {
  return (
    <InstructionContent>
      <NumberWithBackground>{props.num}</NumberWithBackground>
      {props.description && <p>{props.description}</p>}
      {props.children && <Children>{props.children}</Children>}
    </InstructionContent>
  );
};

export default function SetupYourDappNode() {
  const dispatch = useAppDispatch();
  return (
    <StepContainer
      title="Set up your DAPPNODE"
      description={'Follow the instructions below to set up your HOPR node.'}
    >
      <Content>
        <StepsContainer>
          <Instruction num={1}>
            <div>
              <p>Update your node using the instructions below: </p>
              <p>
                For Docker,{' '}
                <StyledLink to={`https://docs.hoprnet.org/node/using-docker#updating-to-a-new-release`}>
                  here.
                </StyledLink>
              </p>
              <p>
                For Dappnode,{' '}
                <StyledLink to={`https://docs.hoprnet.org/node/using-dappnode#updating-to-a-new-release`}>
                  here.
                </StyledLink>
              </p>
            </div>
          </Instruction>
          <RightArrow>
            <ArrowRightAltIcon style={{ fontSize: '60px' }} />
          </RightArrow>
          <Instruction
            num={2}
            description="Paste the following
            environment variables when prompted:"
          >
            <Content>
              <CodeContainer>
                <span>safe address</span>
                <CodeCopyBox code={`safe address`} />
              </CodeContainer>
              <CodeContainer>
                <span>module address</span>
                <CodeCopyBox code={`module address`} />
              </CodeContainer>
            </Content>
          </Instruction>
        </StepsContainer>
        <ButtonContainer>
          <StyledGrayButton
            onClick={() => {
              dispatch(stakingHubActions.setOnboardingStep(6));
            }}
          >
            BACK
          </StyledGrayButton>
          <Button
            onClick={() => {
              dispatch(stakingHubActions.setOnboardingStep(10));
            }}
          >
            CONTINUE
          </Button>
        </ButtonContainer>
      </Content>
    </StepContainer>
  );
}
