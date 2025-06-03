import requests
from collections import Counter, defaultdict
from send_to_notion import post_flow_summary_to_notion
import matplotlib.pyplot as plt
from send_image_to_notion import send_image_to_notion
from config_loader import fetch_config


POCKETBASE_API = "http://localhost:8090/api/collections/events/records"
config = fetch_config()
CONVERSION_URLS = config.get("CONVERSION_URLS", "").split(",")
CONVERSION_EVENT_TYPES = config.get("CONVERSION_EVENT_TYPES", "").split(",")
CONVERSION_CLICK_LABELS = config.get("CONVERSION_CLICK_LABELS", "").split(",")

def fetch_events():
    print("🧠 Fetching events from PocketBase...")
    res = requests.get(f"{POCKETBASE_API}?perPage=10000&filter=event_type='session_end'")
    res.raise_for_status()
    return res.json()["items"]

def summarize_flows(events):
    flows = []
    durations = []
    dropoffs = Counter()

    for e in events:
        path = e.get("flow_path", "")
        meta = e.get("metadata", {}) or {}
        dur = meta.get("duration_seconds", 0)
        if path:
            flows.append(path)
            durations.append((path, dur))

            # capture last page for drop-off detection
            pages = path.split(" → ")
            if pages:
                dropoffs[pages[-1]] += 1

    most_common = Counter(flows).most_common(5)
    longest = max(flows, key=lambda f: len(f.split(" → ")), default=None)

    # Fastest conversion flow (shortest duration with /checkout or /success)
    conversion_flows = [(p, d) for p, d in durations if "/checkout" in p or "/success" in p]
    fastest = min(conversion_flows, key=lambda x: x[1], default=(None, None))

    summary = "## 🧠 Flowseer Insights\n\n"

    if most_common:
        summary += f"**🚀 Most Common Flow:**\n`{most_common[0][0]}` — {most_common[0][1]} users\n\n"

    if longest:
        summary += f"**🌀 Longest Flow:**\n`{longest}` ({len(longest.split(' → '))} steps)\n\n"

    if fastest[0]:
        summary += f"**🔥 Fastest Conversion:**\n`{fastest[0]}` in {fastest[1]}s\n\n"

    summary += "**📉 Top Drop-off Pages:**\n"
    for page, count in dropoffs.most_common(3):
        summary += f"- `{page}` — {count} exits\n"

    # Optional: Flag red flows
    exits_mid_funnel = [f for f in flows if not ("/checkout" in f or "/success" in f)]
    if exits_mid_funnel:
        summary += f"\n⚠️ {len(exits_mid_funnel)} users exited before reaching checkout. Funnel leak possible.\n"

    save_insight_chart(most_common, dropoffs, fastest)
    return summary


import matplotlib.pyplot as plt

def save_insight_chart(flows_summary, dropoffs, fastest_flow=None):
    plt.figure(figsize=(12, 6))
    plt.suptitle("Flowseer — Daily Flow Insights", fontsize=16)

    # Subplot 1: Top Flows
    plt.subplot(1, 2, 1)
    if flows_summary:
        labels, counts = zip(*flows_summary)
        plt.barh(labels, counts, color="#ffa500")
        plt.title("Top Flows")
        plt.xlabel("Users")
        plt.gca().invert_yaxis()
    else:
        plt.title("Top Flows")
        plt.text(0.5, 0.5, "No flows found", ha="center", va="center")

    # Subplot 2: Drop-offs
    plt.subplot(1, 2, 2)
    if dropoffs:
        drop_labels, drop_counts = zip(*dropoffs.most_common(5))
        plt.barh(drop_labels, drop_counts, color="#ff6666")
        plt.title("Drop-off Pages")
        plt.xlabel("Exits")
        plt.gca().invert_yaxis()
    else:
        plt.title("Drop-off Pages")
        plt.text(0.5, 0.5, "No exits found", ha="center", va="center")

    # Footer
    if fastest_flow and fastest_flow[0]:
        plt.figtext(0.5, 0.01, f"Fastest conversion: {fastest_flow[0]} in {fastest_flow[1]}s",
                    ha="center", fontsize=10)

    plt.tight_layout(rect=[0, 0.05, 1, 0.95])
    plt.savefig("/app/flowseer_insights.png", dpi=150)
    send_image_to_notion("/app/flowseer_insights.png")
    print("✅ Chart saved to flowseer_insights.png")

if __name__ == "__main__":
    try:
        events = fetch_events()
        summary = summarize_flows(events)
        print(summary)
        post_flow_summary_to_notion(summary)
    except Exception as e:
        print(f"❌ Error generating summary: {e}")
