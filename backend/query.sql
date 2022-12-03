-- ユーザテーブル
create table users(id int not null auto_increment, 
  name varchar(50) not null,
  email varchar(254) not null, 
  password varchar(60) not null, 
  is_temporary boolean not null,
  created_at timestamp default current_timestamp not null, 
  updated_at timestamp default current_timestamp on update current_timestamp, 
  primary key ( id )
);

-- 捨てられたファイルの情報を取っておくテーブル
create table files_trash(id varchar(36) not null,
  user_id int not null, 
  type varchar(4) not null, 
  past_location varchar(1024) not null, 
  created_at timestamp default current_timestamp not null, 
  primary key (id), 
  foreign key (user_id) references users(id)
);

-- パスワードリセット機能用のトークンを保存するテーブル
create table reset_tokens(
  id varchar(36) not null,
  email varchar(254) not null, 
  token varchar(254) not null,
  primary key (id)
);