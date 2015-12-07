var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    /**
     * define User Schema
     * @type {*|Schema}
     */
    User = Schema({
        first_name: {
            type: String,
            unique: false,
            required: true
        },
        last_name: {
            type: String,
            unique: false,
            required: true
        },
        title: {
            type: String,
            unique: false,
            required: false
        },
        linkedin_id: {
            type: String,
            unique: false,
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

User.pre('save', function(next){
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('User', User);