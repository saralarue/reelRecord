const bcrypt = require('bcrypt') // Import bcrypt for password hashing and salting
const mongoose = require('mongoose') // Import mongoose module

// UserSchema defines the fields and types of the User document in MongoDB
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true // Ensures that the userName is unique for each user
    },
    email: {
        type: String,
        unique: true // Ensures that the email is unique for each user
    },
    password: String,
})  

// Password hash middleware: hashes the user password before saving it to the database
UserSchema.pre('save', function save(next) {
    const user = this  
    if (!user.isModified('password')) {
        return next()  
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)  
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)  
            }
            user.password = hash  
            next()  
        })  
    })  
})  

// Helper method for validating user's password: compares the candidate password to the stored password hash
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch)  
    })  
}  

// Exports the User model for use in other parts of the application
module.exports = mongoose.model('User', UserSchema)
