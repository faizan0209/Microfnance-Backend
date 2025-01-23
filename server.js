const express = require("express")
const app = express()
const cors =require('cors')
require('dotenv').config();
require('./Models/db')
const bodyParser = require('body-parser')
const AuthRouter= require('./Models/Routes/AuthRouter')
const productRouter = require ('./Models/Routes/productRouter')
const PORT = process.env.PORT||8080;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(bodyParser.json())
app.use(cors())
app.use('/auth',AuthRouter)
app.use('/products',productRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})