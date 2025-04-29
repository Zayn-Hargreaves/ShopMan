const { Sequelize } = require('sequelize'); // Thay @sequelize/core
const config = require('../../config/index.js');
const fs = require('fs');
const path = require('path');
const { InternalServerError } = require('../../cores/error.response.js');

class Database {
    constructor() {
        this.sequelize = null;
        this.isConnected = false;
    }

    async connect(type = 'postgres') {
        const dbUrl = config.db.url;
        this.sequelize = new Sequelize(dbUrl, {
            dialect: type,
            logging: (msg) => {
                console.log(`[DB]::${msg}`);
            },
            pool: {
                max: 5, // Giảm số kết nối tối đa cho Aiven free
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            dialectOptions: {
                ssl: {
                    require: true,
                    ca: fs.readFileSync(path.join(__dirname, '../../config/ca.pem')).toString(),
                    rejectUnauthorized: false
                }
            },
            retry: {
                max: 5,
                match: [
                    /ETIMEDOUT/,
                    /ECONNREFUSED/,
                    /SequelizeConnectionError/,
                ],
                backoffBase: 1000,
                backoffExponent: 1.5
            }
        });

        try {
            await this.sequelize.authenticate();
            this.isConnected = true;
            console.log("Connected to database successfully");
        } catch (error) {
            this.isConnected = false;
            console.error("Error Database Connection::", error);
            throw new InternalServerError("Failed to connect to database");
        }
    }

    getSequelize() {
        if (!this.isConnected || !this.sequelize) {
            throw new Error("Database not connected. Call connect() first.");
        }
        return this.sequelize;
    }

    async close() {
        if (this.sequelize && this.isConnected) {
            await this.sequelize.close();
            this.isConnected = false;
            console.log("Database connection closed gracefully");
        }
    }

    static async getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
            await Database.instance.connect();
        }
        return Database.instance;
    }
}

const instanceDatabase = Database.getInstance;
module.exports = instanceDatabase;