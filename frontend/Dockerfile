# Stage 1: Build Angular
FROM node:20 AS builder
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./
RUN npm install

# Copy seluruh project frontend
COPY . .

# Build Angular production
RUN npm run build --prod

# Stage 2: Serve via Nginx
FROM nginx:alpine
# Copy hasil build Angular ke Nginx html
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Optional: ganti default port Nginx jika 80 sudah dipakai
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
