.PHONY: all

include .env
export $(shell sed 's/=.*//' .env)

# Start the database
db-up:
	docker compose up -d --build

# Check if database exists and create if it doesn't
db-ensure:
	@echo "Checking if database '$(POSTGRES_DB)' exists..."
	@docker exec saas-starter-postgres psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='$(POSTGRES_DB)';" | grep -q 1 || \
	(echo "Database '$(POSTGRES_DB)' does not exist. Creating it..." && \
	docker exec saas-starter-postgres psql -U postgres -c "CREATE DATABASE $(POSTGRES_DB);" && \
	echo "Database '$(POSTGRES_DB)' created successfully.")

# Wait for database to be ready
db-wait:
	@echo "Waiting for database to be ready..."
	@until docker exec saas-starter-postgres pg_isready -U postgres; do \
		echo "Waiting for PostgreSQL..."; \
		sleep 2; \
	done
	@echo "Database is ready!"

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
run-dev: db-up db-wait db-ensure db-seed
	pnpm dev