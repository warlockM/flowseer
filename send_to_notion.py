import requests
from notion_client import Client
from config_loader import fetch_secrets

def post_flow_summary_to_notion(summary_text):
    try:
        secrets = fetch_secrets()

        if not isinstance(secrets, dict):
            raise ValueError("❌ fetch_secrets() did not return a valid dictionary.")

        NOTION_TOKEN = secrets.get("NOTION_API_SECRET")
        NOTION_PAGE_ID = secrets.get("NOTION_PAGE_ID")

        if not NOTION_TOKEN or not NOTION_PAGE_ID:
            raise ValueError("❌ Missing NOTION_API_SECRET or NOTION_PAGE_ID in PocketBase secrets.")

        NOTION = Client(auth=NOTION_TOKEN)

        print("📝 Pushing flow summary to Notion...")

        NOTION.blocks.children.append(
            block_id=NOTION_PAGE_ID,
            children=[
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {
                                    "content": summary_text[:2000]  # Notion text limit
                                }
                            }
                        ]
                    }
                }
            ]
        )

        print("✅ Summary successfully added to Notion.")

    except Exception as e:
        print("❌ Error sending summary to Notion:", e)
