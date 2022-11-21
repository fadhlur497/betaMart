const express = require("express")
const router = express.Router()
const Controller = require("../controller/controller")
const storerouter = require("./storerouter")
const employeesrouter = require("./employeesrouter")

router.get("/", (req, res) => {
    res.redirect("/stores")
})

router.use("/stores", storerouter)
router.use("/employees", employeesrouter)

module.exports = router