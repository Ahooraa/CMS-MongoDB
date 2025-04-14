const { MongoClient, ObjectId } = require('mongodb');

// Connection string and database name
const uri = 'mongodb+srv://ahoora:mongo@cluster1.lbzxf.mongodb.net/';
const dbName = 'CMS_db';

async function runQueries() {
  // Create a MongoClient instance
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Successfully connected to MongoDB');

    // Select the database
    const db = client.db(dbName);

    // Query 1: Find Published Articles
    console.log('\n=== Running Query 1: Find Published Articles ===');
    const query1 = await db.collection('articles').find({ status: 'published' }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find Articles Published After July 2023
    console.log('\n=== Running Query 2: Find Articles Published After July 2023 ===');
    const query2 = await db.collection('articles').find({
      published_date: { $gt: new Date('2023-07-01T00:00:00Z') }
    }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Articles by Specific Author
    console.log('\n=== Running Query 3: Find Articles by Specific Author ===');
    const query3 = await db.collection('articles').find({
      authors: new ObjectId('5f50c31f1c9d440000a1b2a1')
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Sort Articles by Creation Date
    console.log('\n=== Running Query 4: Sort Articles by Creation Date ===');
    const query4 = await db.collection('articles').find().sort({ created_at: -1 }).toArray();
    console.log('Results:', query4.length, 'documents found');
    console.log('Sample result (first document, if any):', query4[0] || 'No results');

    // Query 5: Find Technology Articles by Status
    console.log('\n=== Running Query 5: Find Technology Articles by Status ===');
    const query5 = await db.collection('articles').find({
      category_id: new ObjectId('67f3c04f728e587d784b611f'),
      status: { $in: ['published', 'draft'] }
    }).toArray();
    console.log('Results:', query5.length, 'documents found');
    console.log('Sample result (first document, if any):', query5[0] || 'No results');

    // Query 6: Find Long-Read Articles
    console.log('\n=== Running Query 6: Find Long-Read Articles ===');
    const query6 = await db.collection('articles').find({
      'metadata.read_time': { $gt: 6 }
    }).sort({ 'metadata.read_time': 1 }).toArray();
    console.log('Results:', query6.length, 'documents found');
    console.log('Sample result (first document, if any):', query6[0] || 'No results');

    // Query 7: Count Articles by Status
    console.log('\n=== Running Query 7: Count Articles by Status ===');
    const query7 = await db.collection('articles').aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();
    console.log('Results:', query7);
    console.log('Summary: Count of articles by status');

    // Query 8: Find 2023 Articles with Minimum Read Time
    console.log('\n=== Running Query 8: Find 2023 Articles with Minimum Read Time ===');
    const query8 = await db.collection('articles').find({
      'metadata.published_date': {
        $gte: new Date('2023-01-01'),
        $lt: new Date('2024-01-01')
      },
      'metadata.read_time': { $gte: 5 }
    }).toArray();
    console.log('Results:', query8.length, 'documents found');
    console.log('Sample result (first document, if any):', query8[0] || 'No results');

    // Query 9: Top Categories by Published Articles
    console.log('\n=== Running Query 9: Top Categories by Published Articles ===');
    const query9 = await db.collection('articles').aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category_id', articleCount: { $sum: 1 } } },
      { $sort: { articleCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryName: '$category.name',
          articleCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query9);
    console.log('Summary: Top 3 categories with article counts');

    // Query 10: Find Articles with Specific Tags
    console.log('\n=== Running Query 10: Find Articles with Specific Tags ===');
    const query10 = await db.collection('articles').find({
      tags: {
        $in: [
          new ObjectId('67f3c427728e587d784b613a'),
          new ObjectId('67f3c427728e587d784b613c')
        ]
      }
    }).toArray();
    console.log('Results:', query10.length, 'documents found');
    console.log('Sample result (first document, if any):', query10[0] || 'No results');


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