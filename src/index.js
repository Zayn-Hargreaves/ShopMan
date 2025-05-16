const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const {ErrorResponse}  = require('./cores/error.response');
require("dotenv").config()
const admin = require("./config/firebase")

if (process.env.mode === 'development') {
    app.use(cors())
} else {
    app.use(cors({
        origin: ["http://localhost:5173", "http://localhost:3000"]
    }))
}


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
app.use(compression())


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use("/api/v1/admin", require("./routes/admin/index"))
app.use("/api/v1", require("./routes/client/index"))

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof ErrorResponse) {
        return res.status(err.status).json({
            message: err.message,
            status: err.status
        });
    }
    console.error('Unexpected error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        status: 500
    });
});
module.exports = app