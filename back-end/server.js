const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


let HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 5500;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// middleware for ALL routes
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { // finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; // figure out how many seconds elapsed
        console.log(`Request: ${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

// Use users routes
app.use('/users', require('./routes/users.routes'))

// Use atividades routes
app.use('/ativities', require('./routes/atividade.routes'))

// Use school router
app.use('/schools', require('./routes/school.routes'))

// Use Sessions router
app.use('/sessions', require('./routes/Session.routes'))

// Use Areas router
app.use('/areas', require('./routes/Area.routes'))

// Use Cloudinary router
app.use('/cloud', require('./routes/cloud.routes'))


//handle invalid routes (404)    
app.use((req, res, next) => {
    res.status(404).json({ message: `The requested resource was not found: ${req.method} ${req.originalUrl}` });
});

// error middleware (always at the end of the file)
app.use((err, req, res, next) => {
    // !Uncomment this line to log the error details to the server console!
    console.error(err);

    // error thrown by express.json() middleware when the request body is not valid JSON
    if (err.type === 'entity.parse.failed')
        return res.status(400).json({ error: 'Invalid JSON payload! Check if your body data is a valid JSON.' });

    // Sequelize validation errors (ALL models)
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // SequelizeDatabaseError related to an invalid ENUM value (USERS table -> role field)
    if (err.name === 'SequelizeDatabaseError') {
        if (err.original.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return res.status(400).json({
                error: 'Invalid value for enumerated field',
                message: err.message
            });
        }
        if (err.original.code === 'ER_BAD_NULL_ERROR') {
            return res.status(400).json({
                error: 'Missing mandatory field',
                message: err.message
            });
        }
        if (err.original.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                error: 'Duplicate entry',
                message: err.message
            });
        }
    }
    // other errors
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, HOST, (err) => {
    console.log(`YOUR SERVER IS RUNNING AT http://${HOST}:${PORT}`)
})


