import { extractDateInStr } from '@/shared/utils/slice';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { useRename } from '../../api/main/rename';
import { contextMenuState } from '../../modules/stores';

export const useFileRename = () => {
  const router = useRouter();
  const renameMutation = useRename();
  const setContextMenu = useSetRecoilState(contextMenuState);

  const rename = async (name: string, oldName: string) => {
    const [, createdAt] = extractDateInStr(oldName);
    const newName = createdAt
      ? !Array.from(oldName).includes('.')
        ? `${name}_${createdAt}`
        : `${name}_${createdAt}${oldName.slice(oldName.indexOf('.'))}`
      : name;
    await renameMutation.mutateAsync({
      path: `/${(router.query.path as string) || ''}`.replaceAll('//', '/'),
      oldName,
      newName,
    });
    setContextMenu({});
  };

  const renameCancel = () => setContextMenu({});

  return { rename, renameCancel };
};
