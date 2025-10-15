.PHONY: all

include .env
export $(shell sed 's/=.*//' .env)

# Start the database
db-up:
	docker compose up -d --build

db-seed:
	pnpm install
	pnpm db:migrate
	pnpm db:seed

# Stop the database
db-down:
	docker compose down

# Stop and remove all containers and volumes (this will delete all data)
db-clean:
	docker compose down -v
	docker rm -f saas-starter-postgres 2>/dev/null || true
	docker volume rm -f saas-starter-postgres-data 2>/dev/null || true
	docker network rm saas-starter-network 2>/dev/null || true

# View database logs
db-logs:
	docker compose logs -f

# Check status of database containers
db-status:
	docker compose ps

# Show database connection information
db-info:
	@echo "PostgreSQL:"
	@echo "  Host: localhost"
	@echo "  Port: 5433"
	@echo "  Database: $(POSTGRES_DB)"
	@echo "  Username: postgres"
	@echo "  Password: postgres"

# start local copy
run-dev: db-up db-seed
	pnpm dev