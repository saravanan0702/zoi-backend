const video = {};

const { getvideo } = require("../../model/video");

video.getCount = async (req, res, next) => {
    try{
        const data = await getvideo({});

        res.status(200).json({
            status: true,
            message: "success",
            data
        })
    }catch(e){
        next(e);
    }
}

module.exports = video;