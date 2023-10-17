const mongoose = require("mongoose");

const connectDB = async () => {
    const pro = await mongoose.connect(process.env.mongodb_uri);
    try {
        if (pro) console.log("Connected to MongoDB");
        else throw "error";
    }
    catch {
        console.log(pro);
    }
}

module.exports = connectDB;
