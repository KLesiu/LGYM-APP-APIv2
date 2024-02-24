const passportLocalMongoose = require("passport-local-mongoose")
import Schema from "./configModels"
const mongoose = require('mongoose')
const UserSchema = new Schema({
    name:{type:String,maxLength:20,required:true},
    admin:{type:Boolean,required:false},
    email:{type:String,required:true,maxLength:40,},
    rank:{type:String,required:false},
    plan:{type:Schema.Types.ObjectId,ref:"Plan",required:false},
    Sq: {type:Number,required:false},
    Dl: {type:Number,required:false},
    Bp: {type:Number,required:false},
    profileRank:{type:String,required:false}



},{
    timestamps:true
})

UserSchema.plugin(passportLocalMongoose,{usernameField:'name'})
const User = mongoose.model('User',UserSchema)
export default User
module.exports = User