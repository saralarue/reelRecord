// Import the necessary modules
const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

// Export the getLogin function
exports.getLogin = (req, res) => {
    // If the user is already logged in
    if (req.user) {
        // Redirect to the search page
        return res.redirect('/search')
    }
    // Render the login page
    res.render('login', {
        title: 'Login',
    })
}

// Export the loginGuest function
exports.loginGuest = (req, res) => {
    // Checking if the entered username and password match the expected guest credentials
    if (req.body.username === 'Guest' && req.body.password === 'guestpassword') {
        // Redirecting to the search page
        return res.redirect('/search')
    }
    // Rendering the search page with the user as Guest
    res.render('search', {
        user: 'Guest'
    })
    // Logging a message to the console indicating a guest has logged in
    console.log('logged in as guest')
}

// Export the postLogin function
exports.postLogin = (req, res, next) => {
    // Array to store validation errors
    const validationErrors = []
    // Checking if the entered email is valid
    if (!validator.isEmail(req.body.email))
        // Adding an error message for invalid email
        validationErrors.push({
            msg: 'Please enter a valid email address.'
        })
    // Checking if the password field is empty
    if (validator.isEmpty(req.body.password))
        // Adding an error message for empty password
        validationErrors.push({
            msg: 'Password cannot be blank.'
        })
    // If there are any validation errors
    if (validationErrors.length) {
        // Adding the validation errors to flash messages
        req.flash('errors', validationErrors)
        // Redirecting back to the login page
        return res.redirect('/login')
    }
    // Normalizing the email address
    req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
    })
    // Authenticating the user with passport
    passport.authenticate('local', (err, user, info) => {
        // If there is an error in authentication
        if (err) {
            // Forwarding the error to the next middleware
            return next(err)
        }
        // If the authentication fails
        if (!user) {
            // Adding the error message to flash messages
            req.flash('errors', info)
            // Redirecting back to the login page
            return res.redirect('/login')
        }
        // Logging the user in
        req.logIn(user, (err) => {
            // If there is an error in logging in
            if (err) {
                // Forwarding the error to the next middleware
                return next(err)
            }
            // Adding a success message to flash messages
            req.flash('success', {
                msg: 'Success! You are logged in.'
            })
            // Redirecting to the search page or the previously visited page
            res.redirect(req.session.returnTo || '/search')
        })
    })(req, res, next)
}

exports.logout = (req, res) => {
    // Log the user out using the req.logout method
    req.logout(() => {
        // Log that the user has logged out
        console.log('User has logged out.')
    })
    // Destroy the user's session
    req.session.destroy((err) => {
        // If there is an error destroying the session, log the error
        if (err) {
            console.log('Error: Failed to destroy the session during logout.', err)
        }
        // Set the user property to null
        req.user = null
        // Redirect the user to the homepage
        res.redirect('/')
    })
}

exports.getSignup = (req, res) => {
    // If the user is already logged in, redirect them to the search page
    if (req.user) {
        return res.redirect('/search')
    }
    // Otherwise, render the signup page with a title of "Create Account"
    res.render('signup', {
        title: 'Create Account',
    })
}

exports.postSignup = (req, res, next) => {
    // Initialize an array to store any validation errors that occur during user input validation
    const validationErrors = []
    // Check if the entered email is valid using the isEmail function from the validator module
    if (!validator.isEmail(req.body.email)) {
        // If the email is not valid, add an error message to the validation errors array
        validationErrors.push({
            msg: 'Please enter a valid email address.'
        })
    }
    // Check if the entered password is at least 8 characters long using the isLength function from the validator module
    if (!validator.isLength(req.body.password, {
            min: 8})) {
        // If the password is not at least 8 characters long, add an error message to the validation errors array
        validationErrors.push({
            msg: 'Password must be at least 8 characters long',
        });
    }
    // Check if the password and confirm password fields match
    if (req.body.password !== req.body.confirmPassword) {
        // If the passwords do not match, add an error message to the validation errors array
        validationErrors.push({
            msg: 'Passwords do not match'
        });
    }
    // Check if there are any validation errors
    if (validationErrors.length) {
        // If there are validation errors, store the errors in a flash message and redirect the user back to the signup page
        req.flash('errors', validationErrors);
        return res.redirect('../signup');
    }
    // Normalize the email using the normalizeEmail function from the validator module
    req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
    })
    // Create a new User object with the provided user data
    const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
    })
    // Search the database for an existing user with the same email or username
    User.findOne({
        $or: [{
                email: req.body.email
            }, {
                userName: req.body.userName
            }]
    }, 
    (err, existingUser) => {
        // If an error occurs while querying the database, return the error
        if (err) return next(err)
        // If a user already exists with the same email address or username, 
        // flash an error message and redirect to the signup page
        if (existingUser) {
            req.flash('errors', {
                msg: 'Account with that email address or username already exists.'
            })
            return res.redirect('../signup')
        }
        // Save the new user to the database
        user.save((err) => {
            // If an error occurs while saving the user, return the error
            if (err) return next(err)
            // Log the user in and redirect to the search page
            req.logIn(user, (err) => {
                if (err) return next(err)
                res.redirect('/search')
            })
        })
    })
}
