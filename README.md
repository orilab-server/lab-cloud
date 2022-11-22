# 研究室クラウド

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
- その他

## バックエンド

- Golang
- Gin
- sessions
- bcrypt
- godotenv
- google/uuid
- その他

# 環境変数

## フロントエンド

```env
NEXT_PUBLIC_CLIENT_URL=
NEXT_PUBLIC_SERVER_URL=
```

## バックエンド

```env
SERVER_IP=
SERVER_PORT=
SHARE_DIR=

SITE_URL=

IMPORTANT_DIRS=

TRASH_DIR_PATH=

MAIL_FROM=
MAIL_TO=
MAIL_PASSWORD=
SMTP_SERVER=
SMTP_PORT=

DB_IP=
DB_PORT=
USER_NAME=
DB_PASS=
DB_NAME=

SESSION_KEY=

SECRET=

SIGNUP_ROUTE=
```
