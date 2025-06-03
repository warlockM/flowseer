# 🌀 Flowseer — Lightweight Flow & Retention Analytics for Web Apps

**Flowseer** helps you track user journeys (clicks, time-on-page, flow paths, session durations) using a privacy-friendly tracker and a self-hosted analytics backend powered by PocketBase.

> No cookies. No creepy tracking. Just clear insights. 🧠

---

## 🚀 Features

- Tracks user session, page views, time-on-page, and clicks
- Works even with Single Page Apps (Next.js, React, Vue, etc.)
- Instant summaries of user flows + session durations
- Send reports directly to Notion
- Self-hostable via Docker 🐳
- Brave/adblock evasion with stealth tracker

---

## 🛠️ Stack

- [PocketBase](https://pocketbase.io) (backend + DB)
- Python (summarizer + Notion integration)
- JavaScript (client-side tracker)
- Docker for packaging everything
- Optional: Notion + Imgbb for reporting

---

## 🧩 Installation

```bash
git clone https://github.com/your-username/flowseer.git
cd flowseer
docker-compose up --build
