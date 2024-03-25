import styled from '@emotion/styled';
import { useAppDispatch } from '../../../../store';
import { StepContainer } from '../components';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { ConfirmButton } from '../components';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TitleWithSVGContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Container = styled.div`
  display: flex;
  gap: 1rem;
  min-height: 290px;
  justify-content: space-around;
  padding: 24px;
  margin-bottom: 16px;
`;

const ImageContainer = styled.div<{ width?: number; height?: number }>`
  height: ${(props) => (props.height ? `${props.height}px` : '200px')};
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

const Title = styled.h2`
  color: #414141;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
  text-align: left;
`;

const TextUnderImage = styled.div`
  color: #414141;
  font-size: 16px;
  font-style: normal;
  font-weight: 450;
  line-height: 22px;
  p {
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;

const Overlap = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 17px;
  left: -32px;
  .svg1 {
    z-index: 1;
  }

  .svg2 {
    position: absolute;
    left: 70px; // This will make SVG2 start at the middle of SVG1
  }
`;

const CenteredFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    align-self: flex-start;
  }
`;

const OverlappingSVGs = ({
  firstSVG,
  secondSVG,
}: {
  firstSVG: {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
  };
  secondSVG: {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
  };
}) => {
  return (
    <Overlap>
      <ImageContainer
        className="svg1"
        height={firstSVG.height}
        width={firstSVG.width}
      >
        <Image
          src={firstSVG.src}
          alt={firstSVG.alt}
        />
      </ImageContainer>
      <ImageContainer
        className="svg2"
        height={secondSVG.height}
        width={secondSVG.width}
      >
        <Image
          src={secondSVG.src}
          alt={secondSVG.alt}
        />
      </ImageContainer>
    </Overlap>
  );
};

const TitleWithSVG = (props: {
  title: any;
  img?: {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
  };
  img2?: {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
  };
  children?: JSX.Element;
  style?: object;
}) => {
  return (
    <TitleWithSVGContent style={props.style}>
      <Title>{props.title}</Title>
      {props.img && (
        <ImageContainer
          height={props.img.height}
          width={props.img.width}
        >
          <Image
            src={props.img.src}
            alt={props.img.alt}
          />
        </ImageContainer>
      )}
      {props.img2 && (
        <ImageContainer
          height={props.img2.height}
          width={props.img2.width}
        >
          <Image
            src={props.img2.src}
            alt={props.img2.alt}
          />
        </ImageContainer>
      )}
      <div>{props.children}</div>
    </TitleWithSVGContent>
  );
};

export default function WhatYouWillNeedPage() {
  const dispatch = useAppDispatch();
  return (
    <StepContainer
      title={'WHAT YOU WILL NEED'}
      description={
        'It will take 20 minutes to set up your Safe/node and join the network waitlist. Before starting, make sure you have the required tokens.'
      }
      buttons={
        <ConfirmButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(1));
          }}
        >
          CONTINUE
        </ConfirmButton>
      }
    >
      <Content>
        <Container>
          <TitleWithSVG
            title="time"
            img={{
              src: '/assets/clock.svg',
              height: 100,
              width: 100,
            }}
            img2={{
              src: '/assets/clock-waitlist.svg',
              height: 100,
              width: 100,
            }}
          />
          <TitleWithSVG title="token">
            <CenteredFlex>
              <OverlappingSVGs
                firstSVG={{
                  src: '/assets/wxHoprIcon.svg',
                  height: 100,
                  width: 100,
                }}
                secondSVG={{
                  src: '/assets/xdai-icon-with-green-x.svg',
                  height: 90,
                  width: 90,
                }}
              />
              <TextUnderImage style={{ maxWidth: '280px' }}>
                <p>min. 10k wxHOPR with Network Registry NFT</p>
                <p>min. 30k wxHOPR without Network Registry NFT</p>
                <p>+</p>
                <p>min. 3 xDAI</p>
              </TextUnderImage>
            </CenteredFlex>
          </TitleWithSVG>
          <TitleWithSVG
            title="NODE"
            img={{
              src: '/assets/node-blue.svg',
              height: 75,
              width: 100,
            }}
          />
          <TitleWithSVG
            title={
              <>
                Network
                <br />
                registry NFT*
              </>
            }
            img={{
              src: '/assets/network-registry-nft-icon.svg',
              height: 100,
              width: 100,
            }}
            style={{ maxWidth: '100px' }}
          >
            <TextUnderImage>
              <p style={{ textAlign: 'center' }}>*optional</p>
            </TextUnderImage>
          </TitleWithSVG>
        </Container>
      </Content>
    </StepContainer>
  );
}
