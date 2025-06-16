const db = require('../models/connect.js'); 
const Atividade = db.Atividade;

let validadeDateAndHour = async (req, res, next) => {
    const atividade_id = req.body.atividade_id;
    const dataMarcada = req.body.dataMarcada;

    try {
        const ativityDates = await Atividade.findOne({
            attributes: ['dataInicio', 'dataFim'],
            where: {
                atividade_id: atividade_id
            }
        });

        if (!ativityDates) {
            return res.status(404).json({ error: 'Atividade not found' });
        }

        console.log(ativityDates.dataInicio)
        console.log(ativityDates.dataFim)

        const dateStart = new Date(ativityDates.dataInicio);
        dateStart.setHours(0, 0, 0, 0); 

        const dateEnd = new Date(ativityDates.dataFim);
        dateEnd.setHours(0, 0, 0, 0); 

        const dateToCheck = new Date(dataMarcada);
        dateToCheck.setHours(0, 0, 0, 0); 

        if (dateToCheck >= dateStart && dateToCheck <= dateEnd) {
            return next();
        } else {
            return res.status(400).json({
                error: 'Data marcada está fora do intervalo permitido.'
            });
        }
    } catch (error) {
        console.error('Erro ao validar datas:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor ao validar datas.'
        });
    }
};


module.exports = validadeDateAndHour;