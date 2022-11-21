const express = require("express")
const router = express.Router()
const Controller = require("../controller/controller")

router.get("/", Controller.renderhome)
router.get('/add', Controller.renderadd)
router.post('/add', Controller.handleadd)
router.get('/:id', Controller.getStoreId)
router.get('/:id/employees/add', Controller.formAddEmployee)
router.post('/:id/employees/add', Controller.addEmployee)
router.get('/:id/employees/:employeeId/edit', Controller.formEditEmployee)
router.post('/:id/employees/:employeeId/edit', Controller.editEmployee)
router.get('/:id/employees/:employeeId/delete', Controller.deleteEmployee)
module.exports = router