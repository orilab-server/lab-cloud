create table users(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text not null,
  email text not null,
  password text not null,
  grade int not null, -- yyyy形式
  is_temporary boolean not null,
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp,
  primary key (id)
);