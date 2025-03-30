db.createCollection("media", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "file_url",
          "file_type",
          "file_size",
          "uploaded_by",
          "uploaded_date",
          "media_type"
        ],
        properties: {
          file_url: {
            bsonType: "string",
            description: "file_url must be a string and is required"
          },
          file_type: {
            bsonType: "string",
            description: "file_type must be a string and is required"
          },
          file_size: {
            bsonType: "int",
            description: "file_size must be an integer and is required"
          },
          uploaded_by: {
            bsonType: "objectId",
            description: "uploaded_by must be an ObjectId referencing users"
          },
          uploaded_date: {
            bsonType: "date",
            description: "uploaded_date must be a date and is required"
          },
          media_type: {
            bsonType: "string",
            description: "media_type must be a string (e.g. 'image' or 'video')"
          },
          resolution: {
            bsonType: "string",
            description: "resolution must be a string if present"
          },
          aspect_ratio: {
            bsonType: "string",
            description: "aspect_ratio must be a string if present"
          },
          duration: {
            bsonType: "int",
            description: "duration must be an integer if present"
          },
          quality: {
            bsonType: "string",
            description: "quality must be a string if present"
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });
  