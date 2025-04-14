// Title: User Queries

// 1. Find Active Users
db.users.find({ is_active: true })

// 2. Find Admin Users
db.users.find({ role: "admin" })

// 3. Find Users Over 40
db.users.find({ age: { $gt: 40 } })

// 4. Sort Users by Join Date
db.users.find().sort({ join_date: 1 })

// 5. Find Users with Favorite Articles
// Explanation: Retrieves users with at least one favorite article, useful for engagement analysis.
db.users.find({ "reader_info.favorite_articles": { $exists: true, $ne: [] } })

// 6. Find Admins with Manage Users Permission
// Explanation: Finds admins with permission to manage users, useful for permission audits.
db.users.find({
  role: "admin",
  "admin_info.permissions": { $in: ["manage_users"] }
})

// 7. Count Users by Role
// Explanation: Counts users per role, providing insights into user role distribution.
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

// 8. Find Users Registered After 2023
// Explanation: Retrieves users who joined after January 1, 2023, useful for tracking new sign-ups.
db.users.find({ registration_date: { $gt: ISODate("2023-01-01") } })

// 9. Average Age by Role
// Explanation: Calculates the average age of users per role, ideal for demographic analysis.
db.users.aggregate([
  { $group: { _id: "$role", averageAge: { $avg: "$age" } } }
])

// 10. New Users Who Edited Articles
// Explanation: Finds 2023-joined users who edited articles, useful for tracking new editor activity.
db.users.aggregate([
  { $match: { join_date: { $gte: ISODate("2023-01-01T00:00:00Z") } } },
  { $lookup: {
      criação: "userLogs",
      localField: "_id",
      foreignField: "user_id",
      as: "logs"
    }
  },
  { $match: { "logs.action": "edit_article" } },
  { $project: { username: 1, join_date: 1 } }
])

// 11. Users with Similar Activity Profiles
// Explanation: Groups users by similar action profiles (e.g., login counts), useful for clustering by behavior.
db.users.aggregate([
  { $lookup: {
      from: "userLogs",
      localField: "_id",
      foreignField: "user_id",
      as: "logs"
    }
  },
  { $project: {
      username: 1,
      actionProfile: { $arrayToObject: { $zip: { inputs: [["login", "view", "comment"], { $arrayElemAt: [{ $map: { input: "$logs", in: { $cond: [{ $eq: ["$$this.action", "login"] }, 1, 0] } } }, 0] }] } } }
    }
  },
  { $group: { _id: "$actionProfile", users: { $push: "$username" } } },
  { $match: { "users.1": { $exists: true } } }
])