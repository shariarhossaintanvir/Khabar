# PowerShell script to capture real screenshots from running KHABAR production build
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Resturent website\screenshots"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

Write-Host "Starting Python HTTP Server on port 4173..."
$serverJob = Start-Process -FilePath "python" -ArgumentList @("-m", "http.server", "4173", "-d", "dist") -PassThru -NoNewWindow
Start-Sleep -Seconds 2

$targets = @(
    @{ Name="screenshot_home.png"; Url="http://localhost:4173/?view=home"; Size="1280,800" },
    @{ Name="screenshot_restaurants.png"; Url="http://localhost:4173/?view=restaurants"; Size="1280,800" },
    @{ Name="screenshot_detail.png"; Url="http://localhost:4173/?view=restaurant-detail"; Size="1280,800" },
    @{ Name="screenshot_checkout.png"; Url="http://localhost:4173/?view=checkout"; Size="1280,800" },
    @{ Name="screenshot_tracking.png"; Url="http://localhost:4173/?view=tracking"; Size="1280,800" },
    @{ Name="screenshot_admin.png"; Url="http://localhost:4173/?mode=admin&view=admin"; Size="1280,800" },
    @{ Name="screenshot_partner.png"; Url="http://localhost:4173/?mode=partner&view=partner"; Size="1280,800" },
    @{ Name="screenshot_rider.png"; Url="http://localhost:4173/?mode=rider&view=rider"; Size="1280,800" },
    @{ Name="screenshot_mobile_home.png"; Url="http://localhost:4173/?view=home"; Size="390,844" }
)

try {
    foreach ($item in $targets) {
        $outFile = Join-Path $outDir $item.Name
        Write-Host "Capturing $($item.Name) from $($item.Url)..."
        $args = @(
            "--headless=new",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-gpu",
            "--hide-scrollbars",
            "--window-size=$($item.Size)",
            "--virtual-time-budget=2500",
            "--screenshot=`"$outFile`"",
            $item.Url
        )
        Start-Process -FilePath $edgePath -ArgumentList $args -Wait -NoNewWindow
        Start-Sleep -Milliseconds 500
    }
    Write-Host "All screenshots captured successfully!"
}
finally {
    Write-Host "Stopping HTTP server..."
    Stop-Process -Id $serverJob.Id -Force -ErrorAction SilentlyContinue
}
