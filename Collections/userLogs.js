db.createCollection("userLogs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "action", "datetime"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "user_id must be an ObjectId and is required"
        },
        action: {
          bsonType: "string",
          description: "action must be a string and is required"
        },
        target_type: {
          bsonType: "string",
          description: "target_type must be a string if present"
        },
        target_id: {
          bsonType: "objectId",
          description: "target_id must be an ObjectId if present"
        },
        datetime: {
          bsonType: "date",
          description: "datetime must be a date and is required"
        },
        metadata: {
          bsonType: "object",
          description: "metadata is an object containing extra info",
          properties: {
            device: {
              bsonType: "string",
              description: "device info must be a string"
            },
            ip_address: {
              bsonType: "string",
              description: "ip_address must be a string"
            }
          }
        }
      }
    }
  },
  validationAction: "error",
  validationLevel: "strict"
});