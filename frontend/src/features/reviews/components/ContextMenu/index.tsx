import DeleteButton from './Items/DeleteButton';

const ContextMenu = () => {
  return (
    <div className={`absolute top-3 right-[50vw] bg-gray-800 rounded z-10 text-sm`}>
      <div className="mx-auto rounded border border-gray-600 px-3 py-3 grid grid-cols-1 gap-2 whitespace-nowrap">
        <DeleteButton />
      </div>
    </div>
  );
};

export default ContextMenu;
