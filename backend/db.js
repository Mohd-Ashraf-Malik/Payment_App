const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connected');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB Error:', err);
});

mongoose.connect(process.env.DB_URL);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 60
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

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const transactionSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to:{
        type:String,
        required: true
    },
    amount:{
        type:Number,
        required: true
    },
    timestamp:{
        type: Number,
        required: true
    }
});
const User = new mongoose.model("User",userSchema);
const Account = new mongoose.model("Account",accountSchema);
const Transaction = new mongoose.model("Transaction",transactionSchema);
module.exports = {
    User,
    Account,
    Transaction,
    mongoose
}