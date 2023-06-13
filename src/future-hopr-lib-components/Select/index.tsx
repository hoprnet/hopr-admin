import React from 'react';
import styled from '@emotion/styled';

//mui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectProps } from '@mui/material/Select';

const SFormControl = styled(FormControl)`
  margin-bottom: 16px;
  margin-top: 24px;
  label {
    font-size: 17px;
  }
  .MuiOutlinedInput-root {
    font-size: 17px;
  }
`;

interface Props extends SelectProps {
  values?: {
    value: string | number;
    name: string | number | null;
  }[];
}

const Section: React.FC<Props> = (props) => {
  return (
    <SFormControl size="small" style={props.style}>
      <InputLabel id="select-small">{props.label}</InputLabel>
      <Select
        labelId="select-small"
        id="select-small"
        value={props.value}
        onChange={props.onChange}
        label={props.label}
        disabled={props.disabled}
      >
        {props.values &&
          props.values.map((elem, index) => (
            <MenuItem
              value={elem.value}
              key={`${elem.value}_${elem.name}_${index}`}
            >
              {elem.name}
            </MenuItem>
          ))}
      </Select>
    </SFormControl>
  );
};

export default Section;
