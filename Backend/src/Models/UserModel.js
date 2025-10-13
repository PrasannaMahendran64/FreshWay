const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique: true,
        required: true
    },
    mobilenumber:{
        type:Number,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:16
    },
    otp:{
        type:String,
        min:6
    },
    otpExpiry:{
        type:Date
    },
    profileImage: {
        type: String, // store filename or URL
        default: "",  // default empty or use default avatar
    },
    address: {
        type: String,
        default: "",
    },
    isAdmin: { type: Boolean, default: false },
},{
    collection:"User"
}
)

const UserModel = mongoose.model("User",UserSchema)

module.exports = UserModel