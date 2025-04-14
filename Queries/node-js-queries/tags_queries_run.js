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

    // Query 1: Find Machine Learning Tag
    console.log('\n=== Running Query 1: Find Machine Learning Tag ===');
    const query1 = await db.collection('tags').find({
      name: 'Machine Learning'
    }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Find All Tags
    console.log('\n=== Running Query 2: Find All Tags ===');
    const query2 = await db.collection('tags').find().toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    // Query 3: Find Tags Starting with C
    console.log('\n=== Running Query 3: Find Tags Starting with C ===');
    const query3 = await db.collection('tags').find({
      name: { $regex: '^C', $options: 'i' } // Case-insensitive for robustness
    }).toArray();
    console.log('Results:', query3.length, 'documents found');
    console.log('Sample result (first document, if any):', query3[0] || 'No results');

    // Query 4: Find Tags Used in Articles
    console.log('\n=== Running Query 4: Find Tags Used in Articles ===');
    const query4 = await db.collection('articles').aggregate([
      {
        $unwind: '$tags'
      },
      {
        $group: { _id: '$tags' }
      },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tag'
        }
      },
      {
        $unwind: '$tag'
      },
      {
        $project: { name: '$tag.name' }
      }
    ]).toArray();
    console.log('Results:', query4);
    console.log('Summary: Tags associated with at least one article');

    // Query 5: Count Articles per Tag
    console.log('\n=== Running Query 5: Count Articles per Tag ===');
    const query5 = await db.collection('articles').aggregate([
      {
        $unwind: '$tags'
      },
      {
        $group: {
          _id: '$tags',
          articleCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tag'
        }
      },
      {
        $unwind: '$tag'
      },
      {
        $project: {
          name: '$tag.name',
          articleCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query5);
    console.log('Summary: Number of articles per tag');

    // Query 6: Most Popular Tags
    console.log('\n=== Running Query 6: Most Popular Tags ===');
    const query6 = await db.collection('articles').aggregate([
      {
        $unwind: '$tags'
      },
      {
        $group: {
          _id: '$tags',
          articleCount: { $sum: 1 }
        }
      },
      {
        $sort: { articleCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tag'
        }
      },
      {
        $unwind: '$tag'
      },
      {
        $project: {
          name: '$tag.name',
          articleCount: 1
        }
      }
    ]).toArray();
    console.log('Results:', query6);
    console.log('Summary: Top 5 tags by article count');

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