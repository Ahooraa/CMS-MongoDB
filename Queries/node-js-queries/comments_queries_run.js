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

    // Query 1: Find Comments for Specific Article
    console.log('\n=== Running Query 1: Find Comments for Specific Article ===');
    const query1 = await db.collection('comments').find({
      article_id: new ObjectId('67ea2d85a142c7e7b2780d31')
    }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find Active Comments
    console.log('\n=== Running Query 2: Find Active Comments ===');
    const query2 = await db.collection('comments').find({
      is_active: true
    }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Comments by Specific User
    console.log('\n=== Running Query 3: Find Comments by Specific User ===');
    const query3 = await db.collection('comments').find({
      user_id: new ObjectId('67f3bb2f728e587d784b6100')
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Sort Comments by Creation Date
    console.log('\n=== Running Query 4: Sort Comments by Creation Date ===');
    const query4 = await db.collection('comments').find().sort({ created_at: 1 }).toArray();
    console.log('Results:', query4.length, 'documents found');
    console.log('Sample result (first document, if any):', query4[0] || 'No results');

    // Query 5: Find Top-Level Comments for Article
    console.log('\n=== Running Query 5: Find Top-Level Comments for Article ===');
    const query5 = await db.collection('comments').find({
      article_id: new ObjectId('67ea2d85a142c7e7b2780d31'),
      parent_id: { $exists: false }
    }).toArray();
    console.log('Results:', query5.length, 'documents found');
    console.log('Sample result (first document, if any):', query5[0] || 'No results');

    // Query 6: Count Comments per Article
    console.log('\n=== Running Query 6: Count Comments per Article ===');
    const query6 = await db.collection('comments').aggregate([
      {
        $group: {
          _id: '$article_id',
          commentCount: { $sum: 1 }
        }
      }
    ]).toArray();
    console.log('Results:', query6);
    console.log('Summary: Comment counts per article');

    // Query 7: Find Comments in 2023
    console.log('\n=== Running Query 7: Find Comments in 2023 ===');
    const query7 = await db.collection('comments').find({
      created_at: {
        $gte: new Date('2023-01-01'),
        $lte: new Date('2023-12-31')
      }
    }).toArray();
    console.log('Results:', query7.length, 'documents found');
    console.log('Sample result (first document, if any):', query7[0] || 'No results');

    // Query 8: Most Commented Articles
    console.log('\n=== Running Query 8: Most Commented Articles ===');
    const query8 = await db.collection('comments').aggregate([
      {
        $group: {
          _id: '$article_id',
          commentCount: { $sum: 1 }
        }
      },
      {
        $sort: { commentCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: '_id',
          as: 'article'
        }
      },
      {
        $unwind: '$article'
      },
      {
        $project: {
          title: '$article.title',
          commentCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query8);
    console.log('Summary: Top 5 articles by comment count');


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