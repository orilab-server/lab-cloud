import { AiOutlinePlus } from 'react-icons/ai';
import { RiDeleteBin2Fill } from 'react-icons/ri';

type LinksInput = {
  links: {
    [key: string]: string;
  };
  setLinks: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string;
    }>
  >;
  edit?: boolean;
};

export const LinksInput = ({ links, setLinks, edit = true }: LinksInput) => {
  const handleChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks({ ...links, [name]: value });
  };

  const onAddLink = () =>
    setLinks((olds) => {
      const keys = Object.keys(olds);
      const lastKey = keys.sort((pre, cur) => (pre > cur ? 1 : -1)).at(-1);
      if (olds[lastKey as string] === '') {
        return olds;
      }
      return { ...olds, [`link-${keys.length}`]: '' };
    });

  return (
    <div className="w-full">
      <label className="w-full label bg-gray-200 text-gray-900 my-1 rounded text-sm">
        関連リンク
      </label>
      <div className="flex flex-col space-y-3 w-full">
        {Object.entries(links).map(([key, val], index) => (
          <div key={key} className="flex items-center space-x-1">
            {edit ? (
              <>
                <input
                  className="input input-bordered w-full"
                  name={key}
                  value={val}
                  onChange={handleChangeLink}
                />
                {index > 0 && index === Object.keys(links).length - 1 && (
                  <button
                    onClick={() =>
                      setLinks((olds) => {
                        const filteredLinks = Object.entries(olds).filter((old) => old[0] !== key);
                        return Object.fromEntries(filteredLinks);
                      })
                    }
                  >
                    <RiDeleteBin2Fill className="hover:text-neutral hover:scale-105" size={25} />
                  </button>
                )}
              </>
            ) : (
              <a href={val} target="_blank" className="text-sm underline text-blue-500">
                {val}
              </a>
            )}
          </div>
        ))}
        {edit && (
          <button type="button" className="btn btn-outline w-full" onClick={onAddLink}>
            <AiOutlinePlus className="mr-3" />
            リンクを追加
          </button>
        )}
      </div>
    </div>
  );
};
