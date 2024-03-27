create-migration:
	migrate create -ext sql -dir ./db/migrations -seq ${TABLE_NAME}

migrate-up:
	migrate -database "postgres://postgres:postgres@db:5432/lab_cloud?sslmode=disable" -path /backend/db/migrations up

migrate-down:
	migrate -database "postgres://postgres:postgres@db:5432/lab_cloud?sslmode=disable" -path /backend/db/migrations down \
	&& rm -rf /path

generate-model:
	sqlboiler psql --config ./config/sqlboiler.toml --output ./db/models --pkgname models --wipe

seed:
	cd db/seeds && go run main.go dirs.go files.go users.go && cd ../../ \
	&& mkdir -p /path/to/dir1/dir4 /path/to/dir1/dir5 /path/to/dir2 /path/to/dir3/dir6 \
	&& touch /path/to/dir1/file1.txt /path/to/dir1/file2.jpg /path/to/dir3/file3.txt