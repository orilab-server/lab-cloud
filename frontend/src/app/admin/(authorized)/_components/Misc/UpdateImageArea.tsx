'use client';

import React, { ChangeEventHandler, useEffect, useRef } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

type ResearchItemProps = {
  url?: string;
  edit: boolean;
  fileState: [File | null, React.Dispatch<React.SetStateAction<File | null>>];
};

export const UpdateImageArea = ({ url, edit, fileState }: ResearchItemProps) => {
  const [file, setFile] = fileState;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const clickFileUploadButton = () => {
    inputRef.current?.click();
  };
  const newImageUrl = file === null ? '' : URL.createObjectURL(file);

  const onFileInputChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
    } else {
      alert('ファイルを選択してください');
    }
  };

  useEffect(() => {
    return () => {
      if (newImageUrl !== '') {
        URL.revokeObjectURL(newImageUrl);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      <span className="label w-full text-sm bg-gray-200 text-gray-900 rounded my-1">画像</span>
      <div
        className={`relative flex items-center ${
          !edit ? 'justify-start' : url ? 'justify-around' : ''
        }`}
      >
        {url ? (
          <img width="300px" src={url} alt="現在の画像" />
        ) : (
          !edit && (
            <div className="w-[300px] aspect-square bg-gray-400 animate-pulse flex items-center justify-center">
              画像ダウンロード中
            </div>
          )
        )}
        {edit && (
          <>
            {url && (
              <div>
                <AiOutlineArrowRight size={40} />
              </div>
            )}
            <div className="flex flex-col items-center space-y-3">
              <button
                type="button"
                onClick={clickFileUploadButton}
                className="w-[300px] aspect-square border border-gray-800 border-dotted flex justify-center items-center"
              >
                {file ? <img width="300px" src={URL.createObjectURL(file)} alt="" /> : '画像を選択'}
                <input type="file" hidden ref={inputRef} onChange={onFileInputChange} />
              </button>
              {file && (
                <button
                  onClick={() => setFile(null)}
                  type="button"
                  className="btn btn-error btn-sm w-full"
                >
                  削除
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
