const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URL;

mongoose.connect(dbURI, { useUnifiedTopology: true })
.then(async () => {
    console.log('MongoDB connected ...')
})
.catch(err => console.log("Couldn't connect to MongoDB", err));

mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err}`);
})

module.exports = mongoose.connection;
