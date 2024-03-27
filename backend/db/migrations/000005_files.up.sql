create table files(
    id uuid not null default gen_random_uuid(),
    user_id uuid not null,
    dir_id uuid not null,
    location text not null,
    name text not null,
    size bigint not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp,
    foreign key (dir_id) references dirs(id),
    foreign key (user_id) references users(id),
    primary key (id)
);