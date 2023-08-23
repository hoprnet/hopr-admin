import styled from '@emotion/styled';

export const Container = styled.div`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  color: rgb(0, 0, 0);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.429;
  font-family: Roboto, system-ui, sans-serif;
  cursor: auto;
  -webkit-box-direction: normal;
  box-sizing: inherit;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  background-color: #393f49;
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;
  border-color: #e1e2e6;

  &:disabled {
    background-color: #393f49d6;
    pointer-events: none;
    code {
      color: rgb(255 255 255 / 60%);
      user-select: none;
    }
  }
  :hover {
    svg {
      color: #9a9a9a;
    }
  }
  code {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -webkit-box-direction: normal;
    box-sizing: inherit;
    font-family: 'Roboto Mono', consolas, monaco, monospace;
    cursor: pointer;
    align-self: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: normal;
    font-weight: 600;
    unicode-bidi: embed;
    border: none;
    border-radius: 2px;
    padding: 4px 0 4px 12px;
    width: 100%;
    overflow-x: hidden;
    color: #ffffff;
  }
  button {
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -webkit-box-direction: normal;
    font: inherit;
    text-transform: none;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0px;
    border: 0px;
    margin: 0px;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    text-decoration: none;
    text-align: center;
    flex: 0 0 auto;
    overflow: visible;
    color: rgba(0, 0, 0, 0.54);
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    padding: 12px;
    font-size: 2rem;
    border-radius: 0;
  }
  svg {
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -webkit-box-direction: normal;
    font: inherit;
    text-transform: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    text-align: center;
    color: rgba(0, 0, 0, 0.54);
    fill: rgba(0, 0, 0, 0.54);
    box-sizing: inherit;
    user-select: none;
    width: 1em;

    display: inline-block;
    fill: currentcolor;
    flex-shrink: 0;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-size: 1.71429rem;
    overflow: hidden;
  }

  code {
    white-space: normal;
    padding: 8px 0 8px 12px;
    overflow-wrap: anywhere;
  }
`;
