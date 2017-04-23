const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    pro: {type: Boolean, default: false},
    email: {
      type: String,
      required: true,
      unique: true
    },
    proDate: Date,
    image: {
      type: String,
      required: false
    },
    bio: String,
    location: {
      city: String,
      state: String
    },
    moments: [{
      type: mongoose.Schema.Types.ObjectId, /* Object ID from moments */
      ref: 'Moment'
    }],
    password: {
      type: String,
      required: true
    },
    ideas: [{
      type: mongoose.Schema.Types.ObjectId, /* Object ID from ideas */
      ref: 'Idea'
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId, /* Object ID from tags */
      ref: 'Tag'
    }],
    username: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
