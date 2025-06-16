let AddSchoolMiddleware = async (req, res, next) => {
    const tel = req.body.telefone;
    const email = req.body.email;
    const codigoPostal = req.body.codigoPostal

    const phoneRegex = /^9[1236][0-9]{7}$/;

    if (!tel || !phoneRegex.test(tel)) {
    return res.status(400).json({ message: 'Número de telemóvel inválido!' });
  }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email inválido!' });
    }

     const postalCodeRegex = /^\d{4}-\d{3}$/;

    if (!codigoPostal || !postalCodeRegex.test(codigoPostal)) {
    return res.status(400).json({ message: 'Código postal inválido! Use o formato 1234-567.' });
  }

  next()
}

module.exports = AddSchoolMiddleware