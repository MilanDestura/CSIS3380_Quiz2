const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a Schema
const studentSchema = new mongoose.Schema({
    myName: String,
    mySID: String
});

// Define a Model
const Student = mongoose.model('s24students', studentSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/form.html");
});

app.post('/', async (req, res) => {
    try {
        // Get data from the form
        const { myuri } = req.body;

        // Connect to MongoDB with provided URI
        await mongoose.connect(myuri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Log connection
        console.log(`Connected to MongoDB at ${myuri}`);

        // Example: Add a document to the collection 's24students'
        const newStudent = new Student({
            myName: "Milan Destura",
            mySID: "300370571"
        });

        // Save document to MongoDB
        await newStudent.save();

        // Send response to user
        res.send(`<h1>Document Added</h1>`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding document');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
