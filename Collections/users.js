db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "email", "password", "role"],
        properties: {
          username: {
            bsonType: "string",
            description: "Username must be a string and is required"
          },
          email: {
            bsonType: "string",
            description: "Email must be a string and is required"
          },
          password: {
            bsonType: "string",
            description: "Password must be a string and is required"
          },
          contact_info: {
            bsonType: "object",
            description: "Contact info must be an object",
            properties: {
              phone: {
                bsonType: "string",
                description: "Phone number must be a string"
              },
              address: {
                bsonType: "object",
                description: "Address must be an object",
                properties: {
                  country: {
                    bsonType: "string",
                    description: "Country must be a string"
                  },
                  province: {
                    bsonType: "string",
                    description: "Province must be a string"
                  },
                  city: {
                    bsonType: "string",
                    description: "City must be a string"
                  }
                }
              }
            }
          },
          submission_age: {
            bsonType: "int",
            description: "submission_age must be an integer"
          },
          age: {
            bsonType: "int",
            description: "Age must be an integer"
          },
          birth_date: {
            bsonType: "date",
            description: "birth_date must be a date"
          },
          last_login: {
            bsonType: "date",
            description: "last_login must be a date"
          },
          is_active: {
            bsonType: "bool",
            description: "is_active must be a boolean"
          },
          join_date: {
            bsonType: "date",
            description: "join_date must be a date"
          },
          role: {
            bsonType: "string",
            description: "Role must be a string and is required"
          },
          admin_info: {
            bsonType: "object",
            description: "admin_info must be an object if present",
            properties: {
              admin_level: {
                bsonType: "int",
                description: "admin_level must be an integer"
              },
              permissions: {
                bsonType: "array",
                description: "permissions must be an array of strings",
                items: {
                  bsonType: "string"
                }
              }
            }
          },
          editor_info: {
            bsonType: "object",
            description: "editor_info must be an object if present",
            properties: {
              editing_rights: {
                bsonType: "array",
                description: "editing_rights must be an array of strings",
                items: {
                  bsonType: "string"
                }
              },
              assigned_articles: {
                bsonType: "array",
                description: "assigned_articles must be an array of ObjectIds",
                items: {
                  bsonType: "objectId"
                }
              }
            }
          },
          reader_info: {
            bsonType: "object",
            description: "reader_info must be an object if present",
            properties: {
              favorite_articles: {
                bsonType: "array",
                description: "favorite_articles must be an array of ObjectIds",
                items: {
                  bsonType: "objectId"
                }
              }
            }
          },
          createdAt: {
            bsonType: "date",
            description: "createdAt must be a date"
          },
          updatedAt: {
            bsonType: "date",
            description: "updatedAt must be a date"
          }
        }
      }
    },
    validationAction: "error",
    validationLevel: "strict"
  });  