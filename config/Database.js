const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.DB_URL)
    .then(console.log("DB Connection Successful ✅"))
    .catch((error) => {
        console.log("Error in Db connection");
        console.log(error);
        process.exit(1);
    })
}