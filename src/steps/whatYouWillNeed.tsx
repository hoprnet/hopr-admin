import styled from '@emotion/styled';
import Card from '../components/Card';
import Button from '../future-hopr-lib-components/Button';
import Section from '../future-hopr-lib-components/Section';

const ConfirmButton = styled(Button)`
  width: 250px;
  align-self: center;
  text-transform: uppercase;
`;

const Content = styled.div`
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
  border-bottom: 1px solid #414141;
`;

const ImageContainer = styled.div<{ width?: number; height?: number }>`
  height: ${(props) => (props.height ? `${props.height}px` : '200px')};
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
`;

const Title = styled.h2`
  color: #414141;
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
`;

const Overlap = styled.div`
  display: flex;
  position: relative;

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
`

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
  title: string;
  img?: {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
  };
  children?: JSX.Element;
}) => {
  return (
    <Content>
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
      <div>{props.children}</div>
    </Content>
  );
};

export default function WhatYouWillNeedPage() {
  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card
        title="what you will need"
        description="It will take 20 minutes to join the network waitlist. Before starting make sure you have got the required tokens."
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
                <p>min. 10k wxHOPR with NR NFT</p>
                <p>min. 30k wxHOPR without NR NFT</p>
                <p>+</p>
                <p>min. 1 xDAI</p>
              </CenteredFlex>
            </TitleWithSVG>
            <TitleWithSVG
              title="optional"
              img={{
                src: '/assets/network-registry-nft-icon.svg',
                height: 100,
                width: 100,
              }}
            />
          </Container>
          <ConfirmButton>continue</ConfirmButton>
        </Content>
      </Card>
    </Section>
  );
}
