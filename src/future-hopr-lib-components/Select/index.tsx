import React from 'react';
import styled from '@emotion/styled';

//mui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SelectMui, { SelectProps as SelectMuiProps } from '@mui/material/Select';
import { Tooltip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SFormControl = styled(FormControl)`
  margin-bottom: 16px;
  margin-top: 24px;
  label {
    font-size: 17px;
  }
  .MuiOutlinedInput-root {
    font-size: 17px;
  }
  .MuiFormLabel-root.MuiInputLabel-shrink {
    color: #000030;
  }
  .MuiInputBase-root {
    button.removeValue {
      display: none;
    }
  }
`;

interface Props extends SelectMuiProps {
  removeValue?: (value: number) => void;
  removeValueTooltip?: string;
  values?: {
    value: string | number;
    name: string | number | null;
  }[];
  native?: boolean
}

const Select: React.FC<Props> = (props) => {
  return (
    <SFormControl style={props.style}>
      <InputLabel id="select-small">{props.label}</InputLabel>
      <SelectMui
        labelId="select-small"
        id="select-small"
        size={props.size}
        value={props.value}
        onChange={props.onChange}
        label={props.label}
        disabled={props.disabled}
        native={props.native}
      >
        {props.values &&
          props.values.map((elem, index) => (
            <MenuItem
              value={elem.value}
              key={`${elem.value}_${elem.name}_${index}`}
              style={props.removeValue && { justifyContent: 'space-between' }}
            >
              {elem.name}
              {props.removeValue && (
                <Tooltip title={props.removeValueTooltip}>
                  <IconButton
                    aria-label="delete"
                    className="removeValue"
                    onClick={(event) => {
                      event.stopPropagation();
                      props?.removeValue?.(Number(elem.value));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </MenuItem>
          ))}
      </SelectMui>
    </SFormControl>
  );
};

export default Select;
