db.createCollection("likes", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["associated_id", "target_type", "user_id"],
        properties: {
          associated_id: {
            bsonType: "objectId",
            description: "associated_id must be an ObjectId and is required"
          },
          target_type: {
            bsonType: "string",
            description: "target_type must be a string (e.g. 'article' or 'comment')"
          },
          user_id: {
            bsonType: "objectId",
            description: "user_id must be an ObjectId referencing users"
          },
          created_at: {
            bsonType: "date",
            description: "created_at must be a date if present"
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });
  