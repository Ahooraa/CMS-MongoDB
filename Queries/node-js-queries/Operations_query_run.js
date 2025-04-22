const { MongoClient } = require('mongodb');

// Connection string and database name
const uri = 'mongodb+srv://ahoora:mongo@cluster1.lbzxf.mongodb.net/';
const dbName = 'CMS_db';

async function runQueries() {
  const client = new MongoClient(uri); // Removed deprecated options

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Successfully connected to MongoDB');

    // Select the database
    const db = client.db(dbName);

    // Query 1: Selection: Find all active users
    console.log('\n=== Running Query 1: Find All Active Users ===');
    const query1 = await db.collection('users').find({
      is_active: true
    }).toArray();
    console.log('Results:', query1.length, 'documents found');
    console.log('Sample result (first document, if any):', query1[0] || 'No results');

    // Query 2: Projection: Get only username and email from users
    console.log('\n=== Running Query 2: Get Only Username and Email from Users ===');
    const query2 = await db.collection('users').find({}, { projection: { username: 1, email: 1, _id: 0 } }).toArray();
    console.log('Results:', query2.length, 'documents found');
    console.log('Fields returned in first document:', query2[0] ? Object.keys(query2[0]) : 'No results');
    console.log('Sample result (first document, if any):', query2[0] || 'No results');

    //3. Rename: Rename 'age' field to 'user_age' (Updating the field name in the database)
    console.log('\n=== Running Query 3: Rename "age" Field to "user_age" ===');
    single_user= await db.collection("users").findOne({username:"johndoe"}, {projection:{username:1,age:1,user_age:1}});
    console.log(single_user);
    db.collection("users").updateOne({username:"johndoe"}, {$rename:{"age":"user_age"}});    
    console.log('Renamed field "age" to "user_age" for user "johndoe"');
    first_three_activeUsers = await db.collection('users').find({ is_active: true },{projection:{username:1,age:1,user_age:1}}).limit(3).toArray();
    console.log('first three active users:', first_three_activeUsers|| 'No results');

    // Query 4: Union: Combine active users and users who have Persian language in userSettings
    console.log('\n=== Running Query 4: Combine Active Users and Users with Persian Language in userSettings ===');
    const query4 = await db.collection('users').aggregate([
      {
        $match: { is_active: true }
      },
      {
        $project: {
          _id: 1,
          username: 1, // Changed from fullname to match CMS_db.users.json
          source: { $literal: 'active_users' }
        }
      },
      {
        $unionWith: {
          coll: 'userSettings',
          pipeline: [
            { $match: { language: 'fa' } },
            {
              $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_info'
              }
            },
            { $unwind: '$user_info' },
            {
              $project: {
                _id: '$user_id',
                username: '$user_info.username', // Changed from fullname
                source: { $literal: 'fa_language_users' }
              }
            }
          ]
        }
      }
    ]).toArray();
    console.log('Results:', query4.length, 'documents found');
    console.log('Sample result (first document, if any):', query4[0] || 'No results');

    // Query 5: Cartesian Product: Combine each user with all tags
    console.log('\n=== Running Query 5: Cartesian Product of Media and Categories ===');
    console.log('number of documents in media:', await db.collection('media').countDocuments());
    console.log('number of documents in categories:', await db.collection('categories').countDocuments());
    //5. Cartesian Product: Combine each media with all categories (no join condition = cartesian product)
    const cp_result = await db.collection('media').aggregate([
      {
        // Perform a lookup to join with categories, using a pipeline to include all categories
        $lookup: {
          from: 'categories',
          let: {}, // No variables needed since no matching condition
          pipeline: [
            {
              $match: {} // Match all documents in categories (no condition)
            }
          ],
          as: 'category'
        }
      },
      {
        // Unwind the category array to create a document for each media-category pair
        $unwind: '$category'
      },
      {
        // Project the desired fields from both collections
        $project: {
          media_id: '$_id',
          file_url: 1,
          media_type: 1,
          category_id: '$category._id',
          category_name: '$category.name',
          parent_id: '$category.parent_id',
          _id: 0 // Exclude the _id field from the final output
        }
      }
    ]).toArray();
    console.log('Results:', cp_result.length, 'documents found as a cartesian product of media and categories');
    // first 3 results
    console.log('Sample result (first 3 documents):', cp_result.slice(0, 3) || 'No results');

    // Query 6: Difference: Find users who do NOT have a corresponding profile in userSettings
    console.log('\n=== Running Query 6: Find Users Who Do NOT Have a Corresponding Profile in userSettings ===');
    const query6 = await db.collection('users').aggregate([
      {
        $lookup: {
          from: 'userSettings',
          localField: '_id',
          foreignField: 'user_id',
          as: 'settings'
        }
      },
      {
        $match: { settings: { $eq: [] } }
      }
    ]).toArray();
    console.log('Results:', query6.length, 'documents found');
    console.log('Sample result (first document, if any):', query6[0] || 'No results');

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