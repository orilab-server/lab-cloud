import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

type DirpathNavigationProps = {
  important?: boolean;
  dirs: string[];
  baseDir: string;
  relativePath: string;
  moveDir: (path: string) => Promise<void>;
};

const DirpathNavigation = ({
  important,
  dirs,
  baseDir,
  relativePath,
  moveDir,
}: DirpathNavigationProps) => {
  return (
    <Box py={2}>
      現在のパス :{' '}
      <Typography component="span" sx={{ color: 'rgba(0,0,0,0.5)' }}>
        /{' '}
        <Typography
          component="span"
          onClick={() => moveDir(baseDir)}
          sx={{
            color: 'royalblue',
            borderBottom: '1px solid royalblue',
            cursor: 'pointer',
            '&:hover': {
              color: 'rgba(0,0,0,0.3)',
            },
          }}
        >
          *Share
        </Typography>{' '}
        /{' '}
      </Typography>
      {dirs
        .filter((path) => path !== '')
        .map((dir, index) => {
          let targetPath = '/';
          if (relativePath.match(dir)) {
            targetPath = dirs.slice(0, dirs.indexOf(dir) + 1).join('/');
          }
          return (
            <React.Fragment key={dir + index}>
              <Typography
                component="span"
                onClick={() => moveDir(baseDir + targetPath)}
                sx={{
                  color: 'royalblue',
                  borderBottom: '1px solid royalblue',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'rgba(0,0,0,0.3)',
                  },
                }}
              >
                {important && '*'}
                {dir}
              </Typography>
              <Typography component="span" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                /{' '}
              </Typography>
            </React.Fragment>
          );
        })}
    </Box>
  );
};

export default React.memo(DirpathNavigation);
