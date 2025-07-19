const logger = require('./index');
const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
    req.id = uuidv4();
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`HTTP ${method} ${originalUrl}`, {
            requestId: req.id,
            context: 'HTTP',
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });

    next();
};

module.exports = requestLogger;
