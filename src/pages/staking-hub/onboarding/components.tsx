import { ReactNode } from 'react';
import styled from '@emotion/styled';

// HOPR components
import Button from '../../../future-hopr-lib-components/Button';

// Mui
import Paper from '@mui/material/Paper/Paper';

const SPaper = styled(Paper)`
  max-width: 786px;
  width: 100%;
  height: 620px;
  overflow: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

const StepTitle = styled.h2`
  color: #414141;
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  margin: 0;
  margin-bottom: 16px;
`;

const StepDescription = styled.div<{ descriptionLeft?: boolean }>`
  color: #414141;
  font-weight: 500;
  margin: 0;
  text-align: ${(props) => (props.descriptionLeft ? 'left' : 'center')};
  margin-bottom: 16px;
  line-height: 1.5;
  p {
    line-height: 1.5;
    margin: 0;
  }
`;

const ImageContainer = styled.div<{ width?: number; height?: number }>`
  height: ${(props) => (props.height ? `${props.height}px` : '200px')};
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
  margin-bottom: 16px;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: scale-down;
`;

const BottomContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 16px;
`;

export const BackButton = styled(Button)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export const ConfirmButton = styled(Button)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

type StepContainerProps = {
  image?: {
    src: string;
    alt?: string;
    height?: number;
    width?: number;
  };
  title?: string;
  description?: JSX.Element | string;
  descriptionLeft?: boolean;
  children?: ReactNode | undefined;
  buttons?: ReactNode | undefined;
};

export function StepContainer(props: StepContainerProps) {
  return (
    <SPaper>
      {props.image && (
        <ImageContainer
          height={props.image.height}
          width={props.image.width}
        >
          <Image
            src={props.image.src}
            alt={props.image.alt}
          />
        </ImageContainer>
      )}
      {props.title && <StepTitle>{props.title}</StepTitle>}
      {props.description && (
        <StepDescription descriptionLeft={props.descriptionLeft}>{props.description}</StepDescription>
      )}
      <div>{props.children}</div>

      {
        props.buttons &&
        <BottomContainer>
          <Buttons>
            {props.buttons}
          </Buttons>
        </BottomContainer>
      }
    </SPaper>
  );
}
