import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';

type SelectFormProps = FormControlProps;

type ReturnType = [React.MemoExoticComponent<(props: SelectFormProps) => JSX.Element>, string];

export const useSelectBox = (label: string, values: string[]): ReturnType => {
  const [selectedValue, setSelectedValue] = useState<string>(values[0]);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  }, []);

  const SelectForm = React.memo((props: SelectFormProps) => {
    const id = useMemo(() => `select-${label}`, []);

    return (
      <FormControl sx={{ my: 2, minWidth: 120 }} {...props}>
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
  });

  return [SelectForm, selectedValue];
};
