import styled from '@emotion/styled';
import { Paper } from '@mui/material';

export const StyledCard = styled(Paper)`
  min-width: 400px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ImageContainer = styled.div<{ width?: number; height?: number }>`
  height: ${(props) => (props.height ? `${props.height}px` : '200px')};
  width: ${(props) => (props.width ? `${props.width}px` : '100%')};
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
`;

export const Description = styled.p`
  font-weight: 500;
  margin: 0;
  text-align: center;
`;
