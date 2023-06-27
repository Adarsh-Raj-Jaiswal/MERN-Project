// this file is used to establish a connection with the database
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increased timeout value
};
 // creating a anonymous function and assigning it to connectDatabase variable
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, options) // this methods connects with the database written in the url (here DB_URI)
        .then((data) => { // if connection is successfull
            console.log(`Mongodb connected with server:${data.connection.host}`);
        })
        .catch((err) => { // if there is an error
            console.log(err);
        });
}

module.exports = connectDatabase;  // exporting the connectDatabase function used for creating a connection with the database