import mongoose from "mongoose";

const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {type:String, required:true},
    email: {type:String, unique:true, required:true},
    password: {type:String, required:true},
    creditBalance: {type:Number, default: 5},
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

