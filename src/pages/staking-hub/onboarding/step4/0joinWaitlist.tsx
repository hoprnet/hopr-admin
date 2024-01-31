import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { truncateEthereumAddress } from '../../../../utils/blockchain';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { StepContainer, ConfirmButton } from '../components';
import { useNavigate } from 'react-router-dom';

//Store
import { useAppSelector } from '../../../../store';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Note = styled.div`
  background-color: #daf8ff;
  border-radius: 20px;
  padding: 24px;
`;

const StepsContainer = styled.div`
  background-color: #edf2f7;
  border-radius: 20px;
  display: flex;
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

// const ConfirmButton = styled(Button)`
//   width: 250px;
//   align-self: center;
//   text-transform: uppercase;
// `;

const StyledTransactionHashWithIcon = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  gap: 0.5rem;
  font-size: 10px;
  & svg {
    align-self: flex-end;
    height: 16px;
    width: 16px;
  }
`;

const TruncatedEthereumAddressWithTooltip = ({ address }: { address: string }) => {
  return (
    <div>
      <Tooltip title={address}>
        <p>{truncateEthereumAddress(address)}</p>
      </Tooltip>
    </div>
  );
};

const Instruction = (props: { num: number; description?: string; children?: JSX.Element }) => {
  return (
    <InstructionContent>
      <NumberWithBackground>{props.num}</NumberWithBackground>
      {props.description && <p>{props.description}</p>}
      {props.children && <Children>{props.children}</Children>}
    </InstructionContent>
  );
};

export default function JoinWaitListStep() {
  const navigate = useNavigate();
  const safeAddress = useAppSelector((store) => store.stakingHub.onboarding.safeAddress);

  return (
    <StepContainer
      title="JOIN THE WAITLIST"
      description={
        <>
          If you have correctly funded your Safe, follow the steps below and we’ll onboard you to the HOPR network as soon as possible! For any additional information visit our{' '}
          <a
            href="https://docs.hoprnet.org/node/waitlist-FAQ"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#007bff', textDecoration: 'underline'}}
          >
            FAQ
          </a>.
        </>
      }
      buttons={
        <ConfirmButton
          onClick={()=>{navigate('/staking/dashboard');}}
        >
          VIEW DASHBOARD
        </ConfirmButton>
      }
    >
      <Content>
        <StepsContainer>
          <Instruction num={1}>
            <Content>
              <span>
                Join the waitlist by filling out{' '}
                <StyledLink
                  to={`https://cryptpad.fr/form/#/2/form/view/7TwSgsF+CnW-aw24uyPlE4Gej3DX-jjeYmyk9-Q-6RQ/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >this form</StyledLink>.
              </span>
              <StyledTransactionHashWithIcon>
                <p>Safe address:</p>
                <TruncatedEthereumAddressWithTooltip address={safeAddress ? safeAddress : 'Loading...'} />
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(safeAddress as string);
                  }}
                >
                  {' '}
                  <ContentCopyIcon />
                </IconButton>
              </StyledTransactionHashWithIcon>
            </Content>
          </Instruction>
          <RightArrow>
            <ArrowRightAltIcon style={{ fontSize: '60px' }} />
          </RightArrow>
          <Instruction num={2}>
            <p>
              View your position on the waitlist{' '}
              <StyledLink
                to={`https://cryptpad.fr/sheet/#/2/sheet/view/NYbRDH+C993dfHwEL1RyyKNtxG5pRoOaxtI4hbRVUBw/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </StyledLink>.
            </p>
          </Instruction>
          <RightArrow>
            <ArrowRightAltIcon style={{ fontSize: '60px' }} />
          </RightArrow>
          <Instruction
            num={3}
            description="Once approved, return here to continue your journey."
          />
        </StepsContainer>
        <Note>
          Note: You can close this tab now, as it may take over a week to approve your address.
          Once approved, you can return to this point in the journey by re-visiting{' '}
          <StyledLink
            to={`https://hub.hoprnet.org`}
            target="_blank"
            rel="noopener noreferrer"
          >hub.HOPRnet.org</StyledLink>{' '}and re-connecting your wallet.
          For now, keep an eye on the{' '}
          <StyledLink
            to={`https://cryptpad.fr/sheet/#/2/sheet/view/NYbRDH+C993dfHwEL1RyyKNtxG5pRoOaxtI4hbRVUBw/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            waitlist
          </StyledLink>{' '} or view your funds in the dashboard by clicking the button below.
        </Note>
      </Content>
    </StepContainer>
  );
}
