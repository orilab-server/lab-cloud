import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAddNewItem } from '../../api/addNewItem';
import { useCollection } from '../../api/getCollection';
import { useUpdateItem } from '../../api/updateItem';
import { LinksInput } from '../misc/LinksInput';
import { ModalLayout } from '../misc/ModalLayout';
import { TypographyOrTextField } from '../misc/TypographyOrTextField';
import { UpdateImageArea } from '../misc/UpdateImageArea';

type AddItemProps = {
  children: React.ReactNode;
  modals: [
    React.FC<{
      children: React.ReactNode;
    }>,
    () => void,
    () => void,
    boolean,
  ];
};

interface FormData {
  title: string;
  description: string;
  memberId: string;
}

type NewItem = Omit<FormData, 'memberId'> & { links: string[] };

export const AddItem = ({ children, modals }: AddItemProps) => {
  const [Modal, openM, closeM] = modals;
  const [links, setLinks] = useState<{ [key: string]: string }>({ 'link-0': '' });
  const [file, setFile] = useState<File | null>(null);
  const addNewItemMutation = useAddNewItem<NewItem>('researches', 'hp');
  const updateMemberMutation = useUpdateItem('members');
  const membersQuery = useCollection('members');
  const members = membersQuery.data || [];

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      memberId: '',
    },
  });
  const onSubmit: SubmitHandler<FormData> = async ({ title, description, memberId }) => {
    if (file === null) {
      alert('画像を選択してください');
      return;
    }
    const dispatchData = { title, description, links: Object.values(links) };
    const id = await addNewItemMutation
      .mutateAsync({
        data: dispatchData,
        file,
      })
      .finally(() => closeM());
    const targetMember = members.find((member) => Object.is(member.id, memberId));
    const newResearches = [...(targetMember?.researches || []), id || ''].filter(
      (item) => item !== '',
    );
    await updateMemberMutation.mutateAsync({
      docId: memberId,
      data: { researches: newResearches },
    });
  };

  return (
    <>
      <Box onClick={openM} sx={{ width: '100%', height: '100%' }}>
        {children}
      </Box>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            alignItems="start"
            spacing={3}
            sx={{ width: '100%' }}
          >
            <UpdateImageArea edit={true} fileState={[file, setFile]} url={undefined} />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>タイトル</Typography>}
              control={control}
              name="title"
              value={getValues('title')}
              edit
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={
                <Typography sx={{ mx: 1, fontSize: 16, whiteSpace: 'nowrap' }}>内容</Typography>
              }
              control={control}
              name="description"
              value={getValues('description')}
              multiline={true}
              edit
              rows={5}
            />
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <Typography sx={{ whiteSpace: 'nowrap' }}>研究者</Typography>
              <Controller
                name="memberId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="researching-member">名前</InputLabel>
                    <Select
                      labelId="researching-member"
                      label="名前"
                      sx={{ width: '50%', color: 'black' }}
                      {...field}
                    >
                      {members.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          {member.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>
            <LinksInput links={links} setLinks={setLinks} />
            {/* 各種ボタン */}
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="secondary">
                {addNewItemMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
                <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>送信</Typography>
              </Button>
            </Stack>
          </Stack>
        </ModalLayout>
      </Modal>
    </>
  );
};
