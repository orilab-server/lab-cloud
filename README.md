# 研究室クラウド

現在のバージョン : `v 1.2`

研究室のファイルサーバがソフト入れていちいち ssh とか sftp とか使わないといけなくて
めんどくさいということで, もっと手軽に扱いたいという要望からブラウザで触れる様にしました。

Google Drive をちょっと参考にしています。

搭載機能は以下の通りです。

- 認証
- ファイル・フォルダのアップロード(ドラッグ&ドロップ可能)
- ファイル・フォルダのダウンロード
- フォルダの作成
- 基本的な種類(pdf, png とか)のファイルの閲覧
- リンクコピー&共有
- ファイル名変更
- ゴミ箱機能
- 名前・パスワード変更
- ファイルレビュー機能
- 研究室 HP の CMS

今後機能追加予定

# 使用技術

フロントエンドを`Next.js`, バックエンドを`Gin(Golang)`で開発しました。

詳細を以下に列挙します。

## フロントエンド

- Next.js
- React
- Material UI, Icons
- Recoil
- React Router, React Router DOM
- React Query
- axios
- React Icons
- React-Pdf
- その他

## バックエンド

- Golang
- Gin
- sessions
- bcrypt
- godotenv
- google/uuid
- sqlboiler
- その他

# 環境変数

## フロントエンド

```env
NEXT_PUBLIC_CLIENT_URL=
NEXT_PUBLIC_SERVER_URL=
``
```
