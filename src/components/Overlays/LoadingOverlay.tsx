import styled from '@emotion/styled';

// MUI
import { CircularProgress } from '@mui/material';

export const Overlay = styled.div`
  transition: margin-left 0.4s ease-out;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  color: #000050;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  gap: 32px;
  z-index: 1000;
  .bold {
    font-weight: 700;
  }
  div {
    width: 100%;
    text-align: center;
  }
  button {
    height: unset;
  }
  @media screen and (min-width: 500px) {
    padding: 16px;
  }
`;

const css = `
  .drawerHidden .Overlay {
    margin-left: 0px;
    width: calc( 100%  - 16px);
  }

  @media screen and (min-width: 500px) {
    .drawerOpen .Overlay {
      margin-left: 240px;
      width: calc( 100% - 240px - 32px);
    }

    .drawerClosed .Overlay {
      margin-left: 56px;
      width: calc( 100% - 56px - 32px);
    }
  }
`

export default function LoadingOverlay(props: {loading: boolean}) {
  return (
    <>
      { props.loading &&
        <Overlay
          className={'Overlay'}
        >
          <style>{css}</style>
          <CircularProgress/>
        </Overlay>
      }
    </>
  )
}
