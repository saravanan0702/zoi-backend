const router = require("express").Router();

const video = require("./video");

router.use("/video", video);

module.exports = router;