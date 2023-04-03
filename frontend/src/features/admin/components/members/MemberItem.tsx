import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Box, Stack, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { FaUserGraduate } from 'react-icons/fa';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { useUpdateOld } from '../../api/updateToOld';
import { Member } from '../../types';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type UserItemProps = {
  member: Member;
  button: ReactNode;
};

interface FormData {
  name: string;
  name_en: string;
  introduction: string;
  year: number;
}

export const UserItem = ({ member, button }: UserItemProps) => {
  const [Modal, openM, closeM] = useModal(member.id);
  const [edit, setEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const onToggleEdit = () => setEdit(!edit);

  const image = useStorageImage('members', member.id);
  const deleteItemMutation = useDeleteItem('members', 'hp');
  const updateItemMutation = useUpdateItem('members', 'hp');
  const updateOldMutation = useUpdateOld();

  const { control, getValues } = useForm<FormData>({
    defaultValues: {
      name: member.name,
      name_en: member.name_en,
      introduction: member.introduction,
      year: member.year,
    },
  });
  const onDeleteDoc = async () => {
    const ok = window.confirm('削除しますか？');
    if (ok) {
      await deleteItemMutation.mutateAsync({ docId: member.id }).finally(() => closeM());
    }
  };
  const onSubmit = async () => {
    const data: FormData = {
      name: getValues('name'),
      name_en: getValues('name_en'),
      introduction: getValues('introduction'),
      year: getValues('year'),
    };
    await updateItemMutation.mutateAsync({ docId: member.id, data, file });
  };

  return (
    <>
      <Box sx={{ width: '100%', height: '100%', cursor: 'pointer' }} onClick={openM}>
        {button}
      </Box>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <Stack spacing={3} sx={{ width: '100%' }}>
            {member.old && (
              <div className="flex space-x-3 mt-5">
                <FaUserGraduate size={30} className="text-red-500" />
                <span className="text-red-500 font-semibold">OB・OG</span>
              </div>
            )}
            <UpdateImageArea url={image.data} edit={edit} fileState={[file, setFile]} />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>氏名</Typography>}
              control={control}
              name="name"
              value={getValues('name')}
              edit={edit}
            />
            <TypographyOrTextField
              sx={{ width: '30%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>入学年</Typography>}
              control={control}
              name="year"
              value={getValues('year')}
              edit={edit}
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>英語氏名</Typography>}
              control={control}
              name="name_en"
              value={getValues('name_en')}
              edit={edit}
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={
                <Typography sx={{ mx: 1, fontSize: 16, whiteSpace: 'nowrap' }}>自己紹介</Typography>
              }
              control={control}
              name="introduction"
              value={getValues('introduction')}
              multiline={true}
              edit={edit}
              rows={5}
            />
            {/* 各種ボタン */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                {edit && (
                  <button onClick={onSubmit} className="btn btn-info text-white">
                    {updateItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                    <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>送信</Typography>
                  </button>
                )}
                <button onClick={onToggleEdit} className="btn btn-info text-white">
                  {edit ? '戻る' : '編集する'}
                </button>
              </Stack>
              <div className="flex space-x-3">
                <button
                  onClick={async () =>
                    await updateOldMutation.mutateAsync({
                      id: member.id,
                      already: Boolean(member.old),
                    })
                  }
                  className="btn btn-warning"
                >
                  {member.old ? 'OB・OGを解除' : 'OB・OGに設定'}
                </button>
                <button onClick={onDeleteDoc} className="btn btn-error text-white">
                  {deleteItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                  <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>削除</Typography>
                </button>
              </div>
            </Stack>
          </Stack>
        </ModalLayout>
      </Modal>
    </>
  );
};
