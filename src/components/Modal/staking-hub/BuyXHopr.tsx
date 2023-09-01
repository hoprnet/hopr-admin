import styled from '@emotion/styled';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DialogTitle, IconButton } from '@mui/material';
import Button from '../../../future-hopr-lib-components/Button';
import { SDialog, SDialogContent, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import CloseIcon from '@mui/icons-material/Close';

const Content = styled(SDialogContent)`
  gap: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding-inline: 2rem;
  align-self: center;
`;

const StyledDialogTitleContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledIconButton = styled(IconButton)`
  height: 32px;
  width: 32px;
  margin: 14px;
  position: absolute;
  right: 0;
  top: 0;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: scale-down;
`;

const ImageContainer = styled.div<{ width?: number; height?: number }>`
  height: ${(props) => (props.height ? `${props.height}px` : '200px')};
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
`;

const StyledLink = styled(Link)`
  color: #0000b4;
  font-weight: 700;
  text-decoration: underline;
`;

const ExchangeButton = styled.div`
  border-radius: 8px;
  border: 1px solid #cbcbcb;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
`;

const StyledThirdStep = styled.div`
  color: #414141;
  text-align: center;
  font-size: 14px;
`;

const Exchange = ({
  src,
  alt,
  height,
  width,
  url,
}: {
  src: string;
  alt: string;
  height: number;
  width: number;
  url: string;
}) => {
  return (
    <Link
      to={url}
      target={'_blank'}
      rel="noopener noreferrer"
    >
      <ExchangeButton>
        <ImageContainer
          height={height}
          width={width}
        >
          <Image
            src={src}
            alt={alt}
          />
        </ImageContainer>
      </ExchangeButton>
    </Link>
  );
};

const Disclaimer = ({
  open,
  handleCloseModal,
  handleContinueModal,
}: {
  open: boolean;
  handleCloseModal: () => void;
  handleContinueModal: () => void;
}) => {
  return (
    <SDialog
      open={open}
      onClose={handleCloseModal}
      disableScrollLock={true}
    >
      <TopBar>
        <StyledDialogTitleContainer>
          <DialogTitle>Disclaimer</DialogTitle>
        </StyledDialogTitleContainer>
        <StyledIconButton
          aria-label="close modal"
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </StyledIconButton>
      </TopBar>
      <Content>
        <p>
          By clicking on this link, you will be redirected to a website provided by a third-party. HOPR (likewise any
          affiliated entity) has no control over the content, offerings (including offerings regarding HOPR tokens) or
          resources of the third-party website, and accepts no responsibility for the third-party website, the content,
          offerings or resources, or for any loss or damage that may arise from your use of the third party-party
          website, the content, offerings or resources. If you decide to access the third-party website, you do so
          entirely at your own risk and subject to the terms and conditions of use for the third-party website.
        </p>
        <ButtonContainer>
          <Button
            onClick={handleCloseModal}
            outlined
          >
            BACK
          </Button>
          <Button
            onClick={() => {
              handleContinueModal();
            }}
          >
            CONTINUE
          </Button>
        </ButtonContainer>
      </Content>
    </SDialog>
  );
};

const OptionsToBuy = ({
  open,
  handleCloseModal,
  handleBackModal,
}: {
  open: boolean;
  handleCloseModal: () => void;
  handleBackModal: () => void;
}) => {
  return (
    <SDialog
      open={open}
      onClose={handleCloseModal}
      disableScrollLock={true}
    >
      <TopBar>
        <StyledDialogTitleContainer>
          <DialogTitle>1. BUY xDAI</DialogTitle>
        </StyledDialogTitleContainer>
        <StyledIconButton
          aria-label="close modal"
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </StyledIconButton>
      </TopBar>
      <Content>
        <Exchange
          alt="bridge exchange"
          height={30}
          width={170}
          src="/assets/exchanges/bridge.svg"
          url="https://www.mtpelerin.com/cryptocurrency/xdai"
        />
        <Exchange
          alt="ramp exchange"
          height={30}
          width={170}
          src="/assets/exchanges/ramp.svg"
          url="https://ramp.network/buy?swapAsset=XDAI"
        />
        <Exchange
          alt="ascend exchange"
          height={30}
          width={170}
          src="/assets/exchanges/ascend.svg"
          url="https://ascendex.com/en/cashtrade-spottrading/usdt/xdai"
        />
        <StyledDialogTitleContainer>
          <DialogTitle>2. SWAP xDAI TO xHOPR</DialogTitle>
        </StyledDialogTitleContainer>
        <Exchange
          alt="cow swap exchange"
          height={30}
          width={170}
          src="/assets/exchanges/cow-swap.svg"
          url="https://swap.cow.fi/#/100/swap/XDAI/HOPR"
        />
        <StyledThirdStep>
          <p>
            3. Wrap xHOPR → wxHOPR <StyledLink to={'/staking/wrapper'}>VIA OUR WRAPPER</StyledLink> (we only accept
            wxHOPR for Staking)
          </p>
        </StyledThirdStep>
        <ButtonContainer>
          <Button
            onClick={handleBackModal}
            outlined
          >
            BACK
          </Button>
        </ButtonContainer>
      </Content>
    </SDialog>
  );
};

const BuyXHopr = () => {
  const [step, set_step] = useState(0);

  const handleOpenDisclaimer = () => {
    set_step(1);
  };

  const handleCloseAllModals = () => {
    set_step(0);
  };

  const handleBackToDisclaimer = () => {
    set_step(1);
  };

  const handleContinueToBuyModal = () => {
    set_step(2);
  };

  return (
    <>
      <div onClick={handleOpenDisclaimer}>
        <p>here</p>
      </div>
      <Disclaimer
        handleCloseModal={handleCloseAllModals}
        handleContinueModal={handleContinueToBuyModal}
        open={step === 1}
      />
      <OptionsToBuy
        handleCloseModal={handleCloseAllModals}
        handleBackModal={handleBackToDisclaimer}
        open={step === 2}
      />
    </>
  );
};

export default BuyXHopr;
