# 1단계: 빌드 단계
FROM gradle:7.6.0-jdk17 AS build

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 캐시 활용을 위해 Gradle 설정 파일 복사
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# 종속성 다운로드 (소스 없이 종속성만 다운로드하여 캐시 활용)
RUN gradle build -x test --no-daemon || return 0

# 프로젝트 소스 복사 및 빌드
COPY . .
RUN gradle clean build -x test --no-daemon

# 2단계: 실행 단계
FROM eclipse-temurin:17-jre

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 단계에서 생성된 JAR 파일을 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 포트 설정 (Spring Boot 기본 포트)
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]