import styled from '@emotion/styled';
import Card from '../components/Card';
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';
import Section from '../future-hopr-lib-components/Section';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import CodeCopyBox from '../components/CodeCopyBox';

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
  justify-content: space-evenly;
  padding: 24px;
`;

const Children = styled.div``;

const InstructionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 200px;
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
  code {
    font-size: 8px;
    line-height: 12px;
  }
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

export default function SetupNodePage() {
  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card
        title="Set up your node"
        description="Follow the instructions below to set up your HOPR node."
      >
        <Content>
          <StepsContainer>
            <Instruction num={1}>
              <div>
                <p>Set up your HOPR using this instructions: </p>
                <p>
                  <StyledLink to={`https://docs.hoprnet.org/node/start-here`}>here.</StyledLink>
                </p>
                <Content>
                  <CodeContainer>
                    <span>install hoprd</span>
                    <CodeCopyBox
                      code={`BLINDTEXT  docker run -e RESPONSE_TIMEOUT=10000 -e DISCOVERY_PLATFORM_API_ENDPOINT=https://discovery.rpch.tech -e PORT=8080 -e DATA_DIR=app -e CLIENT=eager-rice-current-same-surrounded`}
                    />
                  </CodeContainer>
                  <CodeContainer>
                    <span>run hoprd</span>
                    <CodeCopyBox
                      code={`BLINDTEXT docker run -e RESPONSE_TIMEOUT=10000 -e DISCOVERY_PLATFORM_API_ENDPOINT=https://discovery.rpch.tech -e PORT=8080 -e DATA_DIR=app -e CLIENT=eager-rice-current-same-surrounded`}
                    />
                  </CodeContainer>
                </Content>
              </div>
            </Instruction>
            <RightArrow>
              <ArrowRightAltIcon style={{ fontSize: '60px' }} />
            </RightArrow>
            <Instruction
              num={2}
              description="Return here to continue, once you have set up your node."
            />
          </StepsContainer>
          <ButtonContainer>
            <StyledGrayButton>BACK</StyledGrayButton>
            <Button>CONTINUE</Button>
          </ButtonContainer>
        </Content>
      </Card>
    </Section>
  );
}
