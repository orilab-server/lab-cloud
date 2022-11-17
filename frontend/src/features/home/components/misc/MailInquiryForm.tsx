import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useMailSender } from '@/shared/hooks/useMailSender';
import { useSelectBox } from '@/shared/hooks/useSelectBox';
import {
  Button,
  Container,
  createTheme,
  CssBaseline,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  width: '50vw',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'white',
  boxShadow: 24,
  p: 5,
};

interface MailInquiryFormInput {
  detail: string;
}

type MailInquiryFormProps = {
  name?: string;
  close: () => void;
};

const theme = createTheme();
const selectTypeValues = ['バグ報告', 'UI/UX改善案', 'その他'];

export const MailInquiryForm = ({ name, close }: MailInquiryFormProps) => {
  const [TypeSelectForm, selectedTypeValue] = useSelectBox('種別', selectTypeValues);
  const sendMailMutation = useMailSender();
  const { handleSubmit, control } = useForm<MailInquiryFormInput>({
    defaultValues: {
      detail: '',
    },
  });

  const onSendInquiry: SubmitHandler<MailInquiryFormInput> = async (data) => {
    const { detail } = data;
    if (detail) {
      await sendMailMutation
        .mutateAsync({
          name: name as string,
          subject: `問い合わせ種別 : ${selectedTypeValue}`,
          body: `<問い合わせ内容>\n\n \t${detail}`,
        })
        .then(() => close());
    } else {
      alert('詳細を入力してください');
    }
  };

  return (
    <Box sx={modalStyle}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              問合せフォーム
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSendInquiry)}
                noValidate
                sx={{ mt: 1 }}
              >
                <TypeSelectForm fullWidth />
                <Controller
                  name="detail"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      margin="normal"
                      fullWidth
                      multiline
                      rows={5}
                      name="detail"
                      label="詳細"
                      type="text"
                      id="name"
                    />
                  )}
                />
                <Stack direction="row">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, mr: 1, whiteSpace: 'nowrap' }}
                  >
                    <Typography sx={{ width: '100%', textAlign: 'center' }}>送信</Typography>
                    {sendMailMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
                  </Button>
                  <Button
                    color="secondary"
                    onClick={close}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, ml: 1 }}
                  >
                    閉じる
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
};
