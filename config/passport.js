const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

// Passport middleware for authentication
module.exports = function(passport) {
	// Use Local Strategy for user authentication
	passport.use(
		new LocalStrategy({
				// The field in the request body that contains the email
				usernameField: 'email',
			},

			(email, password, done) => {
				User.findOne({
					email: email.toLowerCase(),
				}, (err, user) => {
					if (err) {
						return done(err)
					}
					// User not found
					if (!user) {
						return done(null, false, {
							msg: `Email ${email} not found.`
						})
					}
					// User account was registered using a sign-in provider and password was not set
					if (!user.password) {
						return done(null, false, {
							msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.',
						})
					}
					// Compare user password with entered password
					user.comparePassword(password, (err, isMatch) => {
						if (err) {
							return done(err)
						}
						// If passwords match, return user object
						if (isMatch) {
							return done(null, user)
						}
						// If passwords do not match
						return done(null, false, {
							msg: 'Invalid email or password.'
						})
					})
				})
			})
	)
	// Serialize user
	passport.serializeUser((user, done) => {
		done(null, user.id)
	})
	// Deserialize user
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user))
	})
}
