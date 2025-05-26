const db = require('../models/connect')
const Area = db.Area

const {ErrorHandler} = require('../utils/error')

let getAllAreas = async (req, res, next) => {
    try{
        const Areas = await Area.findAll({
            attributes: [`area_id`, `nome`, `descricao`]
        })
        if(!Areas){
            throw new ErrorHandler(404, `NO AREAS WERE FOUND!`)
        }
        const plainAreas = Areas.map(area => area.get({ plain: true }));
        return res.status(200).json({
            data: plainAreas
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllAreas,
    
}