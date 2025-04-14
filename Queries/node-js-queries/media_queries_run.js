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

    // Query 1: Find Image Media
    console.log('\n=== Running Query 1: Find Image Media ===');
    const query1 = await db.collection('media').find({
      media_type: 'image'
    }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find Media by Specific User
    console.log('\n=== Running Query 2: Find Media by Specific User ===');
    const query2 = await db.collection('media').find({
      uploaded_by: new ObjectId('67ea2b41a142c7e7b2780d28')
    }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Large Media Files
    console.log('\n=== Running Query 3: Find Large Media Files ===');
    const query3 = await db.collection('media').find({
      file_size: { $gt: 3000 }
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Sort Media by Upload Date
    console.log('\n=== Running Query 4: Sort Media by Upload Date ===');
    const query4 = await db.collection('media').find().sort({ uploaded_date: -1 }).toArray();
    console.log('Results:', query4.length, 'documents found');
    console.log('Sample result (first document, if any):', query4[0] || 'No results');

    // Query 5: Find Long Videos
    console.log('\n=== Running Query 5: Find Long Videos ===');
    const query5 = await db.collection('media').find({
      media_type: 'video',
      duration: { $gt: 120 }
    }).toArray();
    console.log('Results:', query5.length, 'documents found');
    console.log('Sample result (first document, if any):', query5[0] || 'No results');

    // Query 6: Count Media by Type
    console.log('\n=== Running Query 6: Count Media by Type ===');
    const query6 = await db.collection('media').aggregate([
      {
        $group: {
          _id: '$media_type',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    console.log('Results:', query6);
    console.log('Summary: Counts of media items by type');

    // Query 7: Top Media Uploaders
    console.log('\n=== Running Query 7: Top Media Uploaders ===');
    const query7 = await db.collection('media').aggregate([
      {
        $group: {
          _id: '$uploaded_by',
          mediaCount: { $sum: 1 }
        }
      },
      {
        $sort: { mediaCount: -1 }
      },
      {
        $limit: 3
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
          mediaCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query7);
    console.log('Summary: Top 3 users by media upload count');

    // Query 8: Find Unused Media
    console.log('\n=== Running Query 8: Find Unused Media ===');
    const query8 = await db.collection('media').aggregate([
      {
        $lookup: {
          from: 'articles',
          let: { mediaId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $and: [{ $isArray: '$media_ids' }, { $in: ['$$mediaId', '$media_ids'] }] }
              }
            }
          ],
          as: 'articleRefs'
        }
      },
      {
        $match: { articleRefs: { $size: 0 } }
      },
      {
        $project: {
          filename: 1,
          uploaded_date: 1
        }
      }
    ]).toArray();
    console.log('Results:', query8);
    console.log('Summary: Media not linked to any articles');

    // Query 9: Media Upload Trends
    console.log('\n=== Running Query 9: Media Upload Trends ===');
    const query9 = await db.collection('media').aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$uploaded_date' },
            month: { $month: '$uploaded_date' }
          },
          uploadCount: { $sum: 1 },
          totalSize: { $sum: '$file_size' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]).toArray();
    console.log('Results:', query9);
    console.log('Summary: Media uploads and total size by month');

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