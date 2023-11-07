// Import required modules
const express = require('express');
const multer = require('multer');
const mongosse = require("mongoose");
const bodyParser = require('body-parser');
const userSchema = require('./model-schema/user-schema');
const cors = require('cors');

// Create Express application
const app = express();

app.use(cors());

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());


// Define a route for user registration
app.post('/api/users', async (req, res) => {
  try {
    console.log("recieved request");
    console.log(req.body);
    // Extract user data from the request body
    const data = await userSchema.find({ Email: req.body.email });
    if(data.length > 0) return res.status(400).json({ error: 'Email already exists' });
    // Create a new user instance
    const user = await userSchema.create({
        First_name: req.body.firstName,
        Last_name: req.body.lastName,
        Email: req.body.email,
        Password: req.body.password,
        Phone: req.body.phone,
        Address: req.body.address,
        Veh_plate: req.body.vehiclePlate,
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//get user by email
app.get('/api/users/:email', async (req, res) => {
  try {
    console.log("recieved request");
    console.log(req.params.email);
    // Extract user data from the request body
    const data = await userSchema.find({ Email: req.params.email });
    if(data.length == 0) return res.status(200).json({ error: 'Email does not exists' });
    // Send a success response
    res.status(400).json(data);
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Configure multer to store uploaded files in a specific directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('imageFile'), (req, res) => {
  // req.file contains information about the uploaded file
  console.log('Received photo:', req.file);
  res.send('Photo received successfully!');
});

// Start the Express server
const PORT = 3001; // You can change this port if needed
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
