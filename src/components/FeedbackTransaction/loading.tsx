import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const ldsDefaultAnimation = keyframes`
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
`;

const Loader = styled.div`
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
`;

const Ball = styled.div`
  position: absolute;
  width: 7.5%;
  height: 7.5%;
  background: black;
  border-radius: 50%;
  animation: ${ldsDefaultAnimation} 1.2s linear infinite;

  &:nth-of-type(1) {
    animation-delay: 0s;
    top: 46.25%;
    left: 82.5%;
  }
  &:nth-of-type(2) {
    animation-delay: -0.1s;
    top: 27.5%;
    left: 77.5%;
  }
  &:nth-of-type(3) {
    animation-delay: -0.2s;
    top: 13.75%;
    left: 65%;
  }
  &:nth-of-type(4) {
    animation-delay: -0.3s;
    top: 8.75%;
    left: 46.25%;
  }
  &:nth-of-type(5) {
    animation-delay: -0.4s;
    top: 13.75%;
    left: 27.5%;
  }
  &:nth-of-type(6) {
    animation-delay: -0.5s;
    top: 27.5%;
    left: 13.75%;
  }
  &:nth-of-type(7) {
    animation-delay: -0.6s;
    top: 46.25%;
    left: 8.75%;
  }
  &:nth-of-type(8) {
    animation-delay: -0.7s;
    top: 65%;
    left: 13.75%;
  }
  &:nth-of-type(9) {
    animation-delay: -0.8s;
    top: 77.5%;
    left: 27.5%;
  }
  &:nth-of-type(10) {
    animation-delay: -0.9s;
    top: 82.5%;
    left: 46.25%;
  }
  &:nth-of-type(11) {
    animation-delay: -1s;
    top: 77.5%;
    left: 65%;
  }
  &:nth-of-type(12) {
    animation-delay: -1.1s;
    top: 65%;
    left: 77.5%;
  }
`;

export function Loading() {
  return (
    <Loader>
      {Array.from({ length: 12 }).map((_, idx) => (
        <Ball key={idx} />
      ))}
    </Loader>
  );
}
