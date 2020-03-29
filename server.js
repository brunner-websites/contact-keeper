const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect to Database
connectDB();

// Init Middleware (allow to send and receive JSON data)
app.use(express.json({ extended: false }));


// app.get('/', (req, res) => res.json({ msg: "Welcome to the contact keeper API" }));


// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// Serve static assets in production (react)
if (process.env.node_env === 'production') {
  // Set static folder (static react assets)
  app.use(express.static('client/build'));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));

}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));