const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
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


require("./db/dbs/associations")
require("./db/edb/edb")

// app.use("/api/v1/admin", require("./routes/admin/index"))
// app.use("/api/v1", require("../routes/client"))
// app.get('/', (req, res) => console.log(req.body))

module.exports = app