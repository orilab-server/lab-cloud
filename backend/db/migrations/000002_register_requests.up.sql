create table register_requests(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(50) not null,
  email varchar(254) not null,
  grade int not null, -- yyyy形式
  created_at timestamp default current_timestamp not null, 
  primary key ( id )
);