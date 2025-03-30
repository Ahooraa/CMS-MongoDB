db.createCollection("tags", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name"],
        properties: {
          name: {
            bsonType: "string",
            description: "Tag name must be a string and is required"
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });
  