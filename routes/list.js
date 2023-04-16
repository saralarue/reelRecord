const express = require('express') // Importing the express library
const router = express.Router() // Creating an express router
const listController = require('../controllers/list') // Importing the listController module
const { ensureAuth } = require('../middleware/auth') // Importing the ensureAuth middleware function

module.exports = router // Exporting the router for use in other modules
