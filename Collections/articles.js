db.createCollection("articles", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "content"],
        properties: {
          title: {
            bsonType: "string",
            description: "Article title must be a string and is required"
          },
          content: {
            bsonType: "string",
            description: "Article content must be a string and is required"
          },
          category_id: {
            bsonType: "objectId",
            description: "category_id must be an ObjectId referencing categories"
          },
          authors: {
            bsonType: "array",
            description: "authors must be an array of ObjectIds",
            items: {
              bsonType: "objectId"
            }
          },
          published_date: {
            bsonType: "date",
            description: "published_date must be a date if present"
          },
          scheduled_date: {
            bsonType: "date",
            description: "scheduled_date must be a date if present"
          },
          updated_at: {
            bsonType: "date",
            description: "updated_at must be a date if present"
          },
          created_at: {
            bsonType: "date",
            description: "created_at must be a date if present"
          },
          status: {
            bsonType: "string",
            description: "status must be a string if present (e.g. 'draft', 'published')"
          },
          metadata: {
            bsonType: "object",
            description: "metadata must be an object if present",
            properties: {
              keywords: {
                bsonType: "array",
                description: "keywords must be an array of strings",
                items: {
                  bsonType: "string"
                }
              },
              read_time: {
                bsonType: "int",
                description: "read_time must be an integer if present"
              },
              description: {
                bsonType: "string",
                description: "description must be a string if present"
              },
              url: {
                bsonType: "string",
                description: "url must be a string if present"
              }
            }
          },
          tags: {
            bsonType: "array",
            description: "tags must be an array of ObjectIds referencing tags collection",
            items: {
              bsonType: "objectId"
            }
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });
  