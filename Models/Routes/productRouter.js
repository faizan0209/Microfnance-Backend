const express = require('express');
const { isAuthenticated } = require('../../Middleware/auth');
const router = express.Router();


router.get('/',isAuthenticated,(req,res)=>{
    console.log("user details...",req.existingUser)
    res.status.json([
        {
            name: "mobile",
            price: "1200"
        },
        {
            name: "Tv",
            price: "200"
        }
    ])


})

module.exports = router;