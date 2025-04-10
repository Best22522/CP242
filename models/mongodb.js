const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://08042025g:08042025g@mongodatabase.x05kgnr.mongodb.net/?retryWrites=true&w=majority&appName=MongoDatabase';

// Replace <db_password> with your actual password or use environment variables for security
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    return client.db('MongoDatabase'); // Replace with your actual DB name
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

module.exports = connectDB;
