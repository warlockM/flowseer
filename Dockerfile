FROM python:3.11-slim

RUN apt-get update && apt-get install -y curl unzip

WORKDIR /app

RUN curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.27.2/pocketbase_0.27.2_linux_amd64.zip -o pb.zip \
    && unzip pb.zip -d . \
    && rm pb.zip \
    && chmod +x pocketbase

# COPY pb_data/ ./pb_data/
COPY pb_public/ ./pb_public/
COPY pb_migrations/ /app/pb_migrations/
COPY generate_flow_summary.py ./generate_flow_summary.py
COPY entrypoint.sh /app/entrypoint.sh
COPY send_to_notion.py /app/send_to_notion.py
COPY requirements.txt /app/requirements.txt
COPY send_image_to_notion.py /app/send_image_to_notion.py
COPY config_loader.py /app/config_loader.py


# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x /app/entrypoint.sh
EXPOSE 8090
ENTRYPOINT ["/app/entrypoint.sh"]
