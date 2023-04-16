// Import the express library and create an express router instance
const express = require('express')
const router = express.Router()

// Import the searchController module
const searchController = require('../controllers/search')

// Import the ensureAuth middleware
const { ensureAuth } = require('../middleware/auth')

// Define GET route to handle movie search requests
router.get('/searchMovie', searchController.searchMovie)

// Define GET route to show a single movie result
router.get('/showSingleResult', searchController.showSingleResult)

// Define POST routes to handle creation of watched and watchlist movies
router.post('/createWatched', searchController.createWatched)
router.post('/createWatchlist', searchController.createWatchlist)

// Define DELETE routes to handle deletion of watched and watchlist movies
router.delete('/deleteWatched/:id', searchController.deleteWatched)
router.delete('/deleteWatchlist/:id', searchController.deleteWatchlist)

// Export the router
module.exports = router
