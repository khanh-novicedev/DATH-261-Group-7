# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /backend
COPY pom.xml /backend/
RUN mvn dependency:go-offline
COPY src /backend/src/
RUN mvn package -DskipTests
# Stage 2: Create the final image
FROM eclipse-temurin:21-jre
WORKDIR /backend
COPY --from=build /backend/target/*.jar /backend/app.jar
ENTRYPOINT ["java", "-jar", "/backend/app.jar"]
EXPOSE 8080
