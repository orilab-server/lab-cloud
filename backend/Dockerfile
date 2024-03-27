FROM golang:1.19

RUN mkdir /backend

# コンテナ作業ディレクトリの変更
WORKDIR /backend

# ホストOSの ./go の中身を作業ディレクトリに追加
COPY . .

RUN go install