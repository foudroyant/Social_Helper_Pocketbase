/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_48231089")

  // update collection data
  unmarshal({
    "deleteRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_48231089")

  // update collection data
  unmarshal({
    "deleteRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
