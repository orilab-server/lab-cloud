# 研究室クラウド

研究室のファイルサーバがソフト入れていちいち ssh とか sftp とか使わないといけなくて
めんどくさいということで, もっと手軽に扱いたいという要望からブラウザで触れる様にしました。

Google Drive をちょっと参考にしています。

搭載機能は以下の通りです。

- 認証
- ファイル・フォルダのアップロード
- ファイル・フォルダのダウンロード
- フォルダの作成
- 基本的な種類(pdf, png とか)のファイルの閲覧
- リンクコピー&共有

Google Drive に比べると少ないので今後余裕があったら増やします。

# 使用技術

フロントエンドを`React`, バックエンドを`Gin(Golang)`で開発しました。

詳細を以下に列挙します。

## フロントエンド

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
- その他
