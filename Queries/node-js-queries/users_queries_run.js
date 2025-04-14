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

    // Query 1: Find Active Users
    console.log('\n=== Running Query 1: Find Active Users ===');
    const query1 = await db.collection('users').find({
      is_active: true
    }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find Admin Users
    console.log('\n=== Running Query 2: Find Admin Users ===');
    const query2 = await db.collection('users').find({
      role: 'admin'
    }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Users Over 40
    console.log('\n=== Running Query 3: Find Users Over 40 ===');
    const query3 = await db.collection('users').find({
      age: { $gt: 40 }
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Sort Users by Join Date
    console.log('\n=== Running Query 4: Sort Users by Join Date ===');
    const query4 = await db.collection('users').find().sort({ join_date: 1 }).toArray();
    console.log('Results:', query4.length, 'documents found');
    console.log('Sample result (first document, if any):', query4[0] || 'No results');

    // Query 5: Find Users with Favorite Articles
    console.log('\n=== Running Query 5: Find Users with Favorite Articles ===');
    const query5 = await db.collection('users').find({
      'reader_info.favorite_articles': { $exists: true, $ne: [] }
    }).toArray();
    console.log('Results:', query5.length, 'documents found');
    console.log('Sample result (first document, if any):', query5[0] || 'No results');

    // Query 6: Find Admins with Manage Users Permission
    console.log('\n=== Running Query 6: Find Admins with Manage Users Permission ===');
    const query6 = await db.collection('users').find({
      role: 'admin',
      'admin_info.permissions': { $in: ['manage_users'] }
    }).toArray();
    console.log('Results:', query6.length, 'documents found');
    console.log('Sample result (first document, if any):', query6[0] || 'No results');

    // Query 7: Count Users by Role
    console.log('\n=== Running Query 7: Count Users by Role ===');
    const query7 = await db.collection('users').aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    console.log('Results:', query7);
    console.log('Summary: Counts of users by role');

    // Query 8: Find Users Registered After 2023
    console.log('\n=== Running Query 8: Find Users Registered After 2023 ===');
    const query8 = await db.collection('users').find({
      join_date: { $gt: new Date('2023-01-01T00:00:00Z') } // Using join_date as registration_date
    }).toArray();
    console.log('Results:', query8.length, 'documents found');
    console.log('Sample result (first document, if any):', query8[0] || 'No results');

    // Query 9: Average Age by Role
    console.log('\n=== Running Query 9: Average Age by Role ===');
    const query9 = await db.collection('users').aggregate([
      {
        $group: {
          _id: '$role',
          averageAge: { $avg: '$age' }
        }
      }
    ]).toArray();
    console.log('Results:', query9);
    console.log('Summary: Average age of users by role');

    // Query 10: New Users Who Edited Articles
    console.log('\n=== Running Query 10: New Users Who Edited Articles ===');
    const query10 = await db.collection('users').aggregate([
      {
        $match: {
          join_date: { $gte: new Date('2023-01-01T00:00:00Z') }
        }
      },
      {
        $lookup: {
          from: 'userLogs',
          localField: '_id',
          foreignField: 'user_id',
          as: 'logs'
        }
      },
      {
        $match: { 'logs.action': 'edit_article' }
      },
      {
        $project: { username: 1, join_date: 1 }
      }
    ]).toArray();
    console.log('Results:', query10);
    console.log('Summary: Users joined in 2023 who edited articles');

    // Query 11: Users with Similar Activity Profiles
    console.log('\n=== Running Query 11: Users with Similar Activity Profiles ===');
    const query11 = await db.collection('users').aggregate([
      {
        $lookup: {
          from: 'userLogs',
          localField: '_id',
          foreignField: 'user_id',
          as: 'logs'
        }
      },
      {
        $project: {
          username: 1,
          actionProfile: {
            login: {
              $sum: {
                $map: {
                  input: '$logs',
                  as: 'log',
                  in: { $cond: [{ $eq: ['$$log.action', 'login'] }, 1, 0] }
                }
              }
            },
            view: {
              $sum: {
                $map: {
                  input: '$logs',
                  as: 'log',
                  in: { $cond: [{ $eq: ['$$log.action', 'view_article'] }, 1, 0] }
                }
              }
            },
            comment: {
              $sum: {
                $map: {
                  input: '$logs',
                  as: 'log',
                  in: { $cond: [{ $eq: ['$$log.action', 'comment'] }, 1, 0] }
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$actionProfile',
          users: { $push: '$username' }
        }
      },
      {
        $match: { 'users.1': { $exists: true } }
      }
    ]).toArray();
    console.log('Results:', query11);
    console.log('Summary: Users grouped by similar action profiles');

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