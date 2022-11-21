const express = require("express")
const router = express.Router()
const Controller = require("../controller/controller")

router.get("/", Controller.renderhomeemployee)
// router.get('/add', Controller.renderadd)
// router.post('/add', Controller.handleadd)

module.exports = router