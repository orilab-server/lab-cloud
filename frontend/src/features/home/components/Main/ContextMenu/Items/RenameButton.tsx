import { contextMenuState } from '@/features/home/modules/stores';
import { useSetRecoilState } from 'recoil';

type DLButtonProps = {
  selected: string;
};

interface NewNameInputs {
  name: string;
}

const RenameButton = ({ selected }: DLButtonProps) => {
  const setContextMenu = useSetRecoilState(contextMenuState);

  return (
    <>
      <button
        onClick={() => setContextMenu({ rename: selected })}
        className="text-white hover:bg-gray-700 px-3 py-1"
      >
        名前を変更
      </button>
    </>
  );
};

export default RenameButton;
