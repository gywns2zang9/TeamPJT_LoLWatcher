# 1. Base image
FROM node:21 AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy source code and build
COPY . .
RUN npm run build

# 5. Deploying with a lightweight web server
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# 6. Expose port 80
EXPOSE 80
