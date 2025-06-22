const db = require('../models/connect.js'); 
const Atividade = db.Atividade;

const validateDateAndHour = async (req, res, next) => {
    const { atividade_id, dataMarcada, horaMarcada } = req.body;

    try {
        // Validar hora
        const [hour, minute, second = 0] = horaMarcada.split(':').map(Number);

        if (
            isNaN(hour) || isNaN(minute) ||
            hour < 0 || hour > 23 ||
            minute < 0 || minute > 59
        ) {
            return res.status(500).json({
                error: 'Erro interno do servidor ao validar a hora.'
            });
        }

        const totalSeconds = hour * 3600 + minute * 60 + second;
        const start = 9 * 3600;
        const end = 18 * 3600;

        if (totalSeconds < start || totalSeconds > end) {
            return res.status(403).json({
                error: 'Time must be between 09:00:00 and 18:00:00'
            });
        }

        // Validar data
        const atividade = await Atividade.findOne({
            attributes: ['dataInicio', 'dataFim'],
            where: { atividade_id }
        });

        if (!atividade) {
            return res.status(404).json({
                error: 'Atividade not found'
            });
        }

        const dateStart = new Date(atividade.dataInicio);
        const dateEnd = new Date(atividade.dataFim);
        const dateToCheck = new Date(dataMarcada);

        dateStart.setHours(0, 0, 0, 0);
        dateEnd.setHours(0, 0, 0, 0);
        dateToCheck.setHours(0, 0, 0, 0);

        if (dateToCheck < dateStart || dateToCheck > dateEnd) {
            return res.status(400).json({
                error: 'Data marcada está fora do intervalo permitido.'
            });
        }

        // Tudo válido
        return next();

    } catch (err) {
        return res.status(500).json({
            error: 'Erro interno do servidor ao validar datas ou hora.'
        });
    }
};

module.exports = validateDateAndHour;
