const passportLocalMongoose = require("passport-local-mongoose")
import Schema from "./configModels"
const mongoose = require('mongoose')
const UserSchema = new Schema({
    // Username
    name:{type:String,maxLength:20,required:true},
    // Flaga czy jest adminem
    admin:{type:Boolean,required:false},
    // Email
    email:{type:String,required:true,maxLength:40,},
    // Plan głowny użytkownika
    plan:{type:Schema.Types.ObjectId,ref:"Plan",required:false},
    // Ranga użytkownika
    profileRank:{type:String,required:false},
    // Avatar użytkownika
    avatar:{type:String,required:false},
},{
    timestamps:true
})

UserSchema.plugin(passportLocalMongoose,{usernameField:'name'})
const User = mongoose.model('User',UserSchema)
export default User
module.exports = User