const express = require('express')
const router = express.Router()
// const Account = require('../models/Account');

// const fetch = (...args) =>
//     import('node-fetch').then(({default:fetch}) => fetch(...args)) // npm install node-fetch
// //^need import in router itself, not in main app.js



router.get('/', (req,res) => {
    let name = req.body.name
    res.render('_.ejs')
})

 



module.exports = router