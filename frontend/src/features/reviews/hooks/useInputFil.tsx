import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const useInputFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
    const file = acceptedFiles[0];
    // アップロード可能ファイルは
    // PDF, Word(docx), Power Point(pptx)
    const extension = file.name.match(/\.([^.]+)$/);
    if (!extension || (extension && !['pdf', 'docx', 'pptx'].includes(extension[1]))) {
      alert('アップロード可能なファイル形式は\nPDF(.pdf), Word(.docx), PowerPoint(.pptx)\nです');
      return;
    }
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noDrag: true });

  const delFile = () => setFile(null);

  return { getRootProps, getInputProps, file, delFile };
};
