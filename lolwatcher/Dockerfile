# 1단계: Build Stage
FROM node:18 AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# npm을 사용하여 종속성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# TypeScript로 빌드 (React 앱 빌드)
RUN npm run build

# 2단계: Serve Stage (정적 파일 서버 사용)
FROM node:18-alpine

# 빌드된 파일 복사
COPY --from=build /app/build /app/build

# 정적 파일 서버 설치 (http-server)
RUN npm install -g http-server

# 포트 설정
EXPOSE 3000

# 정적 파일 서버 시작
CMD ["http-server", "/app/build", "-p", "3000"]
