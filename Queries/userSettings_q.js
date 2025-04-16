// 1. Find users with dark mode enabled
db.userSettings.find({ dark_mode: true });

// 2. Find users with Persian language and email notifications enabled
db.userSettings.find({
    language: "fa",
    email_notifications: true
  });

// 3. Count of users grouped by font size
db.userSettings.aggregate([
    {
      $group: {
        _id: "$font_size",
        count: { $sum: 1 }
      }
    }
  ]);

// 4. List users with their UI settings (joined with users collection)
db.userSettings.aggregate([
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
        _id: 0,
        fullname: "$user_info.fullname",
        email: "$user_info.email",
        language: 1,
        dark_mode: 1,
        font_size: 1
      }
    }
  ]);

// 5. Find inactive users who still have email notifications enabled
db.userSettings.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $match: {
        "user.is_active": false,
        email_notifications: true
      }
    },
    {
      $project: {
        fullname: "$user.fullname",
        email: "$user.email",
        email_notifications: 1
      }
    }
  ]);  