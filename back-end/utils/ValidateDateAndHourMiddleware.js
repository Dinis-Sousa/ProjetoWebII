const db = require('../models/connect.js'); 
const Atividade = db.Atividade;

let validateDateAndHour = async (req, res, next) => {
    const atividade_id = req.body.atividade_id;
    const dataMarcada = req.body.dataMarcada;
    const horaMarcada = req.body.horaMarcada
    try{
        const [hour, minute, second] = horaMarcada.split(':').map(Number);

        // Verifica se algum dos valores não é um número
        if (
            isNaN(hour) || isNaN(minute) || isNaN(second) ||
            hour < 0 || hour > 23 ||
            minute < 0 || minute > 59 ||
            second < 0 || second > 59
        ) {
            throw new Error('Invalid time format');
        }


        // Check time boundaries
        const totalSeconds = hour * 3600 + minute * 60 + second;
        const start = 9 * 3600;    // 09:00:00
        const end = 18 * 3600;     // 18:00:00

        if (totalSeconds < start || totalSeconds > end) {
            return res.status(403).json({ error: 'Time must be between 09:00:00 and 18:00:00' });
        }

    } catch (err){
        return res.status(500).json({
            error: 'Erro interno do servidor ao validar a hora.'
        });
    }

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
    } catch (err) {
        return res.status(500).json({
            error: 'Erro interno do servidor ao validar datas.'
        });
    }
};


module.exports = validateDateAndHour;