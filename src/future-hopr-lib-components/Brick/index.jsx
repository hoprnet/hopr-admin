import React from 'react';
import styled from '@emotion/styled';

import Typography from '../Typography/index.jsx';
import Button from '../Button/index.jsx';

const SBrick = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 16px;
  &.Brick--reverse {
    flex-direction: row-reverse;
    gap: 32px;
  }
  &.mbt80 {
    margin-top: 80px;
    margin-bottom: 80px;
  }
`;

const TextContainer = styled.div`
  flex: 6;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  div {
    text-align: left;
  }
  ${(props) => (props.centerText ? 'justify-content: center;' : '')}
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-self: flex-start;
  flex: 5;
  @media (max-width: 699px) {
    display: none;
  }
`;

const Image = styled.img`
  height: auto;
  max-width: 100%;
  border-radius: 28px;
  ${(props) =>
    props.noShadow ? '' : 'box-shadow: 0px 2px 34px -7px rgb(0 0 0 / 50%);'}
  &.mobileOnly {
    margin-bottom: 16px;
    @media (min-width: 700px) {
      display: none;
    }
  }
`;

function Brick(props) {
  return (
    <SBrick
      className={`Brick ${props.reverse ? 'Brick--reverse' : ''} ${
        props.className
      }`}
    >
      <TextContainer centerText={props.centerText}>
        <Typography type="h5">{props.title}</Typography>
        <Image
          className="mobileOnly"
          src={props.image}
          noShadow={props.noShadow}
        />
        <Typography>{props.text}</Typography>
        {props.button && (
          <Button hopr href={props.buttonHref} target="_blank">
            {props.button}
          </Button>
        )}
      </TextContainer>
      <ImageContainer>
        <Image src={props.image} noShadow={props.noShadow} />
      </ImageContainer>
    </SBrick>
  );
}

export default Brick;

Brick.defaultProps = {
  className: '',
  reverse: false,
};
