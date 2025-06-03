import requests

PB_URL = "http://localhost:8090"

def fetch_config():
    res = requests.get(f"{PB_URL}/api/collections/config/records")
    return res.json()["items"][0]

def fetch_secrets():
    res = requests.get(f"{PB_URL}/api/collections/secrets/records")
    return res.json()["items"][0]

# Usage
config = fetch_config()
secrets = fetch_secrets()

print("✅ Loaded config + secrets:", config, secrets)
