import { Box } from '@mui/system';
import AddButton from './side/buttons/AddButton';
import GoReviewButton from './side/buttons/GoReviewButton';
import InquiryButton from './side/buttons/InquiryButton';
import LogoutButton from './side/buttons/LogoutButton';
import TrashBox from './side/buttons/TrashDirButton';
import Profile from './side/Profile';
import TopDirLiat from './side/TopDirLiat';

type SideContentsProps = {
  name?: string;
  topDirs: string[];
  currentDir: string;
  trashDir: string;
  isTrash?: boolean;
  important?: boolean;
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
  trashDir,
  isTrash,
  moveDir,
}: SideContentsProps) => {
  return (
    <Box sx={WrapperBoxStyle}>
      <Box sx={InsideBoxStyle}>
        {/* プロフィール */}
        <Profile name={name} />
        {/* 各種ボタン */}
        <AddButton currentDir={currentDir} isTrash={isTrash} />
        <GoReviewButton />
        <LogoutButton />
        {/* ゴミ箱 */}
        <TrashBox moveTrashDir={() => moveDir(trashDir)} />
        <InquiryButton name={name} />
        {/* トップ階層のディレクトリ遷移リスト */}
        <TopDirLiat topDirs={topDirs} moveDir={moveDir} />
      </Box>
    </Box>
  );
};
