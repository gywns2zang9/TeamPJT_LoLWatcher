# 1. Base image
FROM node:21 AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Define build arguments
ARG REACT_APP_LOLWATCHER_API_URL
ARG REACT_APP_CHAMPION_IMG_BASE_URL
ARG REACT_APP_CHAMPION_SPLASH_IMG_BASE_URL
ARG REACT_APP_SUMMONER_ICON_URL

# 5. Set environment variables for the build
ENV REACT_APP_LOLWATCHER_API_URL=$REACT_APP_LOLWATCHER_API_URL
ENV REACT_APP_CHAMPION_IMG_BASE_URL=$REACT_APP_CHAMPION_IMG_BASE_URL
ENV REACT_APP_CHAMPION_SPLASH_IMG_BASE_URL=$REACT_APP_CHAMPION_SPLASH_IMG_BASE_URL
ENV REACT_APP_SUMMONER_ICON_URL=$REACT_APP_SUMMONER_ICON_URL

# 6. Copy source code and build
COPY . .
RUN npm run build

# 7. Deploying with a lightweight web server
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# 8. Expose port 80
EXPOSE 80