const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));


app.get('/', (req,res) => {
    let name = req.body.name
    res.render('landing.ejs')
})




app.listen(3000, ()=>{
    console.log('running on port 3000!')
})
