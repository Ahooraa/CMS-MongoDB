db.createCollection("comments", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["article_id", "user_id", "comment_text"],
        properties: {
          article_id: {
            bsonType: "objectId",
            description: "article_id must be an ObjectId and is required"
          },
          user_id: {
            bsonType: "objectId",
            description: "user_id must be an ObjectId and is required"
          },
          created_at: {
            bsonType: "date",
            description: "created_at must be a date if present"
          },
          is_active: {
            bsonType: "bool",
            description: "is_active must be a boolean if present"
          },
          comment_text: {
            bsonType: "string",
            description: "comment_text must be a string and is required"
          },
          parent_id: {
            bsonType: "objectId",
            description: "parent_id must be an ObjectId if present (reply to another comment)"
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });  