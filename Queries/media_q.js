// Title: Media Queries

// 1. Find Image Media
db.media.find({ media_type: "image" })

// 2. Find Media by Specific User
db.media.find({ uploaded_by: ObjectId("67ea2b41a142c7e7b2780d28") })

// 3. Find Large Media Files
db.media.find({ file_size: { $gt: 3000 } })

// 4. Sort Media by Upload Date
db.media.find().sort({ uploaded_date: -1 })

// 5. Find Long Videos
// Explanation: Retrieves videos longer than 2 minutes, useful for filtering lengthy content.
db.media.find({ media_type: "video", duration: { $gt: 120 } })

// 6. Count Media by Type
// Explanation: Counts items per media type (image/video), providing insights into media distribution.
db.media.aggregate([
  { $group: { _id: "$media_type", count: { $sum: 1 } } }
])

// 7. Top Media Uploaders
// Explanation: Finds the top 3 users with the most media uploads, including usernames, ideal for recognizing active contributors.
db.media.aggregate([
  { $group: { _id: "$uploaded_by", mediaCount: { $sum: 1 } } },
  { $sort: { mediaCount: -1 } },
  { $limit: 3 },
  { $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $project: { username: "$user.username", mediaCount: 1 } }
])

// 8. Find Unused Media
// Explanation: Identifies media not linked to articles, useful for storage cleanup.
db.media.aggregate([
  { $lookup: {
      from: "articles",
      let: { mediaId: "$_id" },
      pipeline: [{ $match: { $expr: { $in: ["$$mediaId", "$media_ids"] } } }],
      as: "articleRefs"
    }
  },
  { $match: { articleRefs: { $size: 0 } } },
  { $project: { filename: 1, uploaded_date: 1 } }
])

// 9. Media Upload Trends
// Explanation: Aggregates media uploads and total size by month, useful for tracking storage usage over time.
db.media.aggregate([
  { $group: {
      _id: { year: { $year: "$uploaded_date" }, month: { $month: "$uploaded_date" } },
      uploadCount: { $sum: 1 },
      totalSize: { $sum: "$file_size" }
    }
  },
  { $sort: { "_id.year": 1, "_id.month": 1 } }
])