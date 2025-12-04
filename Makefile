# Development commands
install: 
	@echo "$(GREEN)Installing backend dependencies...$(RESET)"
	cd backend && go mod download && go mod tidy

dev: 
	@echo "$(GREEN)Starting development servers...$(RESET)"
	@echo "$(YELLOW)Backend will start on http://localhost:8080$(RESET)"
	@echo "$(YELLOW)Press Ctrl+C to stop all servers$(RESET)"
	@echo ""
	@trap 'kill %1 %2 2>/dev/null; exit' INT; \
	cd backend && make run & \
	wait	

# Individual service commands
backend: 
	@echo "$(GREEN)Starting backend server...$(RESET)"
	cd backend && make run