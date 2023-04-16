const KEY = API_KEY  // Const KEY is assigned the value of API_KEY
const axios = require('axios').default  // Require the axios library for making API requests and set a default instance
const posterURL = 'https://image.tmdb.org/t/p/original'  // Set the URL for retrieving poster images
const { Watched, Watchlist } = require('../models/List')  // Require the Watchlist and Watched models from the '../models/List' module
const defaultImg = 'https://images.unsplash.com/photo-1560109947-543149eceb16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80' // Assign a default image for movies that do not have a poster available

// Create a function that takes in movie data and returns an object with selected movie details
function createMovieData(data) {
    return {
        title: data.title,
        poster: data.poster_path ? `${posterURL}${data.poster_path}` : defaultImg, // Use the poster URL to create the full poster image URL, or use the default image
        overview: data.overview,
        year: data.release_date.slice(0, 4), // Get the year from the release date string
        voteAvg: Math.round(data.vote_average * 10) / 10, // Round the vote average to one decimal place
        movieID: data.id,
    }
}

// Create a function that takes in a request object and returns the user ID or 'Guest' if not logged in
const getUserId = (req) => {
    return req.user ? req.user._id : 'Guest' 
}

// Declare a variable to store the selected movie
let selectedMovie 

// Export functions that can be used to search for movies and add them to the user's watched or watchlist collections
module.exports = {
    searchMovie: async (req, res) => {
        try {
            // Get the user ID or 'Guest'
            const user = getUserId(req)  

            // Get the search term from the query string
            const searchTerm = req.query.searchTerm 

            // Use axios to make an API request to search for movies
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`) 

            // Map the movie data to an array of objects with selected details
            const movieData = response.data.results.map(createMovieData) 

            // Check if movieData is empty
            if (movieData.length === 0) {
                res.render('noResults.ejs', { searchTerm, user })
            } else {
                res.render('multResults.ejs', { user, movieData, searchTerm })
            }

        } catch (err) {
            console.log(err)
        }
    },

    // Function to show details for a single movie
    showSingleResult: async (req, res) => {
        try {
            // Get the user ID or 'Guest'
            const user = getUserId(req)

            // Get the search term and movie ID from the query string
            const searchTerm = req.query.searchTerm 
            const movieID = req.query.movieID 

            // Use axios to make an API request to get the details for the selected movie using the movie's ID
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${KEY}&language=en-US`) 

            // Assign the results to the variable data
            const data = response.data 

            // Extract the movie details we need and assign them to an object
            const movieDetails = {
                title: data.title,
                poster: data.poster_path ? `${posterURL}${data.poster_path}` : defaultImg,
                overview: data.overview,
                year: data.release_date.slice(0, 4),
                voteAvg: Math.round(data.vote_average * 10) / 10,
                movieID: data.id,
            }

            // Render the searchResults.ejs file and pass in the user, movie data, and search term.
            res.render('searchResults.ejs', {
                user,
                ...createMovieData(data),
                ...movieDetails,
                searchTerm
                })

            // Store the selected movie details in a variable for later use in creating watched/watchlist
            selectedMovie = movieDetails

            } catch (err) {
                console.log(err)
            }
    },

    // Adds a movie to the user's watched movies list
    createWatched: async (req, res) => {
        // Assign watchedMovie to the movie details
        watchedMovieData = selectedMovie

        // If the user is logged in, create a new document in the Watched collection.
        try {
            if (req.user) {
                await Watched.create({
                    watched: req.body.watched,
                    user: req.user._id,
                    data: watchedMovieData,
                    poster: watchedMovieData.poster,
                    title: watchedMovieData.title,
                    movieID: watchedMovieData.movieID
                })

                // Render the searchResults.ejs file and pass in the user, movie data, and search term.
                res.render('searchResults.ejs', {
                    user: req.user._id,
                    ...watchedMovieData,
                })
                // Render the searchResults.ejs file and pass in the user, movie data, and search term.

            } else {
                // If the user is not logged in, render the resultsPopup.ejs to have the user create an account or login
                res.render('resultsPopup.ejs', {
                    user: 'Guest',
                    ...watchedMovieData,
                })
            }
        } catch (err) {
            // Alert the user that movie they have selected has already been added to their list
            console.log('This movie has already been added to the watched list')

            if (req.user) {
                res.render('duplicatePopup.ejs', {
                    user: req.user._id,
                    ...watchedMovieData,
                })
            } else {
                res.render('resultsPopup.ejs')
            }
        }
    },
   
    // Adds a movie to the user's watched movies list
    createWatchlist: async (req, res) => {
        // Assign watchedMovie to the movie details
        watchlistMovieData = selectedMovie

        // If the user is logged in, create a new document in the Watched collection.
        try {
            if (req.user) {
                await Watchlist.create({
                    watchlist: req.body.watchedlist,
                    user: req.user._id,
                    data: watchlistMovieData,
                    poster: watchlistMovieData.poster,
                    title: watchlistMovieData.title,
                    movieID: watchlistMovieData.movieID
                })

                // Render the searchResults.ejs file and pass in the user, movie data, and search term.
                res.render('searchResults.ejs', {
                    user: req.user._id,
                    ...watchlistMovieData,
                })
            } else {
                // If the user is not logged in, render the resultsPopup.ejs to have the user create an account or login
                res.render('resultsPopup.ejs', {
                    user: 'Guest',
                    ...watchlistMovieData,
                })
            }
        } catch (err) {
            // Alert the user that movie they have selected has already been added to their list
            console.log('This movie has already been added to the watched list')

            if (req.user) {
                res.render('duplicatePopup.ejs', {
                    user: req.user._id,
                    ...watchlistMovieData,
                })
            } else {
                res.render('resultsPopup.ejs')
            }
        }
    },

    // Removes a movie from the user's watched movies list
    deleteWatched: async (req, res) => {
        try {
            // Find post by ID
            let watched = await Watched.findById({
                _id: req.params.id
            }) 

            // Deletes post from the database
            await Watched.remove({
                _id: req.params.id
            }) 

            console.log('Deleted Movie') 
            res.redirect('/watched') 
        } catch (err) {
            res.redirect('/profile') 
        }
    },

    // Removes a movie from the user's watchlist
    deleteWatchlist: async (req, res) => {
        try {
            // Find post by ID
            let watchlist = await Watchlist.findById({
                _id: req.params.id
            }) 

            // Deletes post from the database
            await Watchlist.remove({
                _id: req.params.id
            }) 

            console.log('Deleted Movie') 
            res.redirect('/watchlist') 
        } catch (err) {
            res.redirect('/profile') 
        }
    },
}
