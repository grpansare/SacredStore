# --- Build Stage ---
FROM maven:3.8.2-jdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# --- Package Stage ---
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# The command below activates the 'prod' profile
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
