import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import Review_1_Img from '../../../../public/review_1.png';
import Review_2_Img from '../../../../public/review_2.png';
import Review_3_Img from '../../../../public/review_3.png';
import Review_4_Img from '../../../../public/review_4.png';
import Review_5_Img from '../../../../public/review_5.png';
import Review_6_Img from '../../../../public/review_6.png';
import Review_7_Img from '../../../../public/review_7.png';
import Review_8_Img from '../../../../public/review_8.png';
import Review_9_Img from '../../../../public/review_9.png';

type ReviewDescriptionProps = {
  hide: () => void;
};

const ReviewImg = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} className="w-full py-8" alt={alt} />
);

const ReviewDescription = ({ hide }: ReviewDescriptionProps) => {
  const [tab, setTab] = useState<0 | 1>(0);

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
          <div className="flex pb-4 text-blue-600 w-full border-b border-t-0 border-r-0 border-l-0 border-solid border-b-slate-300">
            <div
              onClick={() => setTab(0)}
              className={`mr-2 py-2 px-3 cursor-pointer rounded-full ${
                tab === 0 ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
              }`}
            >
              一般的なレビュー
            </div>
            <div
              onClick={() => setTab(1)}
              className={`mr-2 py-2 px-3 cursor-pointer rounded-full ${
                tab === 1 ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
              }`}
            >
              先生にレビューを依頼する
            </div>
          </div>
          <div className="my-1 text-lg text-sky-500 pt-4">
            ・<span className="underline">レビューを受ける側の操作</span>
          </div>
          {flows_reviewed[tab].map((flow, i) => {
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
            ・
            <span className="underline">レビューを行う側の操作{tab === 1 && '(先生側の操作)'}</span>
          </div>
          {flows_reviewer[tab].map((flow, i) => {
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

const flows_reviewed = {
  0: [
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
  ],
  1: [
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
          アップロードを行う 先生へのメッセージを記入することも可能
          <br />
          デフォルトでは「ご確認よろしくお願い申し上げます」が送信される
          <br />
          以下の画像のようになり「アップロード」をクリックするとアップロードが開始される
          <br />
          ファイルを変更したい場合はゴミ箱アイコンをクリックして削除を行う
          <br />
          アップロードされると折田研究室のグループLINEに通知され,
          折田先生にファイルが添付されたメールが送信される(Ccで自分にも送信される)
          <div className="text-sm underline text-red-500 my-2">
            ※アップロード可能なファイル形式はdocxのみ(Wordファイル)
          </div>
          <ReviewImg src={Review_8_Img.src} alt="review_8" />
        </>
      ),
    },
  ],
};

const flows_reviewer = {
  0: [
    {
      title: 'レビュー対象者のエリアに移動',
      description: (
        <>
          レビュー画面トップから対象者のいるディレクトリを選択し, 対象者を選択
          <br />
          (例) B4の竹内のレビューを行う時は画像上の「卒論_2022_学士4年」をクリックし,
          竹内の名前をクリックする
          <ReviewImg src={Review_3_Img.src} alt="review_3" />
        </>
      ),
    },
    {
      title: 'レビューするファイルを選択',
      description: (
        <>
          対象者のエリアに遷移したらレビュー対象ファイルを選択
          一般的には最新のファイルをレビューすることが想定されるため「最新」という表示があるものをクリック
          <ReviewImg src={Review_4_Img.src} alt="review_4" />
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
  ],
  1: [
    {
      title: 'メールボックスを確認 or ページからダウンロード',
      description: (
        <>
          生徒がアップロードしたファイルが添付されたメールが送信されるので,
          メールボックスを確認します
          <br /> メールサーバーの不具合などでメールが届いていない場合は,
          該当生徒のページを開いて右クリックでダウンロードボタンが表示されるのでそちらからダウンロードできます
          <ReviewImg src={Review_9_Img.src} alt="review_9" />
        </>
      ),
    },
    {
      title: 'レビュー後, 生徒へのフィードバック',
      description: (
        <>
          現状ではクラウドを介してフィードバックを生徒に送ることができないため,
          先生の方から直接メール又はLINEなどでコメントを記述したファイルを送って頂く流れになるかと思います
        </>
      ),
    },
  ],
};
