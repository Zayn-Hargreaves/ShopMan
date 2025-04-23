const app = require("./src/index");
const { initRedis, closeRedis } = require("./src/db/rdb");
const {initElasticSearch} = require("./src/db/edb/edb")
const RepositoryFactory = require("./src/models/repositories/repositoryFactory")
const PORT = 3000;

async function startServer() {
    await initRedis();
    await initElasticSearch()
    await RepositoryFactory.initialize()
    const server = app.listen(PORT, () => {
        console.log(`server is listening on port ${PORT}`);
    });

    process.on("SIGINT", async () => {
        await closeRedis();
        server.close(() => console.log("Exit server"));
        process.exit(0);
    });
}

startServer();
// docker-compose up -d zookeeper kafka
// docker-compose stop apps redis rabbitmq postgres elasticsearch
