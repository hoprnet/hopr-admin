import React from 'react';
import styled from '@emotion/styled';

//mui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SelectMui, { SelectProps as SelectMuiProps } from '@mui/material/Select';
import { Tooltip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateBase64Jazz } from '../../utils/functions';

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

  &.showJazzIcon{
    .select-menu-item-text {
    margin-left: 30px;
  }

    img.node-jazz-icon{
      position: fixed;
    }
  }

`;

interface Props extends SelectMuiProps {
  removeValue?: (value: number) => void;
  removeValueTooltip?: string;
  showJazzIcon?: boolean;
  values?: {
    value: string | number;
    name: string | number | null;
    apiEndpoint: string | null;
    disabled?: boolean;
  }[];
  native?: boolean;
}

const Select: React.FC<Props> = (props) => {
  return (
    <SFormControl
      style={props.style}
      className={`${props.showJazzIcon ? 'showJazzIcon' : ''}`}
    >
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
        MenuProps={{ disableScrollLock: true }}
      >
        {props.values &&
          props.values.map((elem, index) => {
            const icon = elem.apiEndpoint && generateBase64Jazz(elem.apiEndpoint);
            return (<MenuItem
              value={elem.value}
              disabled={elem.disabled}
              key={`${elem.value}_${elem.name}_${index}`}
              id={`${elem.value}_${elem.name}_${index}`}
              style={props.removeValue && { justifyContent: 'space-between' }}
            >
              {
                props.showJazzIcon &&
                <img
                  className="node-jazz-icon"
                  src={icon ?? "/assets/hopr_logo.svg" }
                />
              }
              <span className="select-menu-item-text">{elem.name}</span>
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
          )})}
      </SelectMui>
    </SFormControl>
  );
};

export default Select;
