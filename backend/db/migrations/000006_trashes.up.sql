create table trashes (
    id uuid not null default gen_random_uuid(),
    dir_id uuid,
    file_id uuid,
    is_delete bool default false not null,
    created_at timestamp default current_timestamp not null,
    foreign key (dir_id) references dirs(id),
    foreign key (file_id) references files(id),
    primary key (id)
);