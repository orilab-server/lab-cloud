import { Button, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
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
    <Stack direction="row" sx={{ width: '100%' }}>
      <Typography sx={{ mx: 2, fontSize: 20 }}>関連リンク</Typography>
      <Stack spacing={1} sx={{ width: '80%' }}>
        {Object.entries(links).map(([key, val], index) => (
          <Stack key={key} direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
            {edit ? (
              <>
                <TextField
                  sx={{ width: '90%' }}
                  name={key}
                  value={val}
                  onChange={handleChangeLink}
                />
                {index > 0 && index === Object.keys(links).length - 1 && (
                  <RiDeleteBin2Fill
                    onClick={() =>
                      setLinks((olds) => {
                        const filteredLinks = Object.entries(olds).filter((old) => old[0] !== key);
                        return Object.fromEntries(filteredLinks);
                      })
                    }
                    size={30}
                  />
                )}
              </>
            ) : (
              <Typography>{val}</Typography>
            )}
          </Stack>
        ))}
        {edit && (
          <Button variant="outlined" onClick={onAddLink}>
            <AiOutlinePlus style={{ marginRight: 3 }} />
            リンクを追加
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
