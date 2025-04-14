// Title: Like Queries

// 1. Find Likes for Specific Article
db.likes.find({
  associated_id: ObjectId("67ea2d85a142c7e7b2780d31"),
  target_type: "article"
})

// 2. Find Likes by Specific User
db.likes.find({ user_id: ObjectId("67f3bb2f728e587d784b6100") })

// 3. Find Likes on Comments
db.likes.find({ target_type: "comment" })

// 4. Count Likes per Article
// Explanation: Counts likes for each article, useful for ranking content by popularity.
db.likes.aggregate([
  { $match: { target_type: "article" } },
  { $group: { _id: "$associated_id", likeCount: { $sum: 1 } } }
])

// 5. Users Liking Articles and Comments
// Explanation: Identifies users who liked both articles and comments, useful for analyzing versatile engagement.
db.likes.aggregate([
  { $group: { _id: "$user_id", targetTypes: { $addToSet: "$target_type" } } },
  { $match: { targetTypes: { $all: ["article", "comment"] } } }
])

// 6. Find Comment Likes by Specific User
// Explanation: Retrieves comment likes by a specific user, useful for tracking discussion engagement.
db.likes.find({
  target_type: "comment",
  user_id: ObjectId("67ea2d85a142c7e7b2780d34")
})

// 7. Most Liked Articles
// Explanation: Finds the top 5 articles with the most likes, including titles, ideal for showcasing popular content.
db.likes.aggregate([
  { $match: { target_type: "article" } },
  { $group: { _id: "$associated_id", likeCount: { $sum: 1 } } },
  { $sort: { likeCount: -1 } },
  { $limit: 5 },
  { $lookup: {
      from: "articles",
      localField: "_id",
      foreignField: "_id",
      as: "article"
    }
  },
  { $unwind: "$article" },
  { $project: { title: "$article.title", likeCount: 1 } }
])


