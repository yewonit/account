import express, { json } from "express"
import handler from "./errors/errors.js"
import { V1GatewayRouter } from "./router/apigateway.js"

const app = express()
const router = express.Router()
router.use("/v1", V1GatewayRouter)

app.use(json())

app.use("/health-check", (req, res) => {
	res.status = 200
	res.json("OK")
})

app.use(router)
app.use(handler)

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});

// 서버 실행
const port = process.env.PORT || 30000
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
