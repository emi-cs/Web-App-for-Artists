//defining the ReviewModel 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
    username:String,
    user:{type:Schema.Types.ObjectId,ref:'User'},
    review:String,
    art:{type:Schema.Types.ObjectId,ref:'Art'}
})

module.exports = mongoose.model('Review',reviewSchema);