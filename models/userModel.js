const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: String, default: "" }
}, {
    timestamps: true
});

// http://res.cloudinary.com/dcwwq2hus/image/upload/v1697547710/jtxxn6lpez7npdwam5t9.png?

const User = mongoose.model("User", userSchema);

module.exports = User;