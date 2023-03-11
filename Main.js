require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const stripe = require('stripe')(process.env.STRIPE_KEY)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));
app.use(express.json()) //to read json 

let randomN_otp
let orders

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL)
console.log(process.env.DB_URLe)
const {Schema,model} = mongoose;
const FeedbackSchema = new Schema({
    feedback: {
    type: String,
    // unique: true  `feedback` must be unique
  },
  rating: Number,
  date: {
    type: Date,
    default: Date.now
  }
})

const Feedback = model("Feedback", FeedbackSchema)

 
app.get('/', (req,res) => {
    let otp_input = 'disabled'
    res.render('login.ejs', {otp_input:otp_input, HP_number:''})
})

app.post('/', (req,res) => {
    let otp_input = ""
    let HP_number = req.body.HP_number
    randomN_otp =  Math.floor(Math.random() * 90000) + 10000; //random 5 digit code

    console.log(HP_number, randomN_otp)

    client.messages
    .create({
       body: randomN_otp,
       from: process.env.TWILIO_TEST_NUMBER,
       to: process.env.my_number 
     })
    .then(message => console.log(message.sid, "hi"));
    //this sends out the SMS

    res.render('login.ejs', {otp_input:otp_input, HP_number:HP_number})
})

app.post('/login', (req,res) => {
    console.log(req.body.otp)
    if (req.body.otp == randomN_otp) {
        res.redirect('/landing') 
        return
    } else {
        res.send('wrong otp!')
    }
})



app.get('/landing', (req,res) => {
    res.render('landing.ejs')
})

app.post('/checkout', (req,res) => {
    let {iphone6, iphone7, iphoneX, samsung3, samsung4, samsung5} = req.body
    orders = req.body
    console.log(orders)
    let items = [ ['iPhone 6', iphone6, 15], ['iPhone 7', iphone7, 25], ['iPhone X', iphoneX, 35], ['Samsung S3', samsung3, 10], ['Samsung S4', samsung4, 20], ['Samsung S5', samsung5, 30] ]
    //try think how use loop to make this easily scalable 
    console.log(items)
    res.render('checkout.ejs', {items: items})
})


// stripe
app.get('/stripe', async (req,res) => {


    // {
    //     iphone6: '2',
    //     iphone7: '0',
    //     iphoneX: '0',
    //     samsung3: '0',
    //     samsung4: '1',
    //     samsung5: '0'
    //   }
      

    orders = new Map([
        [1, {priceInCents: 10000, name: 'Learn React today'}],
        [2, {priceInCents: 20000, name: 'Learn CSS '}]
    ])

    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `/success`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`,
        })
        res.json({ url: session.url })

    } catch(e) {
        res.status(500).json({ error: e.message })
    }


})


app.get('/success', (req,res) => {
    res.render('success.ejs')
    })
   

app.post('/feedback', (req,res) => {
    let rating = req.body.rating
    let feedback = req.body.feedback

    Feedback.create({ 
        feedback: feedback, 
        rating: rating }) 
      res.redirect('/landing')
    })




app.get('/reviews', async (req,res) => {
    let all_feedback = await Feedback.find({}).exec();
    res.render('reviews.ejs', {all_feedback:all_feedback})
})

app.post('/reviews', async (req,res) => {
    let filter = req.body.sort
    let all_feedback = await Feedback.find({}).exec();

    if (filter.includes("rating")) {
        all_feedback.sort(function(a, b) { 
            return a.rating - b.rating;
        })
    } else if (filter.includes("newest")) {
        all_feedback.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            return new Date(b.date) - new Date(a.date);
          });
    }
 
    if (filter[0] == '!') { all_feedback.reverse() }
    res.render('reviews.ejs', {all_feedback:all_feedback})
})






app.listen(3003, ()=>{
    console.log('running on port 3003!')
})
