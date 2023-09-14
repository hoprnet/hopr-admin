import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import CodeCopyBox from '../../../../components/CodeCopyBox';
import { StepContainer, ConfirmButton } from '../components';

//Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

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
  align-self: flex-start;
  margin-top: 22px;
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
  // text-transform: uppercase;
  code {
    font-size: 12px!important;
    line-height: 16px;
  }
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

export default function SetupNodeStep() {
  const dispatch = useAppDispatch();
  const safeAddress = useAppSelector((store) => store.stakingHub.onboarding.safeAddress);
  const moduleAddress = useAppSelector((store) => store.stakingHub.onboarding.moduleAddress);

  return (
    <StepContainer
      title="Set up your node"
      description={'Follow the instructions below to set up your HOPR node.'}
      buttons={
        <>
        <StyledGrayButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(6));
          }}
        >
          BACK
        </StyledGrayButton>
        <ConfirmButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(10));
          }}
        >
          CONTINUE
        </ConfirmButton>
      </>
      }
    >
      <Content>
        <StepsContainer>
          <Instruction num={1}>
            <div>
              <p>Copy the following command into your terminal and follow the instructions{' '}<StyledLink 
                to={`https://docs.hoprnet.org/node/using-docker` }
                target="_blank"
                rel="noopener noreferrer"
              >here</StyledLink>.</p>
              <Content>
                <CodeContainer>
                  <span>INSTALL AND RUN HOPRd</span>
                  <CodeCopyBox
                    code={<>{`docker run --pull always --restart on-failure -m 2g --platform linux/x86_64 --log-driver json-file --log-opt max-size=100M --log-opt max-file=5 -ti -v $HOME/.hoprd-db-dufour:/app/hoprd-db -p 9091:9091/tcp -p 9091:9091/udp -p 8080:8080 -p 3001:3001 -e DEBUG="hopr*" europe-west3-docker.pkg.dev/hoprassociation/docker-images/hoprd:latest --network dufour --init --api --identity /app/hoprd-db/.hopr-id-dufour --data /app/hoprd-db --password 'open-sesame-iTwnsPNg0hpagP+o6T0KOwiH9RQ0' --apiHost "0.0.0.0" --apiToken '`}
                    <span style={{color: '#00fc00'}}>YOUR_SECURITY_TOKEN</span>{`' --healthCheck --healthCheckHost "0.0.0.0" --announce --safeAddress ${safeAddress} --moduleAddress ${moduleAddress} --host `}<span style={{color: '#00fc00'}}>{`YOUR_PUBLIC_IP`}</span>{`:9091`}</>}
                    copy={`docker run --pull always --restart on-failure -m 2g --log-driver json-file --log-opt max-size=100M --log-opt max-file=5 -ti -v $HOME/.hoprd-db-dufour:/app/hoprd-db -p 9091:9091/tcp -p 9091:9091/udp -p 8080:8080 -p 3001:3001 -e DEBUG="hopr*" europe-west3-docker.pkg.dev/hoprassociation/docker-images/hoprd:latest --network dufour --init --api --identity /app/hoprd-db/.hopr-id-dufour --data /app/hoprd-db --password 'open-sesame-iTwnsPNg0hpagP+o6T0KOwiH9RQ0' --apiHost "0.0.0.0" --apiToken 'YOUR_SECURITY_TOKEN' --healthCheck --healthCheckHost "0.0.0.0" --announce --safeAddress ${safeAddress} --moduleAddress ${moduleAddress} --host YOUR_PUBLIC_IP:9091`}
                  />
                </CodeContainer>
                {/* <CodeContainer>
                  <span>run hoprd</span>
                  <CodeCopyBox
                    code={`BLINDTEXT docker run -e RESPONSE_TIMEOUT=10000 -e DISCOVERY_PLATFORM_API_ENDPOINT=https://discovery.rpch.tech -e PORT=8080 -e DATA_DIR=app -e CLIENT=eager-rice-current-same-surrounded`}
                  />
                </CodeContainer> */}
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
      </Content>
    </StepContainer>
  );
}
