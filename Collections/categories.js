db.createCollection("categories", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name"],
        properties: {
          name: {
            bsonType: "string",
            description: "Category name must be a string and is required"
          },
          parent_id: {
            bsonType: "objectId",
            description: "parent_id can be an ObjectId referencing categories"
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });  