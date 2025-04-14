// Title: Comment Queries

// 1. Find Comments for Specific Article
db.comments.find({ article_id: ObjectId("67ea2d85a142c7e7b2780d31") })

// 2. Find Active Comments
db.comments.find({ is_active: true })

// 3. Find Comments by Specific User
db.comments.find({ user_id: ObjectId("67f3bb2f728e587d784b6100") })

// 4. Sort Comments by Creation Date
db.comments.find().sort({ created_at: 1 })

// 5. Find Top-Level Comments for Article
// Explanation: Retrieves top-level comments for an article, excluding replies, useful for threaded comment displays.
db.comments.find({
  article_id: ObjectId("67ea2d85a142c7e7b2780d31"),
  parent_id: { $exists: false }
})

// 6. Count Comments per Article
// Explanation: Counts comments for each article, providing insights into article engagement.
db.comments.aggregate([
  { $group: { _id: "$article_id", commentCount: { $sum: 1 } } }
])

// 7. Find Comments from October 2023
// Explanation: Retrieves comments posted in October 2023, useful for time-specific engagement analysis.
db.comments.find({
  created_at: {
    $gte: ISODate("2023-10-01"),
    $lte: ISODate("2023-10-31")
  }
})

// 8. Most Commented Articles
// Explanation: Finds the top 5 articles with the most comments, including titles, ideal for identifying popular content.
db.comments.aggregate([
  { $group: { _id: "$article_id", commentCount: { $sum: 1 } } },
  { $sort: { commentCount: -1 } },
  { $limit: 5 },
  { $lookup: {
      from: "articles",
      localField: "_id",
      foreignField: "_id",
      as: "article"
    }
  },
  { $unwind: "$article" },
  { $project: { title: "$article.title", commentCount: 1 } }
])

