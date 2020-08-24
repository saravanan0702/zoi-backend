const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    videoID: {
        type: String,
    }
},{
    timestamps : true
});

module.exports = mongoose.model("video",videoSchema);