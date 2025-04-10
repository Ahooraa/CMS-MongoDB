// 1. Articles with their associated categories:
db.articles.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category"
      }
    },
    { $unwind: "$category" },
    { $project: { title: 1, "category.name": 1 } }
  ]);

// 2. Published articles with their authors' information
db.articles.aggregate([
    { $match: { status: "published" } },
    {
      $lookup: {
        from: "users",
        localField: "authors",
        foreignField: "_id",
        as: "authors_info"
      }
    },
    { $project: { title: 1, authors_info: { fullname: 1, role: 1 } } }
  ]);

// 3. Comments with user and article information
db.comments.aggregate([
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
      $lookup: {
        from: "articles",
        localField: "article_id",
        foreignField: "_id",
        as: "article"
      }
    },
    { $unwind: "$article" },
    { $project: { comment_text: 1, "user.fullname": 1, "article.title": 1 } }
  ]);  

// 4. Comment count per article
db.comments.aggregate([
    { $group: { _id: "$article_id", comment_count: { $sum: 1 } } },
    {
      $lookup: {
        from: "articles",
        localField: "_id",
        foreignField: "_id",
        as: "article"
      }
    },
    { $unwind: "$article" },
    { $project: { article_title: "$article.title", comment_count: 1 } }
  ]);  

// 5. Users with the most published articles
db.articles.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$authors" },
    {
      $group: { _id: "$authors", count: { $sum: 1 } }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    { $project: { fullname: "$user.fullname", count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);  

// 6. Articles with their associated tags
db.articles.aggregate([
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tag_list"
      }
    },
    { $project: { title: 1, tag_names: "$tag_list.name" } }
  ]);  

// 7. Likes on articles with user information
db.likes.aggregate([
    { $match: { target_type: "article" } },
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
      $lookup: {
        from: "articles",
        localField: "associated_id",
        foreignField: "_id",
        as: "article"
      }
    },
    { $unwind: "$article" },
    { $project: { "user.fullname": 1, "article.title": 1 } }
  ]);  

// 8. Users with the most comments
db.comments.aggregate([
    { $group: { _id: "$user_id", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    { $project: { fullname: "$user.fullname", count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);  

// 9. Media files uploaded by a specific user
db.media.aggregate([
    { $match: { uploaded_by: ObjectId("USER_ID") } },
    {
      $lookup: {
        from: "users",
        localField: "uploaded_by",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    { $project: { file_url: 1, media_type: 1, "user.fullname": 1 } }
  ]);  

// 10. Categories and their subcategories
db.categories.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parent_id",
        as: "children"
      }
    },
    { $project: { name: 1, children: { name: 1 } } }
  ]);  

// 11. Users' latest actions from user logs
db.userLogs.aggregate([
    { $sort: { datetime: -1 } },
    {
      $group: {
        _id: "$user_id",
        last_action: { $first: "$action" },
        last_time: { $first: "$datetime" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    { $project: { fullname: "$user.fullname", last_action: 1, last_time: 1 } }
  ]);  

// 12. Articles with the most likes
db.likes.aggregate([
    { $match: { target_type: "article" } },
    { $group: { _id: "$associated_id", like_count: { $sum: 1 } } },
    {
      $lookup: {
        from: "articles",
        localField: "_id",
        foreignField: "_id",
        as: "article"
      }
    },
    { $unwind: "$article" },
    { $project: { title: "$article.title", like_count: 1 } },
    { $sort: { like_count: -1 } },
    { $limit: 10 }
  ]);  

// 13. Like count per comment
db.likes.aggregate([
    { $match: { target_type: "comment" } },
    { $group: { _id: "$associated_id", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "_id",
        as: "comment"
      }
    },
    { $unwind: "$comment" },
    { $project: { comment_text: "$comment.comment_text", count: 1 } }
  ]);  

// 14. Average read time for articles
db.articles.aggregate([
    { $match: { "metadata.read_time": { $exists: true } } },
    { $group: { _id: null, avg_read_time: { $avg: "$metadata.read_time" } } }
  ]);  

// 15. Users with no activity in logs
db.users.aggregate([
    {
      $lookup: {
        from: "userLogs",
        localField: "_id",
        foreignField: "user_id",
        as: "logs"
      }
    },
    { $match: { logs: { $size: 0 } } },
    { $project: { fullname: 1, email: 1 } }
  ]);  

// 16. Comments with replies (count of replies)
db.comments.aggregate([
    { $match: { parent_id: { $exists: true } } },
    { $group: { _id: "$parent_id", reply_count: { $sum: 1 } } }
  ]);  

// 17. Users with the number of media files uploaded
db.media.aggregate([
    { $group: { _id: "$uploaded_by", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    { $project: { fullname: "$user.fullname", media_uploaded: "$count" } }
  ]);  

// 18. Users with the articles they have written
db.users.aggregate([
    {
      $lookup: {
        from: "articles",
        localField: "_id",
        foreignField: "authors",
        as: "written_articles"
      }
    },
    { $project: { fullname: 1, article_titles: "$written_articles.title" } }
  ]);  

// 19. Most used tags in articles
db.articles.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tag"
      }
    },
    { $unwind: "$tag" },
    { $project: { name: "$tag.name", count: 1 } },
    { $sort: { count: -1 } }
  ]);  

// 20. Articles with the most media files (using $lookup and $group)
db.media.aggregate([
    { $match: { media_type: "image" } },
    {
      $lookup: {
        from: "articles",
        localField: "associated_article_id",
        foreignField: "_id",
        as: "article"
      }
    },
    { $unwind: "$article" },
    { $group: { _id: "$article._id", count: { $sum: 1 }, title: { $first: "$article.title" } } },
    { $sort: { count: -1 } }
  ]);  