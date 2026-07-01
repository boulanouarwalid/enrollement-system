@echo off
title enrollment-system Launcher
cd /d "%~dp0"

echo ^=== Starting Eureka Server ^(port 8761^) ===
start "eureka-server" cmd /c ".\mvnw.cmd spring-boot:run -pl eureka-server"

echo Waiting for Eureka to start...
:waitloop
timeout /t 3 /nobreak >nul
curl -s http://localhost:8761/eureka/apps >nul 2>&1
if errorlevel 1 goto waitloop

echo Eureka is ready!

echo.
echo ^=== Starting remaining services ===
start "student-service" cmd /c ".\mvnw.cmd spring-boot:run -pl student-service"
start "course-service" cmd /c ".\mvnw.cmd spring-boot:run -pl course-service"
start "enrollement-service" cmd /c ".\mvnw.cmd spring-boot:run -pl enrollement-service"
start "gateway-service" cmd /c ".\mvnw.cmd spring-boot:run -pl gateway-service"

echo.
echo All services launched in separate windows!
echo Gateway: http://localhost:8080
echo Eureka:  http://localhost:8761
echo Close each window to stop the service.
pause
