db.likes.createIndex(
    { user_id: 1, associated_id: 1, target_type: 1 },
    { unique: true }
  );  