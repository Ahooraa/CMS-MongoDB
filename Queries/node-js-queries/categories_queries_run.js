const { MongoClient, ObjectId } = require('mongodb');

// Connection string and database name
const uri = 'mongodb+srv://ahoora:mongo@cluster1.lbzxf.mongodb.net/';
const dbName = 'CMS_db';

async function runQueries() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Successfully connected to MongoDB');

    // Select the database
    const db = client.db(dbName);

    // Query 1: Find Top-Level Categories
    console.log('\n=== Running Query 1: Find Top-Level Categories ===');
    const query1 = await db.collection('categories').find({ parent_id: { $exists: false } }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find Technology Category
    console.log('\n=== Running Query 2: Find Technology Category ===');
    const query2 = await db.collection('categories').find({ name: 'Technology' }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Subcategories of Technology
    console.log('\n=== Running Query 3: Find Subcategories of Technology ===');
    const query3 = await db.collection('categories').find({
      parent_id: new ObjectId('67f3c04f728e587d784b611f')
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Find Categories with Subcategories
    console.log('\n=== Running Query 4: Find Categories with Subcategories ===');
    const query4 = await db.collection('categories').aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'subcategories'
        }
      },
      {
        $match: { subcategories: { $ne: [] } }
      }
    ]).toArray();
    console.log('Results:', query4.length, 'documents found');
    console.log('Sample result (first document, if any):', query4[0] || 'No results');

    // Query 5: Count Subcategories per Category
    console.log('\n=== Running Query 5: Count Subcategories per Category ===');
    const query5 = await db.collection('categories').aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'subcategories'
        }
      },
      {
        $project: {
          name: 1,
          subcategoryCount: { $size: '$subcategories' }
        }
      }
    ]).toArray();
    console.log('Results:', query5);
    console.log('Summary: Categories with their subcategory counts');

    // Query 6: Get Category Hierarchy
    console.log('\n=== Running Query 6: Get Category Hierarchy ===');
    async function getCategoryHierarchy(categoryId) {
      let hierarchy = [];
      let currentCategory = await db.collection('categories').findOne({ _id: categoryId });
      while (currentCategory && currentCategory.parent_id) {
        hierarchy.unshift(currentCategory.name);
        currentCategory = await db.collection('categories').findOne({ _id: currentCategory.parent_id });
      }
      if (currentCategory) {
        hierarchy.unshift(currentCategory.name);
      }
      return hierarchy;
    }
    const query6 = await getCategoryHierarchy(new ObjectId('67ea2dffa142c7e7b2780d38'));
    console.log('Results:', query6);
    console.log('Summary: Hierarchy for category ID 67ea2dffa142c7e7b2780d38');

    // Query 7: Count Articles in Category Tree
    console.log('\n=== Running Query 7: Count Articles in Category Tree ===');
    const query7 = await db.collection('categories').aggregate([
      {
        $match: { _id: new ObjectId('67f3c04f728e587d784b611f') }
      },
      {
        $graphLookup: {
          from: 'categories',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent_id',
          as: 'subcategories'
        }
      },
      {
        $project: {
          allCategoryIds: { $concatArrays: [['$_id'], '$subcategories._id'] }
        }
      },
      {
        $unwind: '$allCategoryIds'
      },
      {
        $lookup: {
          from: 'articles',
          localField: 'allCategoryIds',
          foreignField: 'category_id',
          as: 'articles'
        }
      },
      {
        $project: {
          articleCount: { $size: '$articles' }
        }
      }
    ]).toArray();
    console.log('Results:', query7);
    console.log('Summary: Article count for category tree starting at ID 67f3c04f728e587d784b611f');

    // Query 8: Categories with Low Author Diversity
    console.log('\n=== Running Query 8: Categories with Low Author Diversity ===');
    const query8 = await db.collection('articles').aggregate([
      {
        $group: {
          _id: '$category_id',
          uniqueAuthors: { $addToSet: '$authors' }
        }
      },
      {
        $project: {
          authorCount: { $size: '$uniqueAuthors' }
        }
      },
      {
        $match: { authorCount: { $lt: 3 } }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          categoryName: '$category.name',
          authorCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query8);
    console.log('Summary: Categories with fewer than 3 unique authors');

  } catch (error) {
    console.error('Error running queries:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the queries
runQueries().catch(console.error);