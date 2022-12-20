import { IconButton } from '@mui/material';
import React from 'react';
import { MdOutlineClose } from 'react-icons/md';
import Review_1_Img from '../../../../public/review_1.png';
import Review_2_Img from '../../../../public/review_2.png';
import Review_4_Img from '../../../../public/review_3.png';
import Review_3_Img from '../../../../public/review_4.png';
import Review_5_Img from '../../../../public/review_5.png';
import Review_6_Img from '../../../../public/review_6.png';
import Review_7_Img from '../../../../public/review_7.png';

type ReviewDescriptionProps = {
  hide: () => void;
};

const ReviewImg = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} className="w-full py-8" alt={alt} />
);

const flows_reviewed = [
  {
    title: '自分専用のエリアに移動',
    description: (
      <>
        レビュー画面上の対象の項目を選択する
        <br />
        (例) B4竹内が卒論のレビューをしてもらいたい時は画像上の「卒論_2022_学士4年」をクリックし,
        自分の名前をクリックする
        <ReviewImg src={Review_1_Img.src} alt="review_1" />
      </>
    ),
  },
  {
    title: 'ファイルをアップロード',
    description: (
      <>
        画面上にアップロードエリアがあるので, エリアをクリック or エリアにファイルドロップして
        アップロードを行う
        以下の画像のようになり「アップロード」をクリックするとアップロードが開始される
        <br />
        ファイルを変更したい場合はゴミ箱アイコンをクリックして削除を行う
        アップロードされると折田研究室のグループLINEに通知される
        <ReviewImg src={Review_2_Img.src} alt="review_2" />
      </>
    ),
  },
];

const flows_reviewer = [
  {
    title: 'レビュー対象者のエリアに移動',
    description: (
      <>
        レビュー画面トップから対象者のいるディレクトリを選択し, 対象者を選択
        <br />
        (例) B4の竹内のレビューを行う時は画像上の「卒論_2022_学士4年」をクリックし,
        竹内の名前をクリックする
        <ReviewImg src={Review_4_Img.src} alt="review_4" />
      </>
    ),
  },
  {
    title: 'レビューするファイルを選択',
    description: (
      <>
        対象者のエリアに遷移したらレビュー対象ファイルを選択
        一般的には最新のファイルをレビューすることが想定されるため「最新」という表示があるものをクリック
        <ReviewImg src={Review_3_Img.src} alt="review_3" />
      </>
    ),
  },
  {
    title: '各ページに対応するコメントを記入',
    description: (
      <>
        画面上には, 自分含めレビューを行った人の名前のボタンと,
        レビューを通知ボタンが画面の一番上と下に配置されている
        <br />
        レビューを行う場合は「レビューする」ボタンによりレビューを開始することができる
        <ReviewImg src={Review_5_Img.src} alt="review_5" />
        <br />
        また, 左に
        <span className="underline">ファイルの各ページ</span>と右に
        <span className="underline">ページに対応するコメント記入欄</span>
        があるためそこにコメントの記入を行う
        <br />
        <ReviewImg src={Review_7_Img.src} alt="review_7" />
        「途中から」ボタンは前回までの保存されたコメントから始めることができ,
        これを行わずコメントを記入した場合は前回の保存内容は消えてしまうため注意
      </>
    ),
  },
  {
    title: 'コメントを通知する',
    description: (
      <>
        各ページにコメントを記入し終えたら 「レビューを通知」をクリックする
        <br />
        <ReviewImg src={Review_6_Img.src} alt="review_6" />
        これにより対象者にコメント内容が記載されたメールが送信される
      </>
    ),
  },
];

const ReviewDescription = ({ hide }: ReviewDescriptionProps) => {
  return (
    <div className="z-[1000] bg-slate-50 w-full absolute top-0 left-0 py-5">
      <div className="absolute top-0 right-0 z-[1001]">
        <IconButton onClick={hide}>
          <MdOutlineClose size={30} />
        </IconButton>
      </div>
      <div className="w-[85vw] mx-auto">
        <div className="text-xl my-3 font-bold">レビュー機能とは？</div>
        {/* ざっくり説明 */}
        <div>
          発表会シーズンに先輩や先生に作成したスライドやポスターを見てもらう機会が増えると思いますが,
          従来ではメールでファイルを送ったり印刷して見てもらう方法が一般的でした。
          <br /> しかし, その方法にはメールに添付したファイルのダウンロードや, 開封, レビュー,
          再送などの様々な負担があります。
          <br />
          レビュー機能ではスライドやポスターを作成した学生がファイルをアップロードするだけで,
          レビューを行う先輩や先生はアップロードしたファイルをブラウザ上で開いて,
          ブラウザ上でコメントをすることができます。
          <br /> また, <span className="underline">アップロード時にはグループLINEに通知</span>され,
          コメントを通知すると<span className="underline">対象者にコメント内容のメールが送信</span>
          されるようになっており, やりとりがより簡便になります。
        </div>
        {/* 使用方法 */}
        <div className="flex flex-col my-8">
          <div className="my-1 text-lg text-sky-500">
            ・<span className="underline">レビューを受ける側の操作</span>
          </div>
          {flows_reviewed.map((flow, i) => {
            return (
              <div key={flow.title} className="flex flex-col">
                <div className="flex items-center my-3">
                  <div className="mx-1 w-6 h-6 leading-6 rounded-full bg-slate-600 text-center text-white">
                    {i + 1}
                  </div>
                  <div className="mx-1">{flow.title}</div>
                </div>
                <div className="flex w-5/6">
                  <div className="mx-4"></div>
                  <div className="mx-4">{flow.description}</div>
                </div>
              </div>
            );
          })}
          <div className="my-1 text-lg text-sky-500">
            ・<span className="underline">レビューを行う側の操作</span>
          </div>
          {flows_reviewer.map((flow, i) => {
            return (
              <div key={flow.title} className="flex flex-col">
                <div className="flex items-center my-3">
                  <div className="mx-1 w-6 h-6 leading-6 rounded-full bg-slate-600 text-center text-white">
                    {i + 1}
                  </div>
                  <div className="mx-1">{flow.title}</div>
                </div>
                <div className="flex w-5/6">
                  <div className="mx-4"></div>
                  <div className="mx-4">{flow.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReviewDescription);
