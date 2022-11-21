const { Stores, Employees } = require("../models/index")
const { Op, where } = require("sequelize");
const convertSalary = require("../helpers/convertSalary")

class Controller {
    static renderhome(request, response) {
        Stores.findAll()
            .then((data) => {
                response.render('home', { data })
            })
            .catch((hasilReject) => {
                response.send(hasilReject)
            })
    }
    static renderadd(request, response) {
        const errors = request.query.errors
                response.render('addfrom', { errors })
    }

    static handleadd(request, response) {
        let fillForm = request.body
        Stores.create(fillForm)
            .then(() => {
                response.redirect('/')
            })
            .catch((err) => {
                if (err.name == "SequelizeValidationError") {
                    err = err.errors.map(el => el.message)
                }
                // console.log(err);
                response.redirect(`/stores/add?errors=${err}`)
                // response.send(err)
                // console.log(err);
            })
    }
    static getStoreId(request, response) {
        let sum = 0
        let id = +request.params.id
        Stores.findByPk(id, {
            attributes: ['id', 'name', 'code'],
            include: {
                model: Employees,
                attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'education', 'position', 'salary']
            }
        })
            .then((data) => {
                for (const key of data.dataValues.Employees) {
                    sum += key.salary
                }
                response.render('storebyid', { data, convertSalary, sum })
            })
            .catch((err) => {
                response.send(err)
                console.log(err);
            })
    }
    /////////employee///////
    static renderhomeemployee(request, response) {
        let { position } = request.query
        let data = ""
        Employees.findAll({
            include: {
                model: Stores,
                attributes: ['code', 'id']
            }
        })
            .then((cek) => {
                data = cek
                if (position) {
                    return Employees.getEmployeesByPosition(position)
                } else {
                    response.render('employees', { data, convertSalary })
                    // response.send(data)
                }
            })
            .then((data) => {
                response.render('employees', { data, convertSalary })
            })
            .catch((hasilReject) => {
                response.send(hasilReject)
                // console.log(hasilReject);
            })
    }

    /////////////add get employee//////////////
    static formAddEmployee(request, response) {
        const errors = request.query.errors
        let id = +request.params.id
        Stores.findByPk(id)
            .then((data) => {
                response.render('addformemployee', { data, errors})
            })
            .catch((err) => {
                response.send(err)
                console.log(err);
            })
    }

    ////////////add Post employee///////////////// 
    static addEmployee(request, response) {
        let StoreId = request.params.id

        let { firstName, lastName, dateOfBirth, education, position, salary } = request.body
        console.log(request.body);
        Employees.create({ firstName, lastName, dateOfBirth, education, position, salary, StoreId })
            .then((data) => {
                response.redirect(`/stores/${StoreId}`)
            })
            .catch((err) => {
                if (err.name == "SequelizeValidationError") {
                    err = err.errors.map(el => el.message)
                }
                // console.log(err);
                response.redirect(`/stores/${StoreId}/employees/add?errors=${err}`)
                // response.send(err)
                // console.log(err);
            })
    }
    //////delete employee ///////////
    static deleteEmployee(request, response) {
        let employeeId = request.params.employeeId
        let storeId = request.params.id

        Employees.destroy({
            where: {
                id: employeeId
            },
            include: {
                model: Stores,
                attributes: ['id']
            }
        })
            .then((data) => {
                console.log(data);
                response.redirect(`/stores/${storeId}`)
            })
            .catch((err) => {
                response.send(err)
                console.log(err);
            })
    }
    /////////get edit employee //////////
    static formEditEmployee(request, response) {
        let id = +request.params.id
        let employeeId = +request.params.employeeId
        const errors = request.query.errors
        Stores.findByPk(id, {
            attributes: ['id'],
            include: {
                model: Employees,
                where: {
                    id: employeeId
                },
                attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'education', 'position', 'salary']
            }
        })
            .then((data) => {
                response.render('editform', { data, errors})
            })
            .catch((err) => {
                if (err.name == "SequelizeValidationError") {
                    err = err.errors.map(el => el.message)
                }
                response.send(err)
                console.log(err);
            })
    }
    //////////post edit employee /////////////
    static editEmployee(request, response) {
        let { firstName, lastName, dateOfBirth, education, position, salary } = request.body
        console.log(request.body);
        let storeId = request.params.id
        let id = request.params.employeeId

        Employees.update({ firstName, lastName, dateOfBirth, education, position, salary }, {
            where: {
                id: id
            }
        })
            .then((data) => {
                response.redirect('/employees')
            })
            .catch((err) => {
                if (err.name == "SequelizeValidationError") {
                    err = err.errors.map(el => el.message)
                }
                response.redirect(`/stores/${storeId}/employees/${id}/edit?errors=${err}`)
                // response.send(err)
            })
    }
}

module.exports = Controller