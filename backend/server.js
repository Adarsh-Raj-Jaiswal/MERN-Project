// The server.js file acts as the central configuration and the starting point for a node.js application

// importing the exports from the app.js module
const app = require('./app');

// Handling Uncaught(unhandled) Exceptions

process // process object (globally availabe)
    .on( // this method is used to attach event handlers to the events
        'uncaughtException', err => {
            console.log(`Error: ${err.message}`);
            console.log('Shutting down the server due to Uncaught Exception');
            process.exit(1); // Terminates the Node.js process with an optional exit code. If no exit code is provided, the default exit code is 0, indicating a successful termination
        }
    );

// this is for dotenv which is used to access the config.env file
const dotenv = require('dotenv');
dotenv.config( // this method loads .env file contents into process.env (process object env property which we will use in our application because process is globally availabe)
    {
        path: './backend/config/config.env' // providing path to config file
    }

);
// i have seperated the env files to secure my sensitive data
dotenv.config({ path: './backend/config/passwords.env' }); // loading passwords in env variable

// creating a connection to the database
const connectDatabase = require('./config/database');
connectDatabase(); // calling function to create connection


const server = app.listen( // this method is used to start the server

    // port nubmer on the server will listen for incoming http requests
    process.env.PORT,
    // callback which will be called once the server is started (here used to perform logging)
    () => {
        console.log(`Server working on http://localhost:${process.env.PORT}`);
    });


// Unhandled Promise Rejection
process.on
    ('unhandledRejection', err => {
        console.log(`Error: ${err.message}`);
        console.log('Shutting down the server due to Unhandled Promise Rejection');

        server.close( // this method is used to stop the server

            // this callback function will be called after the server is fully closed
            () => {
                // terminates the Node.js process with an exit code of 1
                process.exit(1);
                //  It immediately terminates the Node.js process, bypassing any remaining code execution or cleanup tasks. It's generally recommended to perform necessary cleanup operations before calling 
            }
        );

    });