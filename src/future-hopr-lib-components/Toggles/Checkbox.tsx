import FormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox, { CheckboxProps } from '@mui/material/Checkbox';

interface Props extends CheckboxProps {
  label?: string;
}

const Checkbox: React.FC<Props> = (props) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          onChange={props.onChange}
          value={props.value}
        />
      }
      label={props.label}
    />
  );
};

export default Checkbox;
