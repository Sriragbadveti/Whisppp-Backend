import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:5,
        maxlength:15
    },

    email:{
        type:String,
        required:true,
       
    },

    password:{
        type:String,
        required:true
    },

    profilePic:{
        type:String,
        
        default:""
    }
},{timestamps:true});

const User = mongoose.model("user" , userSchema);
export default User;