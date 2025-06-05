import express from "express"
import { getViewership } from "../controllers/viwershipController"

const router = express.Router()

router.get("/get", getViewership)

export default router