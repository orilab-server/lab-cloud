import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';

type SelectFormProps = FormControlProps;

export const useSelectBox = (label: string, values: string[]) => {
  const [selectedValue, setSelectedValue] = useState<string>(values[0]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const SelectForm = (props: SelectFormProps) => {
    const id = `select-${label}`;
    return (
      <FormControl sx={{ mx: 1, my: 2, minWidth: 120 }} {...props}>
        <InputLabel id={id}>{label}</InputLabel>
        <Select labelId={id} id={id} value={selectedValue} label={label} onChange={handleChange}>
          {values.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return [SelectForm, selectedValue] as [(props: SelectFormProps) => JSX.Element, string];
};
