// 1. Find active users with pagination and search by role
const searchQuery = "admin"; // User's role search input
const page = 1; // Desired page
const pageSize = 10; // Number of results per page

db.users.aggregate([
  // Search for users based on their role
  {
    $match: {
      is_active: true, // Only active users
      role: { $regex: searchQuery, $options: "i" } // Search by role (case-insensitive)
    }
  },
  
  // Pagination: Skip and limit results based on the page number
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
  
  // Project relevant fields: fullname and role
  { $project: { fullname: 1, role: 1 } }
]);

// 2. Find comments by user with pagination and search by comment text
const userSearchQuery = "John"; // User's name to search for comments
const commentSearchQuery = "good article"; // Comment text search input
//const page = 1; // Desired page
//const pageSize = 5; // Number of comments per page

db.comments.aggregate([
  // Search comments by user and text content
  {
    $match: {
      "user_id": { $regex: userSearchQuery, $options: "i" }, // Match user based on name
      comment_text: { $regex: commentSearchQuery, $options: "i" } // Match comment text
    }
  },
  
  // Pagination: Skip and limit results based on page number
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
  
  // Lookup user info and project relevant fields
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user_info"
    }
  },
  { $unwind: "$user_info" },
  { $project: { comment_text: 1, "user_info.fullname": 1, "user_info.role": 1 } }
]);

// 3. Find articles with a specific tag and pagination
const tagSearchQuery = "machine"; // Tag search input
//const page = 1; // Desired page
//const pageSize = 5; // Number of articles per page

db.articles.aggregate([
  // Match articles with a specific tag
  {
    $match: {
      tags: { $in: [ObjectId("TAG_ID_HERE")] } // Match articles with a tag ID
    }
  },
  
  // Pagination: Skip and limit results based on page number
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
  
  // Project relevant fields: article title
  { $project: { title: 1, "tags": 1 } }
]);

// 4. Find articles by category with optional date filter and pagination
const categoryId = "CATEGORY_ID_HERE"; // Category ID to filter articles
const dateFrom = new Date("2025-01-01"); // Optional start date filter
//const page = 1; // Desired page
//const pageSize = 5; // Number of articles per page

db.articles.aggregate([
  // Match articles by category and optional date filter
  {
    $match: {
      category_id: ObjectId(categoryId), // Match by category ID
      published_date: { $gte: dateFrom } // Match articles published after the start date
    }
  },
  
  // Pagination: Skip and limit results based on page number
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
  
  // Project relevant fields: article title and published date
  { $project: { title: 1, published_date: 1 } }
]);

// 5. Find the most liked articles with pagination and optional category filter
const categoryFilter = "CATEGORY_ID_HERE"; // Optional category filter
//const page = 1; // Desired page
//const pageSize = 5; // Number of results per page

db.likes.aggregate([
  // Match likes for articles only
  { $match: { target_type: "article" } },
  
  // Group by article ID and count the number of likes
  { $group: { _id: "$associated_id", like_count: { $sum: 1 } } },
  
  // Lookup article info based on associated article ID
  {
    $lookup: {
      from: "articles",
      localField: "_id",
      foreignField: "_id",
      as: "article"
    }
  },
  { $unwind: "$article" },
  
  // Optional category filter
  {
    $match: {
      "article.category_id": categoryFilter // Filter by category if provided
    }
  },
  
  // Pagination: Skip and limit results based on page number
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
  
  // Project article title and like count
  { $project: { "article.title": 1, like_count: 1 } },
  { $sort: { like_count: -1 } } // Sort by like count in descending order
]);