import styled from '@emotion/styled';

const BalanceFieldContent = styled.div`
  background: rgba(10, 10, 10, 0.25);
  padding: 8px;
  border-radius: 8px;
  width: 112px;
  flex-shrink: 0;
  .BalanceFieldLabel {
    display: flex;
    gap: 6px;
    .BalanceFieldLabelText {
      font-size: 14px;
    }
  }
`;

const balanceFormat = (input) => {
  //  console.log('balanceFormat', input)
  if (input === '-') return input;
  if (input < 1) return parseFloat(input).toFixed(4);
  if (input < 10) return parseFloat(input).toFixed(3);
  if (input < 100) return parseFloat(input).toFixed(2);
  return parseFloat(input).toFixed(1);
};

const BalanceField = (props) => {
  // console.log('BalanceField', props)
  return (
    <BalanceFieldContent className="BalanceFieldContent">
      <div className="BalanceFieldLabel">
        <img
          src={props.icon}
          className="BalanceFieldLabelIcon"
          width="18"
          height="18"
        />
        <div className="BalanceFieldLabelText">
          {props.coin}:{' '}
          {props.value === '-' ? '______' : balanceFormat(props.value)}
        </div>
      </div>
    </BalanceFieldContent>
  );
};

export default BalanceField;
