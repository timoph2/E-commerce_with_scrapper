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

app.post('/checkout', (req,res) => {
    let {iphone6, iphone7, iphoneX, samsung3, samsung4, samsung5} = req.body
    console.log(req.body)
    let items = [ ['iPhone 6', iphone6, 15], ['iPhone 7', iphone7, 25], ['iPhone X', iphoneX, 35], ['Samsung S3', samsung3, 10], ['Samsung S4', samsung4, 20], ['Samsung S5', samsung5, 30] ]
    //try think how use loop to make this easily scalable 
    console.log(items)
    res.render('checkout.ejs', {items: items})
})




app.listen(3003, ()=>{
    console.log('running on port 3003!')
})
