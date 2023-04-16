module.exports = {
    // Request for the index page
    getIndex: (req, res) => {
        // Render the 'index.ejs' template and send the response
        res.render('index.ejs')
    },
}
