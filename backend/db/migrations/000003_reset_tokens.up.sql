create table reset_tokens(
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text not null,
  token varchar(254) not null,
  primary key (id)
);