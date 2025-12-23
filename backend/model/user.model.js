const mongoose = require('mongoose');
require("dotenv").config();
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 60,
        index: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        maxLength: 50
    },
    lastName: {
        type: String,
        maxLength: 50
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }

});
userSchema.methods.createHash = async function(plainText){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainText, salt);
};
userSchema.methods.validateHash = async function(candidatePasword){
    return await bcrypt.compare(candidatePasword,this.password);
}

module.exports = mongoose.model("User", userSchema);
