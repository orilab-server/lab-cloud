import {
  AiFillFileImage,
  AiFillFileText,
  AiFillFile,
  AiFillFilePdf,
} from "react-icons/ai";

type FileIconsProps = {
  fileName: string;
};

export const FileIcons = ({ fileName }: FileIconsProps) => {
  const fileType = fileName.slice(fileName.lastIndexOf(".") + 1);
  // exceptions
  const isHidden = fileName[0] === ".";
  const hasNoFileType = fileName.match(".") === null;
  const isLinkingDot =
    Array.from(fileName).filter((item) => item === ".").length > 2;
  const isExpeptionFile = isHidden || hasNoFileType || isLinkingDot;

  switch (fileType) {
    case "png":
    case "jpeg":
    case "jpg": {
      return <AiFillFileImage size={25} />;
    }
    case "pdf": {
      return <AiFillFilePdf size={25} color="red" />;
    }
    default: {
      if (isExpeptionFile) {
        return <AiFillFile size={25} />;
      }
      return <AiFillFileText size={25} />;
    }
  }
};
