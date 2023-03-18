import { useContextMenuContextState } from '@/features/home/modules/contetexts/contextMenu';

type DLButtonProps = {
  selected: string;
};

interface NewNameInputs {
  name: string;
}

const RenameButton = ({ selected }: DLButtonProps) => {
  const [, setContextMenuState] = useContextMenuContextState();

  return (
    <>
      <button
        onClick={() => setContextMenuState({ rename: selected })}
        className="text-white hover:bg-gray-700 px-3 py-1"
      >
        名前を変更
      </button>
    </>
  );
};

export default RenameButton;
