const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_CONN;
mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("DB Connected...")
})
.catch(()=>{
    console.log("Error..")
})
