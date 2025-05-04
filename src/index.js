const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require("dotenv").config()

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
    console.error('ERROR:', err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
module.exports = app