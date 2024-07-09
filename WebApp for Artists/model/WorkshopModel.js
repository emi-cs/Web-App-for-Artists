const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let workshopSchema = Schema({
    title:String,
    attendee:[{type:Schema.Types.ObjectId,ref:'User'}],
})

module.exports = mongoose.model('Workshop',workshopSchema);