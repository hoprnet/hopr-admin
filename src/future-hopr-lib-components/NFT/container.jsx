import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-evenly;
`;

export default function NftContainer(props) {
  return <Container className={['NftContainer'].join(' ')}>{props.children}</Container>;
}
