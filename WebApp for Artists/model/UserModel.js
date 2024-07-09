//defining the UserModel 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username:String,
    password:String,
    art:[{type:Schema.Types.ObjectId,ref:'Art'}],
    artist: {type:Boolean,default:false},
    following:[{type:Schema.Types.ObjectId,ref:'User'}],
    followers:[{type:Schema.Types.ObjectId,ref:'User'}],
    like:[{type:Schema.Types.ObjectId,ref:'Art'}],
    workshopOrganize:[{type:Schema.Types.ObjectId,ref:'Workshop'}],
    workshopAttend:[{type:Schema.Types.ObjectId,ref:'Workshop'}],
    reviews:[{type:Schema.Types.ObjectId,ref:'Art'}],
    notifications:[{art:{type:Schema.Types.ObjectId,ref:'Art'},notification:String}],
})

module.exports = mongoose.model('User',userSchema);