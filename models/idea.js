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
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the Feedback */
    ref: 'Feedback'
  }],
  /* interest: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId, /* Object ID from User
        ref: 'User', /* User Schema. Remember to define it as this in the export module
      },
      /* This type could be: money, love, like, dislike 
      type: {
        type: String,
        required: true
      }
  }],*/
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
  views: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }],
});

module.exports = mongoose.model('Idea', ideaSchema);
