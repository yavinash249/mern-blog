const mongoose  = require('mongoose');

// post type and schema information
const Schema= mongoose.Schema;
const PostSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('POST', PostSchema)