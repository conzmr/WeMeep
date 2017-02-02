const mongoose = require('mongoose');

//Idea Schema
var ideaSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the user administrator */
    ref: 'User',
    required: true
  },
  banner: String,
  description: String,
  categories: [{
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the category */
    ref: 'Category',
    required:true
  }],
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId, /* Object ID from user */
      ref: 'User', /* User Schema. Remember to define it as this in the export module */
      required: true
    },
    stars: [{
      type: mongoose.Schema.Types.ObjectId, /* Object ID from moment */
      ref: 'User', /* Moment Schema. Remember to define it as this in the export module */
      required: true
    }],
    text: String
  }],
  ideaname:String, /* Codename for the project to reference it */
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  moments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Moment'
  }],
  name: {
    type: String,
    required: true
  },
  problem: String,
});

module.exports = mongoose.model('Idea', ideaSchema);
