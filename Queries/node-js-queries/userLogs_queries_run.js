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

    // Query 1: Find Logs for Specific User
    console.log('\n=== Running Query 1: Find Logs for Specific User ===');
    const query1 = await db.collection('userLogs').find({
      user_id: new ObjectId('67ea2b41a142c7e7b2780d28')
    }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find Login Actions
    console.log('\n=== Running Query 2: Find Login Actions ===');
    const query2 = await db.collection('userLogs').find({
      action: 'login'
    }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Logs from January 2023
    console.log('\n=== Running Query 3: Find Logs from January 2023 ===');
    const query3 = await db.collection('userLogs').find({
      datetime: {
        $gte: new Date('2023-01-01T00:00:00Z'),
        $lt: new Date('2023-02-01T00:00:00Z')
      }
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Sort Logs by Date Descending
    console.log('\n=== Running Query 4: Sort Logs by Date Descending ===');
    const query4 = await db.collection('userLogs').find().sort({ datetime: -1 }).toArray();
    console.log('Results:', query4.length, 'documents found');
    console.log('Sample result (first document, if any):', query4[0] || 'No results');

    // Query 5: Find Users Who Edited Articles
    console.log('\n=== Running Query 5: Find Users Who Edited Articles ===');
    const query5 = await db.collection('userLogs').distinct('user_id', { action: 'edit_article' });
    console.log('Results:', query5);
    console.log('Summary: Unique user IDs who edited articles');

    // Query 6: Count Actions by Type
    console.log('\n=== Running Query 6: Count Actions by Type ===');
    const query6 = await db.collection('userLogs').aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    console.log('Results:', query6);
    console.log('Summary: Counts of each action type');

    // Query 7: Most Active Users by Log Count
    console.log('\n=== Running Query 7: Most Active Users by Log Count ===');
    const query7 = await db.collection('userLogs').aggregate([
      {
        $group: {
          _id: '$user_id',
          logCount: { $sum: 1 }
        }
      },
      {
        $sort: { logCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          username: '$user.username',
          logCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query7);
    console.log('Summary: Top 5 users by log count');

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