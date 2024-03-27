import { FileNode } from '@/app/(authorized)/home/_types/storage';
import { User } from '@/app/_types/user';
import DLButton from './Items/DLButton';
import DumpButton from './Items/DumpButton';
import RenameButton from './Items/RenameButton';

type ContextMenuProps = {
  selected: Set<string>;
  fileNodes: FileNode[];
  user: User;
};

const ContextMenu = ({ selected, fileNodes, user }: ContextMenuProps) => {
  return (
    <div className={`absolute top-3 right-[50vw] bg-gray-800 rounded z-10 text-sm`}>
      <div className="mx-auto rounded border border-gray-600 px-3 py-3 grid grid-cols-1 gap-2 whitespace-nowrap">
        <DumpButton selected={selected} fileNodes={fileNodes} user={user} />
        <DLButton selected={selected} fileNodes={fileNodes} />
        {Array.from(selected).length === 1 && <RenameButton selected={Array.from(selected)[0]} />}
      </div>
    </div>
  );
};

export default ContextMenu;
