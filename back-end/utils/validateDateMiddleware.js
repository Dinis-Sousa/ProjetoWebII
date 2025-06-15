let validateDateMiddleware = (req, res, next) => {
  const inputDate = req.body.dataInicio;
  const inputDate1 = req.body.dataFim;

  if (!inputDate) {
    return res.status(400).json({ error: 'Missing starting date field.' });
  }
  else if(!inputDate1){
    return res.status(400).json({ error: 'Missing ending date field.' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // clear time
  const input = new Date(inputDate);
  input.setHours(0, 0, 0, 0); // just compare dates
  const input1 = new Date(inputDate1);
  input1.setHours(0, 0, 0, 0); // just compare dates

  if (isNaN(input.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  if (input < today) {
    return res.status(400).json({ error: 'The starting date must be a possible date!' });
  }

  if(input1 < input) {
    return res.status(400).json({ error: 'Ending date needs to be later than the starting date!' });
  }

  next();
};

module.exports = validateDateMiddleware