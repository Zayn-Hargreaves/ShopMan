const { Client } = require("elasticsearch");
const config = require("../../config/index");

class ElasticsearchClient {
    constructor() {
        this.client = null;
        this.maxRetries = 5;
        this.retryDelay = 2000;
    }


    async initializeClient() {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                this.client = new Client({
                    host: config.elasticsearch.url, // URL Bonsai: "https://user:pass@cluster.bonsai.io",
                    log:"trace"
                });
                await this.client.ping();
                console.log(`Elasticsearch connected successfully`);
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
    static async getInstance() {
        if (!ElasticsearchClient.instance) {
            ElasticsearchClient.instance = new ElasticsearchClient()
            await ElasticsearchClient.instance.initializeClient()
        }
        return ElasticsearchClient.instance
    }
}

const elasticsearchClient = ElasticsearchClient.getInstance();

module.exports = {
    initElasticSearch: async () => {
        await elasticsearchClient;
        return elasticsearchClient
    },
    getClient: async () => (await elasticsearchClient).getClient(),
};