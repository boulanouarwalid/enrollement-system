param(
    [switch]$NoGateway,
    [switch]$NoWait
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mvnw = Join-Path $root "mvnw.cmd"

function Start-ServiceInNewWindow($name, $noWait) {
    $title = "enrollment-system - $name"
    $cmd = "`"$mvnw`" spring-boot:run -pl $name"
    if ($noWait) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root`"; $cmd"
    } else {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root`"; Write-Host 'Starting $name ...'; $cmd; Read-Host '`n$name stopped. Press Enter'"
    }
}

Write-Host "=== Starting Eureka Server (port 8761) ===" -ForegroundColor Cyan
Start-ServiceInNewWindow "eureka-server" $true

if (-not $NoWait) {
    Write-Host "Waiting for Eureka to start..." -ForegroundColor Yellow
    $ready = $false
    $maxAttempts = 30
    for ($i = 1; $i -le $maxAttempts; $i++) {
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:8761/eureka/apps" -Method GET -TimeoutSec 2 -ErrorAction Stop
            if ($r.StatusCode -eq 200) {
                $ready = $true
                Write-Host "Eureka is ready!" -ForegroundColor Green
                break
            }
        } catch { }
        Write-Host "  Waiting... attempt $i/$maxAttempts" -ForegroundColor DarkYellow
        Start-Sleep -Seconds 3
    }
    if (-not $ready) {
        Write-Host "Warning: Eureka may not be fully ready. Proceeding anyway." -ForegroundColor Red
    }
}

Write-Host "`n=== Starting remaining services ===" -ForegroundColor Cyan
Start-ServiceInNewWindow "student-service" $true
Start-ServiceInNewWindow "course-service" $true
Start-ServiceInNewWindow "enrollement-service" $true

if (-not $NoGateway) {
    Start-ServiceInNewWindow "gateway-service" $true
}

Write-Host "`nAll services launched in separate windows!" -ForegroundColor Green
Write-Host "Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Eureka Dashboard: http://localhost:8761" -ForegroundColor Cyan
Write-Host "`nClose each service window to stop it." -ForegroundColor Gray
