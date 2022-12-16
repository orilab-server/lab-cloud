-- ユーザテーブル
create table users(id int not null auto_increment, 
  name varchar(50) not null,
  email varchar(254) not null, 
  password varchar(60) not null, 
  grade int not null, -- yyyy形式
  is_temporary boolean not null,
  created_at timestamp default current_timestamp not null, 
  updated_at timestamp default current_timestamp on update current_timestamp, 
  primary key ( id )
);

-- 登録申請を出した人のテーブル
create table register_requests(
  id int not null auto_increment,
  name varchar(50) not null,
  email varchar(254) not null, 
  grade int not null, -- yyyy形式
  created_at timestamp default current_timestamp not null, 
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

-- レビュー用ディレクトリのテーブル
create table reviews(
  id varchar(36) not null,
  name text not null,
  target int not null, -- 2, 3, 4, 5, 6
  created_at timestamp default current_timestamp not null, 
  updated_at timestamp default current_timestamp on update current_timestamp, 
  primary key (id)
);

-- レビュー対象者の情報を保存するテーブル
create table reviewed(
  id varchar(36) not null,
  review_id varchar(36) not null,
  user_id int not null, 
  foreign key (review_id) references reviews(id),
  foreign key (user_id) references users(id),
  primary key (id)
);

-- レビュー対象者がアップロードしたファイルの情報を保存するテーブル
create table reviewed_files(
  id varchar(36) not null,
  reviewed_id varchar(36) not null,
  file_name varchar(254) not null, 
  created_at timestamp default current_timestamp not null, -- アップロード日時として使用
  foreign key (reviewed_id) references reviewed(id),
  primary key (id)
);

-- レビュアーの人々の情報を保存するテーブル
create table reviewers(
  id varchar(36) not null,
  reviewed_file_id varchar(36) not null,
  user_id int not null, 
  foreign key (reviewed_file_id) references reviewed_files(id),
  foreign key (user_id) references users(id),
  primary key (id)
);

-- レビュアーの人々が残したコメントを保存するテーブル
create table review_comments(
  id varchar(36) not null,
  reviewed_file_id varchar(36) not null,
  reviewer_id varchar(36) not null,
  page_number int not null,
  comment text not null,
  created_at timestamp default current_timestamp not null, -- コメントを残した日時
  updated_at timestamp default current_timestamp on update current_timestamp, -- コメントをアップデートした日時
  foreign key (reviewed_file_id) references reviewed_files(id),
  foreign key (reviewer_id) references reviewers(id),
  primary key (id)
);