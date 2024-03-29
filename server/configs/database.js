'use-strict';

const mongoose = require('mongoose');
const dbName = 'abwasser-express-db';
const mongoUri = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;

// connect to db (We use connect as we only have one db)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;

// Log erros and connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the database (${mongoUri})`);
});
