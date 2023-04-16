const express = require('express') // Import express library
const app = express() // Create express application
const mongoose = require('mongoose') // Import mongoose for database
const passport = require('passport') // Import passport for authentication
const session = require('express-session') // Import express-session for session management
const MongoStore = require('connect-mongo')(session) // Import connect-mongo to store sessions in mongodb
const methodOverride = require('method-override') // Import method-override to use forms for put and delete requests
const flash = require('express-flash') // Import express-flash for flash messages
const logger = require('morgan') // Import morgan for logging
const connectDB = require('./config/database') // Import database connection from config/database.js
const config = require('/config/.env') // Import .env file for configuration

// Import routes
const mainRoutes = require('./routes/main')
const listRoutes = require('./routes/list')
const searchRoutes = require('./routes/search')

// Configure .env file
require('dotenv').config({ path: './config/.env' })

// Configure passport
require('./config/passport')(passport)

// Connect to database
connectDB()

// Set view engine to ejs
app.set('view engine', 'ejs')

// Use public folder as static folder
app.use(express.static('public'))

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Use morgan for logging
app.use(logger('dev'))

// Use method-override to use forms for put and delete requests
app.use(methodOverride('_method'))

// Set up session management with MongoStore
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
)

// Initialize and use passport for authentication
app.use(passport.initialize())
app.use(passport.session())

// Use flash messages for errors, info, etc.
app.use(flash())

// Use routes
app.use('/', mainRoutes)
app.use('/list', listRoutes)
app.use('/search', searchRoutes)

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${PORT}`) 
})
