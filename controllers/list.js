// Require the models for Watched and Watchlist lists and the search module
const { Watched, Watchlist } = require('../models/List')
const { searchMovie } = require('./search')

module.exports = {
    // Function for getting the search results
    getSearch: async (req, res) => {
        console.log(req.user) // log the user object for debugging purposes
        try {
            // Find the movies that match the search term
            const watched = await Watched.find({
                user: req.user.id
            }) 
            // Render the search page with the search results
            res.render('search.ejs', {
                watched: watched,
                user: req.user
            }) 
        } catch (err) {
            console.log(err) // log any errors for debugging purposes
        }
    },

    // Function for getting the watched page and render it with the user's watched movies
    getWatched: async (req, res) => {
        try {
            // Find the watched movies for the current user and populate the movie information
            const watched = await Watched.find({
                user: req.user.id
            }).populate('watched') 
            // Find the information for the movie being watched
            const data = await Watched.find(req.body.watched)

            // Render the watched page with the watched movies, the user, and the watched movie information
            res.render('watched.ejs', {
                watched: watched,
                user: req.user,
                data: data
            }) 
        } catch (err) {
            console.log(err) // log any errors for debugging purposes
        }
    },

    // Function for getting the watchlist page and render it with the user's watchlist movies
    getWatchlist: async (req, res) => {
        try {
            // Find the watchlist movies for the current user and populate the movie information
            const watchlist = await Watchlist.find({
                user: req.user.id
            }).populate('watchlist') 
            // Render the watchlist page with the watchlist movies and the user
            res.render('watchlist.ejs', {
                watchlist: watchlist,
                user: req.user
            }) 
        } catch (err) {
            console.log(err) // log any errors for debugging purposes
        }
    },
}
