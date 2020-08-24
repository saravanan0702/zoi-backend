const video = require("./videoModel");

const videoService = {};

videoService.getvideo = (query) => video.aggregate([
    { $match: query },
    { $group: { _id: "$videoID", count: { $sum: 1 } } },
    { $sort: { count: 1 }}
]);

videoService.createOnevideo = (data) => video.create(data);


module.exports = videoService;