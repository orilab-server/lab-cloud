import { Box } from '@mui/system';
import { UseMutationResult } from 'react-query';
import { SendRequestMutationConfig } from '../api/sendRequest';
import { Uploads } from '../api/upload';
import AddButton from './side/AddButton';
import InquiryButton from './side/InquiryButton';
import LogoutButton from './side/LogoutButton';
import Profile from './side/Profile';
import TopDirLiat from './side/TopDirLiat';

type SideContentsProps = {
  name?: string;
  topDirs: string[];
  currentDir: string;
  uploads: Uploads;
  important?: boolean;
  requestMutation: UseMutationResult<string[], unknown, SendRequestMutationConfig, unknown>;
  moveDir: (path: string) => Promise<void>;
};

const WrapperBoxStyle = {
  flex: 1,
  height: '100%',
};

const InsideBoxStyle = {
  width: 200,
  height: '100%',
  pt: 5,
  pl: 3,
  pr: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const SideContents = ({
  name,
  topDirs,
  currentDir,
  requestMutation,
  uploads,
  moveDir,
}: SideContentsProps) => {
  return (
    <Box sx={WrapperBoxStyle}>
      <Box sx={InsideBoxStyle}>
        {/* プロフィール */}
        <Profile name={name} />
        {/* 各種ボタン */}
        <AddButton currentDir={currentDir} requestMutation={requestMutation} uploads={uploads} />
        <LogoutButton />
        <InquiryButton name={name} />
        {/* トップ階層のディレクトリ遷移リスト */}
        <TopDirLiat topDirs={topDirs} moveDir={moveDir} />
      </Box>
    </Box>
  );
};
