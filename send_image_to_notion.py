import requests
from notion_client import Client

PB_URL = "http://localhost:8090"

def fetch_secrets():
    res = requests.get(f"{PB_URL}/api/collections/secrets/records")
    return res.json()["items"][0]

def upload_to_imgbb(path, api_key):
    with open(path, 'rb') as f:
        res = requests.post(
            "https://api.imgbb.com/1/upload",
            data={"key": api_key},
            files={"image": f}
        )

        try:
            data = res.json()
        except Exception:
            raise Exception("❌ imgbb returned non-JSON: " + res.text)

        if res.ok and data.get("data"):
            print("✅ Imgbb Upload:", data["data"]["url"])
            return data["data"]["url"]
        else:
            raise Exception("❌ imgbb upload failed: " + str(data))

def send_image_to_notion(image_path):
    secrets = fetch_secrets()
    image_url = upload_to_imgbb(image_path, secrets["IMGBB_KEY"])

    notion = Client(auth=secrets["NOTION_API_SECRET"])
    page_id = secrets["NOTION_PAGE_ID"]

    notion.blocks.children.append(
        block_id=page_id,
        children=[{
            "object": "block",
            "type": "image",
            "image": {
                "type": "external",
                "external": {
                    "url": image_url
                }
            }
        }]
    )
    print("✅ Image block added to Notion")

# Optional call:
# send_image_to_notion("path/to/image.png")
