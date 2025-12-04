BINARY_NAME=financial-health
MAIN_PATH=./cmd/server/main.go
BUILD_DIR=./bin

# Default target
all: clean fmt lint test build

# Install dependencies
install-deps:
	go mod download
	go mod tidy
	
# Run the application
run:
	go run $(MAIN_PATH)

# Build the application
build:
	mkdir -p $(BUILD_DIR)
	go build -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PATH)