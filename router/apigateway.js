import { Router } from "express"
import RefreshRouter from "./refresh.js"
import TokenRouter from "./token.js"
import VerifyRouter from "./expire_check.js"

const v1router = Router()

v1router.use(TokenRouter)
v1router.use(RefreshRouter)
v1router.use(VerifyRouter)

export { v1router as V1GatewayRouter }
