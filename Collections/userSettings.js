db.createCollection("userSettings", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "dark_mode", "language", "email_notifications"],
        properties: {
          user_id: {
            bsonType: "objectId",
            description: "Must reference a user"
          },
          dark_mode: {
            bsonType: "bool",
            description: "Must be true or false"
          },
          language: {
            bsonType: "string",
            enum: ["fa", "en", "ar", "de"],
            description: "Language must be one of: fa, en, ar, de"
          },
          email_notifications: {
            bsonType: "bool",
            description: "Enable or disable email notifications"
          },
          font_size: {
            bsonType: "string",
            enum: ["small", "medium", "large"],
            description: "Font size must be small, medium, or large"
          },
          timezone: {
            bsonType: "string",
            description: "Timezone string (e.g., Asia/Tehran)"
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });  