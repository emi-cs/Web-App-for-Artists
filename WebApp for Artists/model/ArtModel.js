//defining the ArtModel 

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let artSchema = Schema({
    name: {type:String,unique:true},
    artist:{type:Schema.Types.ObjectId,ref:'User'},
    year:String,
    category:String,
    medium:String,
    description:String,
    image:String,
    like:[{type:Schema.Types.ObjectId,ref:'User'}],
    reviews:[{type:Schema.Types.ObjectId,ref:'Review'}]
})

module.exports = mongoose.model('Art',artSchema);