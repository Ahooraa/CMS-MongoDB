// Title: Tag Queries

// 1. Find Machine Learning Tag
db.tags.find({ name: "Machine Learning" })

// 2. Find All Tags
db.tags.find()

// 3. Find Tags Starting with C
db.tags.find({ name: { $regex: "^C" } })

// 4. Find Tags Used in Articles
// Explanation: Identifies tags associated with at least one article, useful for managing active tags.
db.articles.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags" } },
    { $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tag"
      }
    },
    { $unwind: "$tag" },
    { $project: { name: "$tag.name" } }
  ])

// 5. Count Articles per Tag
// Explanation: Counts how many articles each tag is linked to, providing insights into tag popularity.
db.articles.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", articleCount: { $sum: 1 } } },
    { $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tag"
        }
    },
    { $unwind: "$tag" },
    { $project: { name: "$tag.name", articleCount: 1 } }
])

// 6. Most Popular Tags
// Explanation: Finds the top 5 tags with the most article associations, ideal for highlighting trending topics.
db.articles.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", articleCount: { $sum: 1 } } },
    { $sort: { articleCount: -1 } },
    { $limit: 5 },
    { $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tag"
      }
    },
    { $unwind: "$tag" },
    { $project: { name: "$tag.name", articleCount: 1 } }
  ])

