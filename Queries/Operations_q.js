// 1. Selection: Find all active users
db.users.find({ is_active: true });

// 2. Projection: Get only username and email from users
db.users.find({}, { projection: { username: 1, email: 1, _id: 0 } });

// 3. Rename: Rename 'username' field to 'fullname' in projection
db.users.aggregate([
    {
      $project: {
        fullname: "$username",
        email: 1,
        _id: 0
      }
    }
]);

// 4. Union: Combine active users and users who have Persian language in userSettings
db.users.aggregate([
    { $match: { is_active: true } },
    {
      $project: {
        _id: 1,
        username: 1,
        source: { $literal: "active_users" }
      }
    },
    {
      $unionWith: {
        coll: "userSettings",
        pipeline: [
          { $match: { language: "fa" } },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user_info"
            }
          },
          { $unwind: "$user_info" },
          {
            $project: {
              _id: "$user_id",
              username: "$user_info.username",
              source: { $literal: "fa_language_users" }
            }
          }
        ]
      }
    }
]);

// 5. Cartesian Product: Combine each user with all tags (no join condition = cartesian product)
db.users.aggregate([
    {
      $lookup: {
        from: "tags",
        pipeline: [],
        as: "all_tags"
      }
    }
]);

// 6. Difference: Find users who do NOT have a corresponding profile in userSettings
db.users.aggregate([
    {
      $lookup: {
        from: "userSettings",
        localField: "_id",
        foreignField: "user_id",
        as: "settings"
      }
    },
    { $match: { settings: { $eq: [] } } }
]);