// Happy coding guys
const express = require('express')
const Controller = require('./controller/controller')
const routes = require('./routers/index')
const app = express()
const port = 3000

app.set('view engine','ejs')
app.use(express.urlencoded({ extended:false}))

app.use('/', routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})