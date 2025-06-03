/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const events = new Collection({
    "id": "pbc_events_collection",
    "name": "events",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "indexes": [],
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "user_id_field",
        "max": 0,
        "min": 0,
        "name": "user_id",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "session_id_field",
        "max": 0,
        "min": 0,
        "name": "session_id",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "event_type_field",
        "max": 0,
        "min": 0,
        "name": "event_type",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "page_field",
        "max": 0,
        "min": 0,
        "name": "page",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "timestamp_field",
        "name": "timestamp",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "metadata_field",
        "name": "metadata",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "flow_path_field",
        "name": "flow_path",
        "max": 0,
        "min": 0,
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "created_field",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "updated_field",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3590266622",
    "indexes": [],
    "listRule": true,
    "name": "events",
    "system": false,
    "type": "base",
    "updateRule": true,
    "viewRule": true
  });

  const config = new Collection({
    "id": "pbc_config_collection",
    "name": "config",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "indexes": [],
    "fields": [
      { "id": "urls", "name": "CONVERSION_URLS", "type": "text" },
      { "id": "events", "name": "CONVERSION_EVENT_TYPES", "type": "text" },
      { "id": "clicks", "name": "CONVERSION_CLICK_LABELS", "type": "text" }
    ]
  });

  // SECRETS COLLECTION
  const secrets = new Collection({
    "id": "pbc_secrets_collection",
    "name": "secrets",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "indexes": [],
    "fields": [
      { "id": "notion_token", "name": "NOTION_API_SECRET", "type": "text", "required": true },
      { "id": "notion_page", "name": "NOTION_PAGE_ID", "type": "text", "required": true },
      { "id": "imgbb", "name": "IMGBB_KEY", "type": "text", "required": true }
    ]
  });
  app.save(events)
  app.save(config);
  app.save(secrets);
},

(app) => {
  const events = app.findCollectionByNameOrId("pbc_3590266622");
  const config = app.findCollectionByNameOrId("pbc_config_collection");
  const secrets = app.findCollectionByNameOrId("pbc_secrets_collection")

  app.delete(app.findCollectionByNameOrId("pbc_3590266622"));
  app.delete(app.findCollectionByNameOrId("pbc_config_collection"));
  app.delete(app.findCollectionByNameOrId("pbc_secrets_collection"));
})
