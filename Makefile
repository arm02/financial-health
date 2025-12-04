# Colors
GREEN=\033[0;32m
YELLOW=\033[1;33m
RESET=\033[0m

# Development commands
install:
	@echo "$(GREEN)Installing backend dependencies...$(RESET)"
	cd backend && go mod download && go mod tidy

	@echo "$(GREEN)Installing frontend dependencies...$(RESET)"
	cd frontend && npm install

dev:
	@echo "$(GREEN)Starting development servers...$(RESET)"
	@echo "$(YELLOW)Backend → http://localhost:8080$(RESET)"
	@echo "$(YELLOW)Frontend → http://localhost:4200$(RESET)"
	@echo ""
	@trap 'echo "Stopping servers..."; kill 0' INT; \
	( cd backend && make run ) & \
	( cd frontend && make run ) & \
	wait
# Individual service commands
backend: 
	@echo "$(GREEN)Starting backend server...$(RESET)"
	cd backend && make run

frontend: 
	@echo "$(GREEN)Starting backend server...$(RESET)"
	cd frontend && make run