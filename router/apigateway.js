import { Router } from "express"
import { RefreshRouter } from "./refresh.js"
import { TokenRouter } from "./token.js"

const v1router = Router()

v1router.use(TokenRouter)
v1router.use(RefreshRouter)

export { v1router as V1GatewayRouter }
