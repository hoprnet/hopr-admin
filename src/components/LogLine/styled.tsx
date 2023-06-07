import styled from '@emotion/styled';

export const LogLineContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Time = styled.time`
  font-size: 0.7rem;
  display: block;
  opacity: 0.3;
  text-align: right;
  order: 2;
  flex: 0;
`;
export const Pre = styled.pre`
  padding: 0.2rem;
  margin: 0;
  order: 1;
  flex: 1;
  white-space: break-spaces;
`;

export const LogLineIcons = styled.div`
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
`;
