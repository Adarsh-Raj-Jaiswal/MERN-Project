// The server.js file acts as the central configuration and the starting point for a node.js application

// importing the exports from the app.js module
const app = require('./app');



// this is for dotenv which is used to access the config.env file
const dotenv = require('dotenv');
dotenv.config( // this method loads .env file contents into process.env
    {
        path: './backend/config/config.env' // providing path to config file
    }

);


// creating a connection to the database
const connectDatabase = require('./config/database');
connectDatabase(); // calling function to create connection




// this method is used to start the server
app.listen(process.env.PORT, () => {
    console.log(`Server working on http://localhost:${process.env.PORT}`);
});