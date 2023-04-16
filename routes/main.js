// Import the express library and create an express router instance
const express = require('express')
const router = express.Router()

// Import modules
const authController = require('../controllers/auth')
const homeController = require('../controllers/home')
const listController = require('../controllers/list')

// Import the ensureAuth middleware function
const { ensureAuth } = require('../middleware/auth')

// Index route and search
router.get('/', homeController.getIndex) // Get request for the home page
router.get('/search', ensureAuth, listController.getSearch) // Get request for search results with authentication middleware

// Route for guest users
router.get('/loginGuest', authController.loginGuest) // Get request to log in as a guest user

// Get request for the watched and watchlist pages with authentication middleware
router.get('/watched', ensureAuth, listController.getWatched) 
router.get('/watchlist', ensureAuth, listController.getWatchlist) 

// User login/logout/signup routes
router.get('/login', authController.getLogin) // Get request for the login page
router.post('/login', authController.postLogin) // Post request for submitting login information
router.get('/logout', authController.logout) // Get request to log out the user
router.get('/signup', authController.getSignup) // Get request for the signup page
router.post('/signup', authController.postSignup) // Post request for submitting signup information

// Exports the router for use in other parts of the application
module.exports = router 
