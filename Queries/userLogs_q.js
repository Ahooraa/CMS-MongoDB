// Title: User Log Queries

// 1. Find Logs for Specific User
db.userLogs.find({ user_id: ObjectId("67ea2b41a142c7e7b2780d28") })

// 2. Find Login Actions
db.userLogs.find({ action: "login" })

// 3. Find Logs from January 2023
db.userLogs.find({
  datetime: {
    $gte: ISODate("2023-01-01T00:00:00Z"),
    $lt: ISODate("2023-02-01T00:00:00Z")
  }
})

// 4. Sort Logs by Date Descending
db.userLogs.find().sort({ datetime: -1 })

// 5. Find Users Who Edited Articles
// Explanation: Retrieves unique user IDs who performed article edits, useful for identifying active editors.
db.userLogs.find({ action: "edit_article" }).distinct("user_id")

// 6. Count Actions by Type
// Explanation: Counts occurrences of each action type, providing insights into user activity patterns.
db.userLogs.aggregate([
  { $group: { _id: "$action", count: { $sum: 1 } } }
])

// 7. Most Active Users by Log Count
// Explanation: Finds the top 5 users with the most log entries, including usernames, ideal for recognizing top contributors.
db.userLogs.aggregate([
  { $group: { _id: "$user_id", logCount: { $sum: 1 } } },
  { $sort: { logCount: -1 } },
  { $limit: 5 },
  { $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $project: { username: "$user.username", logCount: 1 } }
])


