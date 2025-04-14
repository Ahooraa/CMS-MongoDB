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

    // Query 1: Find Likes for Specific Article
    console.log('\n=== Running Query 1: Find Likes for Specific Article ===');
    const query1 = await db.collection('likes').find({
      associated_id: new ObjectId('67ea2d85a142c7e7b2780d31'),
      target_type: 'article'
    }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find Likes by Specific User
    console.log('\n=== Running Query 2: Find Likes by Specific User ===');
    const query2 = await db.collection('likes').find({
      user_id: new ObjectId('67f3bb2f728e587d784b6100')
    }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Likes on Comments
    console.log('\n=== Running Query 3: Find Likes on Comments ===');
    const query3 = await db.collection('likes').find({
      target_type: 'comment'
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Count Likes per Article
    console.log('\n=== Running Query 4: Count Likes per Article ===');
    const query4 = await db.collection('likes').aggregate([
      {
        $match: { target_type: 'article' }
      },
      {
        $group: {
          _id: '$associated_id',
          likeCount: { $sum: 1 }
        }
      }
    ]).toArray();
    console.log('Results:', query4);
    console.log('Summary: Like counts per article');

    // Query 5: Users Liking Articles and Comments
    console.log('\n=== Running Query 5: Users Liking Articles and Comments ===');
    const query5 = await db.collection('likes').aggregate([
      {
        $group: {
          _id: '$user_id',
          targetTypes: { $addToSet: '$target_type' }
        }
      },
      {
        $match: {
          targetTypes: { $all: ['article', 'comment'] }
        }
      }
    ]).toArray();
    console.log('Results:', query5);
    console.log('Summary: Users who liked both articles and comments');

    // Query 6: Find Comment Likes by Specific User
    console.log('\n=== Running Query 6: Find Comment Likes by Specific User ===');
    const query6 = await db.collection('likes').find({
      target_type: 'comment',
      user_id: new ObjectId('67ea2d85a142c7e7b2780d34')
    }).toArray();
    console.log('Results:', query6.length, 'documents found');
    console.log('Sample result (first document, if any):', query6[0] || 'No results');

    // Query 7: Most Liked Articles
    console.log('\n=== Running Query 7: Most Liked Articles ===');
    const query7 = await db.collection('likes').aggregate([
      {
        $match: { target_type: 'article' }
      },
      {
        $group: {
          _id: '$associated_id',
          likeCount: { $sum: 1 }
        }
      },
      {
        $sort: { likeCount: -1 }
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
          likeCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query7);
    console.log('Summary: Top 5 articles by like count');


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