import express, { json } from "express"
import { V1GatewayRouter } from "./router/apigateway.js"
import { initDatabase } from "./utils/mysql.js"

const app = express()
const router = express.Router()
router.use("/v1", V1GatewayRouter)

app.use(json())

await initDatabase()

app.use("/health-check", (req, res) => {
	res.status = 200
	res.json("OK")
})

app.use(router)

// 서버 실행
const port = process.env.PORT || 30000
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
