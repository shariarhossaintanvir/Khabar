import os
import subprocess
import time
import urllib.request

SCREENSHOT_DIR = os.path.join(os.getcwd(), 'screenshots')
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Start HTTP server serving dist on port 4173
server_proc = subprocess.Popen(
    ["python", "-m", "http.server", "4173", "-d", "dist"],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

try:
    # Wait for server to start
    time.sleep(2)

    targets = [
        ("screenshot_home.png", "http://localhost:4173/?view=home", "1280,800"),
        ("screenshot_restaurants.png", "http://localhost:4173/?view=restaurants", "1280,800"),
        ("screenshot_detail.png", "http://localhost:4173/?view=restaurant-detail", "1280,800"),
        ("screenshot_checkout.png", "http://localhost:4173/?view=checkout", "1280,800"),
        ("screenshot_tracking.png", "http://localhost:4173/?view=tracking", "1280,800"),
        ("screenshot_admin.png", "http://localhost:4173/?mode=admin&view=admin", "1280,800"),
        ("screenshot_partner.png", "http://localhost:4173/?mode=partner&view=partner", "1280,800"),
        ("screenshot_rider.png", "http://localhost:4173/?mode=rider&view=rider", "1280,800"),
        ("screenshot_mobile_home.png", "http://localhost:4173/?view=home", "390,844"),
    ]

    for filename, url, win_size in targets:
        out_path = os.path.join(SCREENSHOT_DIR, filename)
        cmd = [
            EDGE_PATH,
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--window-size={win_size}",
            f"--screenshot={out_path}",
            url
        ]
        print(f"Capturing {filename} from {url} ({win_size})...")
        subprocess.run(cmd, timeout=20)
        time.sleep(1)

    print("All screenshots captured successfully!")

finally:
    server_proc.terminate()
