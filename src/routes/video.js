const router = require("express").Router();

const { getCount } = require("../controller/video");

router.get("/", getCount);

module.exports = router;    