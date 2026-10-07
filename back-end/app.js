require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about', async (req, res) => {
  // load all messages from database
  try {
    res.json({
      text: ["This page is about Natt Hong!",
        "Natt is currently a junior at NYU majoring in Computer Science at CAS and minoring in Game Engineering at Tandon.",
        "Natt likes programming, breakdancing, eating, playing tetris, playing saxophone, and singing in the shower!",
        "Honestly there's not that much more to know about Natt so here's three fun facts!",
        "Whenever Natt is asked where they live, they say Philly because saying no one will understand what they mean when they say their actual hometown!",
        "Not that it will be revealed here anyway because doxxing is a real issue!",
        "Natt is the current president of the Breakdance Club at NYU!",
        "They originally did Hip Hop for roughly 5 years from elementry school to middle school until covid hit.",
        "After coming to NYU, they were introduced to Breakdancing by the old president of the Breakdance Club.",
        "Natt then proceeded to spend a year constantly practicing until they became half decent at the dance style.",
        "Rumor has it that for 5 bucks they will do a dance move for you. Natt can do this thing called hamboning.",
        "I'm honestly not really sure what it is but it's kind of funny. Like a bunch of slaps happening really fast and loud."],
      image: "https://i.imgur.com/EA129Mb.jpeg",
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve data from the server',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
