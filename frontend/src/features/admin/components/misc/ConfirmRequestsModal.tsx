import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { format } from 'date-fns';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useAcceptRegisterRequests } from '../../api/acceptRegisterRequests';
import { useRegisterRequests } from '../../api/getRegisterRequests';

type ConfirmRequestsModalProps = {};

interface ConfirmRequestsModalInput {
  accepts: string;
}

const ConfirmRequestsModal = ({}: ConfirmRequestsModalProps) => {
  const [Modal, openM, closeM] = useModal('grid');
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

  const onSubmit: SubmitHandler<ConfirmRequestsModalInput> = async ({ accepts }) => {
    const submitData = accepts.split(',').map((email) => {
      const formData = new FormData();
      formData.append('email', email);
      return formData;
    });
    await acceptRequestMutation.mutateAsync({ formData: submitData });
  };

  return (
    <>
      <Grid
        item
        xs={3}
        onClick={openM}
        sx={{
          py: 15,
          background: 'rgb(30,144,255)',
          borderRadius: '5px',
          mx: 1,
          my: 1,
          cursor: 'pointer',
          '&:hover': {
            background: 'rgba(0,191,255)',
          },
        }}
      >
        <Typography sx={{ p: 1, color: '#fff', fontSize: 18 }}>登録申請を確認</Typography>
      </Grid>
      <Modal>
        <Stack
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'white',
            boxShadow: 24,
            width: '70vw',
            p: 5,
            px: 10,
          }}
          spacing={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography sx={{ fontSize: 20 }}>登録申請を確認</Typography>
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
          <Stack direction="row">
            <Button type="submit" variant="contained">
              {acceptRequestMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
              <Typography sx={{ mx: 1, whiteSpace: 'nowrap' }}>承認</Typography>
            </Button>
            <Button onClick={closeM}>閉じる</Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

export default React.memo(ConfirmRequestsModal);
