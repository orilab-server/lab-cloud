create table dirs(
  id uuid not null default gen_random_uuid(),
  parent_id uuid,
  user_id uuid not null,
  location text not null,
  name text not null,
  created_at timestamp default current_timestamp not null,
  updated_at timestamp default current_timestamp,
  foreign key (user_id) references users(id),
  primary key (id)
);