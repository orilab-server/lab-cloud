import Modal from '@/shared/components/Elements/Modal';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { format } from 'date-fns';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAcceptRegisterRequests } from '../../api/acceptRegisterRequests';
import { useRegisterRequests } from '../../api/getRegisterRequests';

type ConfirmRequestsModalProps = {
  isOpen: boolean;
  close: () => void;
};

interface ConfirmRequestsModalInput {
  accepts: string;
}

const ConfirmRequestsModal = ({ isOpen, close }: ConfirmRequestsModalProps) => {
  const registerRequests = useRegisterRequests();
  const acceptRequestMutation = useAcceptRegisterRequests();
  const requests = registerRequests.data?.requests || [];

  const { control, handleSubmit, getValues, setValue } = useForm<ConfirmRequestsModalInput>({
    defaultValues: {
      accepts: '',
    },
  });

  const handleCheck = (request: { email: string }, event: React.ChangeEvent<{}>) => {
    const values = (getValues('accepts')?.split(',') || []).filter((v) => v);
    const newValues = (() => {
      if ((event.target as HTMLInputElement).checked) {
        return [...(values ?? []), request.email];
      }
      return values?.filter((value) => value !== request.email);
    })();
    setValue('accepts', newValues.join(','));

    return newValues.join(',');
  };

  const handleCheckAll = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    if (
      getValues('accepts')
        .split(',')
        .filter((v) => v).length === requests.length
    ) {
      if (checked) return getValues('accepts');
      setValue('accepts', '');
      return '';
    }
    const all = requests.map((request) => request.email).join(',');
    setValue('accepts', all);
    return all;
  };

  const onSubmit = async () => {
    const accepts = getValues('accepts');
    const submitData = accepts.split(',').map((email) => {
      const formData = new FormData();
      formData.append('email', email);
      return formData;
    });
    await acceptRequestMutation.mutateAsync({ formData: submitData });
  };

  return (
    <Modal isOpen={isOpen} title="登録申請" buttonTxt="承認" go={onSubmit} close={close}>
      <FormGroup>
        <FormControlLabel label="All" control={<Checkbox />} onChange={handleCheckAll} />
        <Controller
          name="accepts"
          control={control}
          rules={{ required: '選択してください。' }}
          render={({ field }) => (
            <>
              {requests.map((request) => (
                <FormControlLabel
                  {...field}
                  key={request.id}
                  checked={getValues('accepts').split(',').includes(request.email)}
                  label={
                    <Stack
                      sx={{ width: '100%' }}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography sx={{ mx: 1, fontSize: 18 }}>{request.name}</Typography>
                      <Typography sx={{ mx: 1, fontSize: 14 }}>
                        申請日 : {format(new Date(request.created_at), 'yyyy年MM月dd日')}
                      </Typography>
                    </Stack>
                  }
                  control={<Checkbox />}
                  onChange={(event) => field.onChange(handleCheck(request, event))}
                />
              ))}
            </>
          )}
        />
      </FormGroup>
    </Modal>
  );
};

export default React.memo(ConfirmRequestsModal);
