// Title: Article Queries

// 1. Find Published Articles
db.articles.find({ status: "published" })

// 2. Find Articles Published After July 2023
db.articles.find({ published_date: { $gt: ISODate("2023-07-01T00:00:00Z") } })

// 3. Find Articles by Specific Author
db.articles.find({ authors: ObjectId("67ea2b41a142c7e7b2780d28") })

// 4. Sort Articles by Creation Date
db.articles.find().sort({ created_at: -1 })

// 5. Find Technology Articles by Status
// Explanation: Retrieves articles in the Technology category that are published or drafts, useful for editorial review.
db.articles.find({
  category_id: ObjectId("67f3c04f728e587d784b611f"),
  status: { $in: ["published", "draft"] }
})

// 6. Find Long-Read Articles
// Explanation: Finds articles with read time over 6 minutes, sorted by read time, ideal for recommending in-depth content.
db.articles.find({ "metadata.read_time": { $gt: 6 } }).sort({ "metadata.read_time": 1 })

// 7. Count Articles by Status
// Explanation: Groups articles by status to count them, providing insights into content pipeline status.
db.articles.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// 8. Find 2023 Articles with Minimum Read Time
// Explanation: Retrieves 2023 articles with at least 5 minutes read time, useful for annual content analysis.
db.articles.find({
  "metadata.published_date": {
    $gte: ISODate("2023-01-01"),
    $lt: ISODate("2024-01-01")
  },
  "metadata.read_time": { $gte: 5 }
})

// 9. Top Categories by Published Articles
// Explanation: Identifies the top 3 categories with the most published articles, joining category names for clarity, useful for content distribution analysis.
db.articles.aggregate([
  { $match: { status: "published" } },
  { $group: { _id: "$category_id", articleCount: { $sum: 1 } } },
  { $sort: { articleCount: -1 } },
  { $limit: 3 },
  { $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "category"
    }
  },
  { $unwind: "$category" },
  { $project: { categoryName: "$category.name", articleCount: 1 } }
])

// 10. Find Articles with Specific Tags
// Explanation: Retrieves articles tagged with AI or Cloud Computing, enabling tag-based content filtering.
db.articles.find({
  tags: { $in: [
    ObjectId("67f3c427728e587d784b613a"),
    ObjectId("67f3c427728e587d784b613c")
  ] }
})

