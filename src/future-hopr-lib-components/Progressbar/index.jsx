import React from 'react';
import styled from '@emotion/styled';

const Bar = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 26px;
  border-radius: 2px;
  //   width: 120px;
`;

const Value = styled.div`
  position: absolute;
  line-height: 24px;
  width: 100%;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
`;

const Progress = styled.div`
  height: 100%;
  max-width: ${(props) => props.percentage};
  &.red {
    background-color: rgb(244, 67, 54);
  }
  &.orange {
    background-color: rgba(239, 187, 90, 0.64);
  }
  &.green {
    background-color: rgba(8, 130, 8, 0.64);
  }
`;

function ProgressBar(props) {
  function percentage() {
    if (!props.value) return '0%';
    if (props.value > 1) return '100%';
    return `${Math.round(props.value * 1000) / 10}%`;
  }

  function color() {
    if (!props.value || props.value <= 0.25) return 'red';
    if (props.value <= 0.76) return 'orange';
    return 'green';
  }

  return (
    <Bar>
      <Value className="value">{percentage()}</Value>
      <Progress
        className={`progress ${color()}`}
        percentage={percentage()}
      />
    </Bar>
  );
}

export default ProgressBar;
