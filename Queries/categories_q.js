// Title: Category Queries

// 1. Find Top-Level Categories
db.categories.find({ parent_id: { $exists: false } })

// 2. Find Technology Category
db.categories.find({ name: "Technology" })

// 3. Find Subcategories of Technology
db.categories.find({ parent_id: ObjectId("67f3c04f728e587d784b611f") })

// 4. Find Categories with Subcategories
// Explanation: Identifies categories with at least one subcategory, useful for understanding category structure.
db.categories.aggregate([
    { $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parent_id",
        as: "subcategories"
      }
    },
    { $match: { subcategories: { $ne: [] } } }
  ])

// 5. Count Subcategories per Category
// Explanation: Counts subcategories for each category, providing insights into hierarchy depth.
db.categories.aggregate([
{ $lookup: {
    from: "categories",
    localField: "_id",
    foreignField: "parent_id",
    as: "subcategories"
    }
},
{ $project: { name: 1, subcategoryCount: { $size: "$subcategories" } } }
])

// 6. Get Category Hierarchy
// Explanation: Builds the hierarchy for a subcategory to its top-level category, useful for breadcrumb navigation.
function getCategoryHierarchy(categoryId) {
    let hierarchy = [];
    let currentCategory = db.categories.findOne({ _id: categoryId });
    while (currentCategory && currentCategory.parent_id) {
      hierarchy.unshift(currentCategory.name);
      currentCategory = db.categories.findOne({ _id: currentCategory.parent_id });
    }
    if (currentCategory) {
      hierarchy.unshift(currentCategory.name);
    }
    return hierarchy;
  }
  getCategoryHierarchy(ObjectId("67ea2dffa142c7e7b2780d38"));

// 7. Count Articles in Category Tree
// Explanation: Counts articles across a category and its subcategories, useful for assessing content volume.
db.categories.aggregate([
    { $match: { _id: ObjectId("67ea2d85a142c7e7b2780d33") } },
    { $graphLookup: {
        from: "categories",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parent_id",
        as: "subcategories"
        }
    },
    { $project: { allCategoryIds: { $concatArrays: [["$_id"], "$subcategories._id"] } } },
    { $unwind: "$allCategoryIds" },
    { $lookup: {
        from: "articles",
        localField: "allCategoryIds",
        foreignField: "category_id",
        as: "articles"
        }
    },
    { $project: { articleCount: { $size: "$articles" } } }
])

// 8. Categories with Low Author Diversity
// Explanation: Finds categories with fewer than 3 unique authors, useful for identifying areas needing contributor variety.
db.articles.aggregate([
    { $group: { _id: "$category_id", uniqueAuthors: { $addToSet: "$authors" } } },
    { $project: { authorCount: { $size: "$uniqueAuthors" } } },
    { $match: { authorCount: { $lt: 3 } } },
    { $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category"
      }
    },
    { $unwind: "$category" },
    { $project: { categoryName: "$category.name", authorCount: 1 } }
  ])