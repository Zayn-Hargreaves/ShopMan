const { Client } = require("elasticsearch");
const config = require("../../config/index");

class ElasticsearchClient {
    constructor() {
        if (!ElasticsearchClient.instance) {
            this.client = null;
            this.maxRetries = 5;
            this.retryDelay = 2000;
            ElasticsearchClient.instance = this;
            this.initializeClient();
        }
        return ElasticsearchClient.instance;
    }

    async initializeClient() {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                this.client = new Client({
                    host: config.elasticsearch.url, // URL Bonsai: "https://user:pass@cluster.bonsai.io"
                    log:"trace"
                });
                await this.client.ping();
                console.log(`Elasticsearch connected successfully to ${config.elasticsearch.url}`);
                break;
            } catch (error) {
                retries++;
                console.error(`Elasticsearch connection failed (attempt ${retries}/${this.maxRetries}):`, error.message);
                if (retries === this.maxRetries) {
                    throw new Error(`Failed to connect to Elasticsearch after ${this.maxRetries} retries`);
                }
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
    }

    getClient() {
        if (!this.client) {
            throw new Error("Elasticsearch client is not initialized");
        }
        return this.client;
    }
}

const elasticsearchClient = new ElasticsearchClient();

module.exports = {
    getClient: () => elasticsearchClient.getClient(),
};