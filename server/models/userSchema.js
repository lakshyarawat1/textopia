import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    userName: { type : String, unique  : true },
    password: String,
    
}, { timestamps: true })

const UserModel = mongoose.model('User', UserSchema)

export default UserModel