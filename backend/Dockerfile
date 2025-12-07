# Stage 1: Build
FROM golang:1.25.4-alpine AS builder
WORKDIR /app

# Install build tools jika perlu
RUN apk add --no-cache git bash

# Copy go.mod & go.sum dan download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy seluruh project
COPY . .

# Build aplikasi dari main.go di cmd/server
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o financial-health-backend ./cmd/server

# Stage 2: Run
FROM alpine:3.18
WORKDIR /root/

# Copy hasil build dari stage 1
COPY --from=builder /app/financial-health-backend .

EXPOSE 8080
CMD ["./financial-health-backend"]
