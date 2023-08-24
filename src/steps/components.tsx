import React from 'react';
import styled from '@emotion/styled';

// Mui
import Paper from '@mui/material/Paper/Paper';

const SPaper = styled(Paper)`
  max-width: 850px;
  width: 100%;
  height: 620px;
  overflow: auto;
`

const StepTitle = styled.h2`
    color: #414141;
    font-size: 32px;
    font-weight: 400;
    text-align: center;
    text-transform: uppercase;
    margin: 0;
`

const StepDescription = styled.p<{ descriptionLeft?: boolean }>`
  color: #414141;
  font-weight: 500;
  margin: 0;
  max-width: 80ch;
  text-align: ${(props) => (props.descriptionLeft ? 'left' : 'center')};
`;

const ImageContainer = styled.div<{ width?: number; height?: number }>`
  height: ${(props) => (props.height ? `${props.height}px` : '200px')};
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
`;

export function StepContainer(props: any) {
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
            {props.title && <StepTitle>{props.title}</StepTitle> }
            {props.description && <StepDescription descriptionLeft={props.descriptionLeft}>{props.description}</StepDescription>}
            <div>
                {props.children}
            </div>
        </SPaper>
    );
}

  