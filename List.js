module.exports = {
    // Check if the user is authenticated
    ensureAuth: function(req, res, next) {
        // If the user is authenticated, continue to the next middleware
        if (req.isAuthenticated()) {
            return next()
        // If the user is not authenticated, redirect to the home page
        } else {
            res.redirect("/")
        }
    }
}
