// 1. Selection: Find all active users
db.users.find({ is_active: true });

// 2. Projection: Get only username and email from users
db.users.find({}, { projection: { username: 1, email: 1, _id: 0 } });

// 3. Rename: Rename 'age' field to 'user_age' (Updating the field name in the database)
db.users.updateOne({ username: "johndoe" }, { $rename: { "age": "user_age" } })

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

// 5. Cartesian Product: Combine each media with all categories (no join condition = cartesian product)
db.media.aggregate([
  {
    $lookup: {
      from: "categories",
      let: {},
      pipeline: [
        { $match: {} }
      ],
      as: "category"
    }
  },
  {
    $unwind: "$category"
  },
  {
    $project: {
      media_id: "$_id",
      file_url: 1,
      media_type: 1,
      category_id: "$category._id",
      category_name: "$category.name",
      parent_id: "$category.parent_id",
      _id: 0
    }
  }
])

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