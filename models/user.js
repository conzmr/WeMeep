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
    location: String,
    password: {
      type: String,
      required: true
    },
    ideas: [{
      type: mongoose.Schema.Types.ObjectId, /* Object ID from ideas */
      ref: 'Idea'
    }],
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender: String,
    testResults: {
      creative: {type: Number, default: 0},
      coordinator: {type: Number, default: 0},
      manager: {type: Number, default: 0},
      networker: {type: Number, default: 0},
      supporter: {type: Number, default: 0},
      researcher: {type: Number, default: 0},
      analyzer: {type: Number, default: 0},
      perfectionist: {type: Number, default: 0},
      specialist: {type: Number, default: 0}
    },
    //new attributes
    profession: String,
    birthdate: Number,
    // notifications
    notifications:[{
      type: mongoose.Schema.Types.ObjectId, /* Object ID from ideas */
      ref: 'Notification'
    }]
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
